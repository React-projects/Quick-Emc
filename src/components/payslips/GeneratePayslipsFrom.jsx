import { Loader2Icon, Plus, SendIcon, X } from 'lucide-react';
import { useState } from 'react';

const GeneratePayslipsFrom = ({ employees, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setIsLoading] = useState(false);
    if (!isOpen)
        return (
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className=' btn-primary flex items-center gap-2'
            >
                <Plus className='w-4 h-4' /> Generate Payslips
            </button>
        );
    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 P-4'>
            <div className='card max-w-lg w-full p-6 animate-slide-up'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-lg font-bold text-slate-900'>Generate Monthly Payslips</h2>
                    <button
                        className='text-slate-400 hover:text-slate-600 p-1'
                        onClick={() => {
                            setIsOpen(false);
                        }}
                    >
                        <X className='size={20}' />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className=' space-y-4'>
                    {/* - select Employee - */}
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-2 block'> Employee</label>
                        <select name='EmployeeID' required>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName} ({employee.position})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/*  select month and year */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='text-sm font-medium text-slate-700 mb-2 block'> Month</label>
                            <select name='EmployeeID' required ar>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}{' '}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='text-sm font-medium text-slate-700 mb-2 block'> Year</label>
                            <input type='number' name='Year' defaultValue={new Date().getFullYear()} aria-label=' employee year ' />
                        </div>
                    </div>
                    {/* - Basic-salary  } */}
                    <div>
                        <label className='text-sm font-medium text-slate-700 mb-2 block'> Basic Salary</label>
                        <input type='number' name='basicSalary' required placeholder='Enter basic salary' aria-label=' employee basic Salary' />
                    </div>
                    {/* - Allowance and Deduction  } */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='text-sm font-medium text-slate-700 mb-2 block'> Allowance </label>
                            <input type='number' name='allowanceSalary' placeholder='Enter allowance salary' aria-label=' employee allowance Salary' defaultValue={0} />
                        </div>
                        <div>
                            <label className='text-sm font-medium text-slate-700 mb-2 block'> Deduction </label>
                            <input type='number' name='deductionSalary' placeholder='Enter deduction salary' aria-label=' employee deduction Salary' defaultValue={0} />
                        </div>
                    </div>

                    {/* - buttons - */}
                    <div className='flex gap-2 pt-2'>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            type='button'
                            className='btn-secondary flex-1'
                        >
                            cancel
                        </button>
                        <button onClick={onclose} disabled={loading} type='submit' className='flex-1 btn-primary flex items-center justify-center gap-2'>
                            {loading && <Loader2Icon className='w-4 h-4 animate-spin' />}
                            Generate Payslips
                        </button>
                    </div>
                </form>{' '}
            </div>
        </div>
    );
};

export default GeneratePayslipsFrom;
