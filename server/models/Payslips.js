import mongoose from 'mongoose';
const payslipsSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        deduction: {
            type: Number,
            default: 0,
        },
        allowances: {
            type: Number,
            default: 0,
        },
        basicSalary: {
            type: Number,
            required: true,
        },
        netSalary: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);
const Payslips = mongoose.model.Payslips || mongoose.model('Payslips', payslipsSchema);

export default Payslips;
