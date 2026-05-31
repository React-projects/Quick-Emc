// Get  dashboard for Employee and admin
// GET /api/dashboard
import Employee from '../models/Employee.js';
import Attendees from '../models/Attendees.js';
import LeaveApplication from '../models/leaveApplication.js';
import bcrypt from 'bcrypt';
import { DEPARTMENTS } from '../constants/departments.js';
import Payslips from '../models/Payslips.js';

// Get dashboard for Employee and admin
// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;

        if (session.role === 'ADMIN') {
            // Get today's date range properly
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            const [totalEmployees, pendingLeaves, todayAttendance] = await Promise.all([
                Employee.countDocuments({ isDeleted: { $ne: true } }),
                LeaveApplication.countDocuments({ status: 'PENDING' }), // Fixed: Now counting leaves, not attendees
                Attendees.countDocuments({
                    date: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                }),
            ]);

            return res.json({
                role: 'ADMIN',
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves,
            });
        } else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Fixed: Added month correctly

            const [pendingLeaves, lastPayslip, currentMonthAttendance] = await Promise.all([
                LeaveApplication.countDocuments({
                    employeeId: employee._id,
                    status: 'PENDING',
                }),
                Payslips.findOne({ employeeId: employee._id })
                    .sort({ createdAt: -1 }) // Fixed: 'createAt' to 'createdAt' (check your schema field name)
                    .lean(),
                Attendees.countDocuments({
                    employeeId: employee._id,
                    date: {
                        $gte: startOfMonth,
                        $lt: endOfMonth, // Fixed: Now using proper end of month
                    },
                }),
            ]);

            return res.json({
                role: 'EMPLOYEE',
                employee: {
                    ...employee,
                    id: employee._id.toString(),
                },
                currentMonthAttendance: currentMonthAttendance || 0,
                lastPayslip: lastPayslip
                    ? {
                          ...lastPayslip,
                          id: lastPayslip._id.toString(),
                      }
                    : null,
                pendingLeaves: pendingLeaves || 0,
            });
        }
    } catch (error) {
        console.error('Dashboard Error:', error);
        return res.status(500).json({
            message: 'Failed to get dashboard data',
            error: error.message,
        });
    }
};
