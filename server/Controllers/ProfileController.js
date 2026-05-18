import Employee from '../models/Employee.js';

// get profile
// get/api/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.json({
                firstName: 'Admin',
                lastName: '',
                email: session.email,
            });
        }
        return res.json(employee);
    } catch (error) {
        return res.status(500).json({ message: 'failed to get profile' });
    }
};

// update profile
// post/api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        if (employee.isDeleted) {
            return res.status(404).json({ message: ' Your account is deactivated,  you cannot update your profile' });
        }
        await Employee.findOneAndUpdate(employee._id, { bio: req.body.bio });
        return res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'failed to update profile' });
    }
};
