import mongoose from 'mongoose';
const leaveApplicationSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Employee',
        },
        type: {
            type: String,
            enum: ['CAUSAL', 'SICK', 'ANNUAL'],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
    },
    { timestamps: true },
);
const leaveApplication = mongoose.model.LeaveApplication || mongoose.model('LeaveApplication', leaveApplicationSchema);
export default leaveApplication;
