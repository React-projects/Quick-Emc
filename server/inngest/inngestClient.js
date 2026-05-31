import { Inngest } from 'inngest';
import Attendees from '../models/Attendees.js';
import Employee from '../models/Employee.js';
import leaveApplication from '../models/leaveApplication.js';
import sendEmail from '../config/nodeMailer.js';

// Create a client to send and receive events
export const inngest = new Inngest({
    id: 'fullstack-emss',
    // isDev: process.env.INNGEST_DEV === '1'
});
// Auto check out for employees
const autoCheckOut = inngest.createFunction({ id: 'auto-check-out', triggers: [{ event: 'employee/check-out' }] }, async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;
    // wait for 9 hours
    await step.sleepUntil('wait-for-the-9-hours', new Date(new Date().getTime() + 9 * 60 * 60 * 1000));
    // get attendance date
    let attendance = await Attendees.findById(attendanceId);
    if (!attendance?.checkout) {
        // get employee data
        const employee = await Employee.findById(employeeId);
        // send reminder email
        await sendEmail({
            to: employee.email,
            subject: 'Attendance Check-out Reminder',
            body: `
                <div style="max-width: 600px;">
                    <h2>Hi ${employee.firstName}, 👋</h2>
                    <p style="font-size: 16px;">You have a check-in in ${employee.department} today:</p>
                    <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
                    <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
                    <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
                    <br />
                    <p style="font-size: 16px;">Best Regards,</p>
                    <p style="font-size: 16px;">EMS</p>
                </div>
            `,
        });
        // After 10 hours, mark attendance as checked out with status "LATE"
        await step.sleepUntil('wait-for-1-hours', new Date(new Date().getTime() + 1 * 60 * 60 * 1000));
        attendance = await Attendees.findById(attendanceId);
        if (!attendance?.checkout) {
            attendance.checkout = new Date(attendanceDate.checkIn).getDate() + 4 * 60 * 60 * 1000;
            attendance.workingHours = 4;
            attendance.dayType = 'Half Day';
            attendance.status = 'LATE';
            await attendance.save();
        }
    }
});
// Send Email to admin, If admin doesn't take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction({ id: 'leave-application-reminder', triggers: [{ event: 'leave/pending' }] }, async ({ event, step }) => {
    const { leaveApplicationId } = event.data;
    // wait for 24 hours
    await step.sleepUntil('wait-for-24-hours', new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
    // get leave application data
    const leaveApplication = await leaveApplication.findById(leaveApplicationId);
    if (leaveApplication.status === 'PENDING') {
        const employee = await Employee.findById(leaveApplication.employeeId);
        // Send reminder email to admin to take action on leave application
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: 'Leave Application Reminder',
            body: `
            <div style="max-width: 600px;">
                <h2>Hi Admin, 👋</h2>
                <p style="font-size: 16px;">You have a leave application in ${employee.department} today:</p>
                <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${leaveApplication?.startDate?.toLocaleDateString()}</p>
                <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
                <br />
                <p style="font-size: 16px;">Best Regards,</p>
                <p style="font-size: 16px;">EMS</p>
            </div>
        `,
        });
    }
});
// Cron: Check at 11:30 AM IST (06:00 UTC) and email absent employees

const attendanceReminderCron = inngest.createFunction({ id: 'attendance-reminder-cron', triggers: [{ cron: '0 6 * * *' }] }, async ({ step }) => {
    // Step 1: Get today's date range
    const today = await step.run("get-today's-date-range", () => {
        const now = new Date();
        const egyptDate = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));

        const startUTC = new Date(Date.UTC(egyptDate.getFullYear(), egyptDate.getMonth(), egyptDate.getDate(), 0, 0, 0, 0));

        const endUTC = new Date(Date.UTC(egyptDate.getFullYear(), egyptDate.getMonth(), egyptDate.getDate(), 23, 59, 59, 999));

        return {
            startUTC: startUTC.toISOString(),
            endUTC: endUTC.toISOString(),
        };
    });

    // Step 2: Get all active non-deleted employees
    const activeEmployees = await step.run('get-all-active-employees', async () => {
        const employees = await Employee.find({
            isDeleted: false,
            employmentStatus: 'Active',
        }).lean();

        return employees.map((employee) => ({
            _id: employee._id.toString(),
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            department: employee.department,
        }));
    });

    // Step 3: Get employees on approved leave today
    const onLeavesIds = await step.run('get-on-leave-ids', async () => {
        const leaves = await leaveApplication
            .find({
                status: 'APPROVED',
                startDate: { $lte: new Date(today.endUTC) },
                endDate: { $gte: new Date(today.startUTC) },
            })
            .lean();

        return leaves.map((leave) => leave.employeeId.toString());
    });

    // Step 4: Get employee IDs who already checked in today
    const checkedInIds = await step.run('get-checked-in-ids', async () => {
        const attendancesData = await Attendees.find({
            date: { $gte: new Date(today.startUTC), $lte: new Date(today.endUTC) },
        }).lean();

        return attendancesData.map((attendance) => attendance.employeeId.toString());
    });

    // Step 5: Filter absent employees
    const absentEmployees = activeEmployees.filter((employee) => !onLeavesIds.includes(employee._id) && !checkedInIds.includes(employee._id));

    // Step 6: Send emails to absent employees
    let emailResult = { emailSent: 0, error: null };

    if (absentEmployees.length > 0) {
        emailResult = await step.run('send-attendance-reminder-email', async () => {
            try {
                const emailPromises = absentEmployees.map((employee) =>
                    sendEmail({
                        to: employee.email,
                        subject: 'Attendance Reminder - Please Mark Your Attendance',
                        body: `
                                <div style="max-width: 600px; font-family: Arial, sans-serif;">
                                    <h2>Hi ${employee.firstName}, 👋</h2>
                                    <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                    <p style="font-size: 16px;">The deadline was <strong> 9:00 AM</strong> and your attendance is still missing.</p>
                                    <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                    <br />
                                    <p style="font-size: 14px; color: #666;">Department: ${employee.department}</p>
                                    <br />
                                    <p style="font-size: 16px;">Best Regards,</p>
                                    <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                                </div>
                            `,
                    }),
                );

                const results = await Promise.all(emailPromises);
                const successful = results.filter((r) => r.success).length;

                return {
                    emailSent: successful,
                    emailFailed: absentEmployees.length - successful,
                    error: successful === 0 ? 'All emails failed' : null,
                };
            } catch (error) {
                return { emailSent: 0, error: error.message };
            }
        });
    }

    return {
        success: true,
        runTime: new Date().toISOString(),
        egyptTime: new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
        totalActive: activeEmployees.length,
        onLeave: onLeavesIds.length,
        checkedIn: checkedInIds.length,
        absent: absentEmployees.length,
        emailsSent: emailResult.emailSent || 0,
    };
});
// Create an empty array where we'll export future Inngest functions
export const functions = [autoCheckOut, leaveApplicationReminder, attendanceReminderCron];
