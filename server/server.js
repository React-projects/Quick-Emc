import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import employeeRoutes from './routes/employeeRoutes.js';
// import leaveRoutes from './routes/leaveRoutes.js';
import multer from 'multer';
import connectDB from './config/db.js';
// import { get } from 'mongoose';

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
await connectDB();
app.listen(port, () => console.log(`Server is running on port ${port}`));
