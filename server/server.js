import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import connectDB from './config/db.js';
import authRouter from './Routes/authRoutes.js';
import employeeRouter from './Routes/employeeRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// MIddleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running...');
});
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRouter);
await connectDB();
app.listen(port, () => console.log(`Server is running on port ${port}`));
