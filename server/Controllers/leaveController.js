import { inngest } from '../inngest/index.js';
import Employee from '../models/Employee.js';
import LeaveApplication from '../models/leaveApplication.js';

//  create a leave
// post /api/leave
export const createLeave = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.status(404).json({ message: 'employee not found' });
        }
        if (employee.isDeleted) {
            return res.status(403).json({ message: ' your account is deactivated,  you cannot create a leave' });
        }
        const { type, reason, startDate, endDate } = req.body;
        if (!type || !reason || !startDate || !endDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(startDate) <= today || new Date(endDate) <= today) {
            return res.status(400).json({ error: 'Start date and end date must be in the future' });
        }
        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            reason,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'PENDING',
        });

        if (process.env.INNGEST_EVENT_KEY) {
            try {
                await inngest.send({
                    name: 'leave/pending',
                    data: {
                        leaveApplicationId: leave._id,
                    },
                });
            } catch (inngestError) {
                console.error('Inngest error (non-fatal):', inngestError.message);
                // Don't fail the request
            }
        } else {
            console.log('Inngest not configured, skipping event');
        }

        return res.json({ success: true, data: leave });
    } catch (error) {
        // Log the actual error
        console.error('Create leave error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        // Return the actual error message
        return res.status(500).json({
            message: 'Failed to create leave',
            error: error.message, // This will show the real issue
        });
    }
};
// get all leaves
// get /api/leave/
export const getLeaves = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === 'ADMIN';
        if (isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            const leave = await LeaveApplication.find(where).populate('employeeId').sort({ createdAt: -1 });
            const data = leave.map((leave) => {
                const obj = leave.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id.toString(),
                };
            });
            return res.json(data);
        } else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();
            if (!employee) {
                return res.status(404).json({ message: 'employee not found' });
            }
            const leave = await LeaveApplication.find({ employeeId: employee._id }).sort({ createdAt: -1 });

            return res.json({
                data: leave,
                employee: { ...employee, id: employee._id.toString() },
            });
        }
    } catch (error) {
        res.status(500).json({ message: ' failed to get leave' });
    }
};
// update leave Status
// get /api/leave:id
export const UpdateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
        return res.json({ success: true, data: leave });

        return res.json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ message: ' failed to update leave' });
    }
};
