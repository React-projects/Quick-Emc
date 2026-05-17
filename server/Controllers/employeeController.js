import Employee from '../models/Employee.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
// Get employees
// GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const where = {};
        if (department) {
            where.department = department;
        }
        const employees = await Employee.find(where).toSorted({ createdAt: -1 }).populate('userId', 'role email').lean();
        const result = employees.map((employee) => ({
            ...employee,
            id: employee._id.toString(),
            user: employee.userId ? { email: employee.userId.email, role: employee.userId.role } : null,
        }));
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: 'failed to get employees' });
    }
};
// Create employee
// Post /api/employees/:id
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, department, basicSalary, password, role, bio, phone, position, deductions, joinDate } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'firstName, lastName, email and password are required' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashed,
            role: role || 'EMPLOYEE',
        });
        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || 'Engineering',
            basicSalary: Number(basicSalary) || 0,
            deductions: Number(deductions) || 0,
            allowances: Number(allowances) || 0,
            joinDate: new Date(joinDate),
            bio: bio || '',
        });
        return res.status(201).json({ success: true, employee });
    } catch (error) {
        if ((error.code = 11000)) {
            return res.status(400).json({ message: 'email already exists' });
        }
        console.error('Error creating employee:', error);
        return res.status(500).json({ message: 'failed to create employee' });
    }
};

// update  employee
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, department, basicSalary, password, role, bio, phone, position, deductions, employeeStatus } = req.body;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || 'Engineering',
            basicSalary: Number(basicSalary) || 0,
            deductions: Number(deductions) || 0,
            allowances: Number(allowances) || 0,
            employeeStatus: employeeStatus || 'Active',
            bio: bio || '',
        });
        //  update user Record
        const userUpdate = { email };
        if (role) {
            userUpdate.role = role;
        }
        if (password) {
            userUpdate.password = await bcrypt.hash(password, 10);
        }
        await User.findByIdAndUpdate(employee.userId, userUpdate);

        return res.json({ success: true });
    } catch (error) {
        if ((error.code = 11000)) {
            return res.status(400).json({ message: 'email already exists' });
        }
        return res.status(500).json({ message: 'failed to update employee' });
    }
};

// delete  employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        employee.isDeleted = true;
        employee.employedStatus = 'Inactive';
        await employee.save();
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: 'failed to delete employee' });
    }
};
