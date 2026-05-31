// clock in / clock out employees
// post /api/attendees
import Employee from '../models/Employee.js';
import Attendees from '../models/Attendees.js';
import { inngest } from '../inngest/inngestClient.js'; // Adjust path to your Inngest client file

export const clockInOut = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (employee.isDeleted) {
            return res.status(403).json({ message: 'Your account is deactivated, you cannot clock in/out' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await Attendees.findOne({ employeeId: employee._id, date: today });
        const now = new Date();

        // CASE 1: No attendance record for today - CLOCK IN
        if (!existing) {
            const checkInTime = new Date();
            const workStartTime = new Date();
            workStartTime.setHours(9, 0, 0, 0); // 9:00 AM

            const isLate = checkInTime > workStartTime;

            const attendee = await Attendees.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? 'LATE' : 'PRESENT',
            });

            // ✅ Send Inngest event asynchronously (don't await to avoid blocking)
            await inngest.send({
                name: 'employee/check-out',
                data: {
                    employeeId: employee._id,
                    attendanceId: attendee._id,
                },
            });

            return res.json({
                success: true,
                type: 'CHECK_IN',
                data: attendee,
                message: `Checked in at ${now.toLocaleTimeString()}${isLate ? ' (Late)' : ''}`,
            });
        }

        // CASE 2: Already checked out today
        if (existing.checkout) {
            return res.status(400).json({
                success: false,
                message: 'You have already checked out for today',
            });
        }

        // CASE 3: Has check-in but no check-out - CLOCK OUT
        if (existing.checkIn && !existing.checkout) {
            const checkInTime = new Date(existing.checkIn).getTime();
            const checkOutTime = now.getTime();
            const diffMs = checkOutTime - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60);

            const workingHours = parseFloat(diffHours.toFixed(2));

            let dayType = 'SHORT DAY';
            if (workingHours >= 8) {
                dayType = 'FULL DAY';
            } else if (workingHours >= 6) {
                dayType = 'THREE QUARTER DAY';
            } else if (workingHours >= 4) {
                dayType = 'HALF DAY';
            } else if (workingHours >= 2) {
                dayType = 'QUARTER DAY';
            } else {
                dayType = 'SHORT DAY';
            }

            existing.checkout = now;
            existing.workingHours = workingHours;
            existing.dayType = dayType;

            if (existing.status === 'LATE' && workingHours >= 8) {
                existing.status = 'PRESENT';
            }

            await existing.save();

            return res.json({
                success: true,
                type: 'CHECK_OUT',
                data: existing,
                message: `Checked out at ${now.toLocaleTimeString()}`,
                summary: {
                    workingHours: `${workingHours} hours`,
                    dayType: dayType,
                },
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Invalid attendance state',
        });
    } catch (error) {
        console.error('Attendance clock in/out error:', error);
        return res.status(500).json({
            success: false,
            message: 'Operation failed',
            error: error.message,
        });
    }
};
// get attendance records for employees
// get /api/attendees
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.status(404).json({ message: 'employee not found' });
        }
        const limit = parseFloat(req.query.limit || 30);
        const history = await Attendees.find({ employeeId: employee._id }).sort({ date: -1 }).limit(limit);
        return res.json({
            data: history,
            employee: { isDeleted: employee.isDeleted },
        });
    } catch (error) {
        return res.status(500).json({ message: 'failed to get employees ' });
    }
};
