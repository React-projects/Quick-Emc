import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    console.log('Testing MongoDB Atlas connection...');
    console.log('Connection string exists:', !!process.env.MONGODB_URL);

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connection successful!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
};

export default connectDB;
