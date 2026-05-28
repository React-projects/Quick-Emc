import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// login admin and employee
// post /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password, role = {} } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email, password  are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (role.type == 'admin' && user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Not authorized as Admin' });
        }
        if (role.type == 'employee' && user.role !== 'EMPLOYEE') {
            return res.status(401).json({ message: 'Not authorized as Employee' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: payload, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'login failed' });
    }
};
// get session for Employee and admin
// get /api/auth/session
export const getSession = async (req, res) => {
    const session = req.session;
    return res.json({ session });
};

// change password for employee and admin
// put /api/auth/changePassword
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'currentPassword and newPassword are required' });
        }
        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid current password' });
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, { password: hashed });
        return res.json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'failed to change password' });
    }
};
