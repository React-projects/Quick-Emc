import mongoose from 'mongoose';
import { DEPARTMENTS } from '../constants/departments.js';
const attendeesSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Employee',
        },
        date: {
            type: Date,
            required: true,
        },
        checkIn: {
            type: Date,
            default: null,
        },
        checkout: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['PRESENT', 'LATE', 'ABSENT'],
            default: 'PRESENT',
        },
        workingHours: {
            type: Number,
            default: null,
        },
        dayType: {
            type: String,
            enum: ['FULL DAY', 'THREE QUARTER DAY', 'HALF DAY', 'QUARTER DAY', 'SHORT DAY', null],
            default: null,
        },
    },
    { timestamps: true },
);
attendeesSchema.index({ employeeId: 1, date: 1 }, { unique: true });
const Attendees = mongoose.model.Attendees || mongoose.model('Attendees', attendeesSchema);

export default Attendees;
