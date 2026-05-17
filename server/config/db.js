import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected');
        });

        const conn = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
