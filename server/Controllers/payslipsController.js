import Payslips from '../models/Payslips.js';
import Employee from '../models/Employee.js';
//  create a payslips
// post /api/payslips
export const createPayslips = async (req, res) => {
    try {
        const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;
        if (!employeeId || !month || !year || !basicSalary) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);
        const payslips = await Payslips.create({
            employeeId,
            month: Number(month),
            year: Number(year),
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0),
            deductions: Number(deductions || 0),
            netSalary,
        });
        return res.json({ success: true, data: payslips });
    } catch (error) {
        res.status(500).json({ message: ' failed to create payslips' });
    }
};
// get  payslips
// get /api/payslips/
export const getPayslips = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === 'ADMIN';
        if (isAdmin) {
            const payslips = await Payslips.find().populate('employeeId').sort({ createAt: -1 });
            const data = payslips.map((payslip) => {
                const obj = payslip.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id.toString(),
                };
            });
            return res.json({ success: true, data: data });
        } else {
            const employee = await Employee.findOne({ userId: session.userId });
            if (!employee) {
                return res.status(404).json({ message: 'employee not found' });
            }
            const payslips = await Payslips.find({ employeeId: employee._id }).sort({ createAt: -1 });
            return res.json({ data: payslips });
        }
    } catch (error) {
        res.status(500).json({ message: ' failed to create payslips' });
    }
};
// get payslips by id
// get /api/payslips:id
export const getPayslipsById = async (req, res) => {
    try {
        const payslips = await Payslips.findById(req.params.id).populate('employeeId').lean();
        if (!payslips) {
            return res.status(404).json({ message: 'payslips not found' });
        }
        const result = {
            ...payslips,
            id: payslips._id.toString(),
            employee: payslips.employeeId,
        };
        return res.json(result);
    } catch (error) {
        res.status(500).json({ message: ' failed to get payslips' });
    }
};
