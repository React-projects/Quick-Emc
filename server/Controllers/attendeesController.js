import Attendees from '../models/Attendees.js';
import Employee from '../models/Employee.js';
// clock in / clock out employees
// post /api/attendees
export const clockInOut = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) {
            return res.status(404).json({ message: 'employee not found' });
        }
        if (employee.isDeleted) {
            return res.status(403).json({ message: ' your account is deactivated,  you cannot clock in/out' });
        }
        const today = new Date();
        s;
        today.setHours(0, 0, 0, 0);
        const existing = await Attendees.findOne({ employeeId: employee._id, date: today });
        const now = new Date();
        if (!existing) {
            const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
            const attendee = await Attendees.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? 'LATE' : 'PRESENT',
            });
            return res.json({ success: true, type: 'CHECK_IN', date: attendee });
        } else if (existing.checkout) {
            const checkInTime = new Date(existing.checkIn).getTime();
            const diffMins = now.getTime() - checkInTime;
            const diffHours = diffMins / (1000 * 60 * 60);
            existing.checkout = now;

            // computing working hours and date type

            const workingHours = parseFloat(diffHours.toFixed(2));
            let dayType = 'half Day';
            if (workingHOurs >= 8) {
                dayType = 'Full Day';
            } else if (workingHOurs >= 6) {
                dayType = 'Three Quarter Day';
            } else if (workingHOurs >= 4) {
                dayType = 'Half Day';
            } else {
                dayType = 'Short Day';
            }
            existing.workingHours = workingHours;
            existing.dayType = dayType;
            await existing.save();
            return res.json({ success: true, type: 'CHECK_OUT', date: existing });
        } else {
            return res.json({ success: true, type: 'CHECK_OUT', date: existing });
        }
    } catch (error) {
        console.error('Attendee clock in/out error:', error);
        return res.status(500).json({ message: 'operation failed' });
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
            date: history,
            employee: { isDeleted: employee.isDeleted },
        });
    } catch (error) {
        return res.status(500).json({ message: 'failed to get employees ' });
    }
};
