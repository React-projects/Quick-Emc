import Employee from '../models/Employee.js';
import Attendees from '../models/Attendees.js';
import LeaveApplication from '../models/leaveApplication.js';
import bcrypt from 'bcrypt';
import { DEPARTMENTS } from '../constants/Departments.js';
import Payslips from '../models/Payslips.js';
// Get  dashboard for Employee and admin
// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;
        if (session.role === 'ADMIN') {
            const [totalEmployees, pendingLeaves, todayAttendance] = await Promise.all([
                Employee.countDocuments({ isDeleted: { $ne: true } }),
                Attendees.countDocuments({
                    date: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(24, 0, 0, 0)),
                    },
                }),
                LeaveApplication.countDocuments({ status: 'PENDING' }),
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
                return res.status(404).json({ message: 'employee not found' });
            }
            const today = new Date();

            const [pendingLeaves, lastPayslip, currentMonthAttendance] = await Promise.all([
                LeaveApplication.countDocuments({ employeeId: employee._id, status: 'PENDING' }),
                Payslips.findOne({ employeeId: employee._id }).sort({ createAt: -1 }).lean(),
                Attendees.countDocuments({
                    employeeId: employee._id,
                    date: {
                        $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                        $lt: new Date(today.getFullYear(), today.getMonth(), +1, 1),
                    },
                }),
            ]);
            return res.json({
                role: 'EMPLOYEE',
                employee: { ...employee, id: employee._id.toString() },
                currentMonthAttendance,
                lastPayslip: lastPayslip ? { ...lastPayslip, id: lastPayslip._id.toString() } : null,
            });
        }
    } catch (error) {
        console.error('dashboard Error', error);
        return res.status(500).json({ message: 'failed to get dashboard data' });
    }
};
