import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
const temporaryPassword = 'admin123';

const registerAdmin = async () => {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        if (!ADMIN_EMAIL) {
            console.error(' ADMIN_EMAIL is not defined in .env file. Please add it.');
            process.exit(1);
        }
        await connectDB();
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('User already exists as role:', existingAdmin.role);
            process.exit(0);
        }
        const hashPassword = await bcrypt.hash(temporaryPassword, 10);
        const admin = await User.create({
            email: process.env.ADMIN_EMAIL,
            password: hashPassword,
            role: 'ADMIN',
        });
        console.log('Admin created successfully:', admin);
        console.log('\nemail:', admin.email);
        console.log('password:', temporaryPassword);
        console.log('\nchange password after login');
        process.exit(0);
    } catch (error) {
        console.error('Error registering admin:', error);
        process.exit(1);
    }
};
registerAdmin();
