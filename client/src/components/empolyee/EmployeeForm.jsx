import { useState } from 'react';
import { data, Navigate, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../../assets/assets';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Loader2Icon } from 'lucide-react';

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const editMode = !!initialData;
    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        if (editMode) {
            const pwd = formData.get('password');
            if (!pwd) {
                formData.delete('password');
            }
        }
        try {
            const url = editMode ? `/employees/${initialData.id}` : '/employees';
            const method = editMode ? 'put' : 'post';

            // console.log('Attempting:', method, url);
            // console.log('FormData entries:', [...formData.entries()]);

            const response = await api[method](url, formData);

            // console.log('Response:', response); // Check if we get here
            if (editMode) {
                toast.success('Employee updated successfully!');
            } else {
                toast.success('Employee added successfully!');
            }
            onSuccess ? onSuccess() : navigation('/employee');
        } catch (error) {
            // console.log('Error caught:', error); // Check if error is being caught
            // console.log('Error response:', error?.response);
            toast.error(error?.response?.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleEmployeeSubmit} className='space-y-6 max-w-3x1 animate-fade-in'>
                {/* {/Personal Information  /} */}
                <div className='card p-5 sm:p-6'>
                    <h3 className='font-medium mb-6 pb-4 border-b'>Personal Information</h3>{' '}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                        <div>
                            <label className='block mb-2'>First Name</label>
                            <input type='text' name='firstName' aria-label='First Name' required defaultValue={initialData?.firstName} />
                        </div>
                        <div>
                            <label className='block mb-2'>Last Name</label>
                            <input type='text' name='lastName' aria-label='Last Name' required defaultValue={initialData?.lastName} />
                        </div>
                        <div>
                            <label className='block mb-2'>Phone Number</label>
                            <input type='text' name='phone' aria-label='Phone Number' required defaultValue={initialData?.phone} />
                        </div>
                        <div>
                            <label className='block mb-2'>Join Date</label>
                            <input type='date' name='joinDate' aria-label='Join Date' required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : ''} />
                        </div>
                        <div className=' sm:col-span-2'>
                            <label className='block mb-2'>Bio(optional) </label>
                            <textarea className='resize-none' type='text' placeholder='brief Descriptions' name='bio' aria-label='Bio' defaultValue={initialData?.bio} rows={3} />
                        </div>
                    </div>
                </div>
                {/* employee Details  */}
                <div className='card p-5 sm:p-5'>
                    <h3 className='text-base font-medium text-slate-900 mb-6 pb4 border-b border-slate-100'>Employment Details</h3>
                    <div className='grid grid-cols-l sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                        <div>
                            <label className='block mb-2'> Department</label>
                            <select name='department' defaultValue={initialData?.department || ''}>
                                <option value=''>All Departments</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option key={dept.name} value={dept.name}>
                                        {dept}
                                    </option>
                                ))}{' '}
                            </select>
                        </div>
                        <div>
                            <label className='block mb-2'>position </label>
                            <input type='text' name='position' aria-label='position employee' required defaultValue={initialData?.position} />
                        </div>
                        <div>
                            <label className='block mb-2'>Basic salary </label>
                            <input type='number' name='basicSalary' aria-label='Basic salary' min='0' step='0.01' required defaultValue={initialData?.basicSalary || 0} />
                        </div>
                        <div>
                            <label className='block mb-2'>Allowances </label>
                            <input type='number' name='allowances' min='0' step='0.01' aria-label='allowances employee' required defaultValue={initialData?.allowance} />
                        </div>
                        <div>
                            <label className='block mb-2'>Deductions </label>
                            <input type='number' name='deductions' min='0' step='0.01' aria-label='deductions employee' required defaultValue={initialData?.deduction} />
                        </div>
                        {editMode && (
                            <div>
                                <label className='block mb-2'>Status </label>
                                <select name='employmentStatus' aria-label='employmentStatus' required defaultValue={initialData?.employmentStatus}>
                                    <option value='Active'> Active</option>
                                    <option value='inActive'> in Active</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* account set up */}
                <div className='card p-5 sm:p-6'>
                    <h3 className=' test-base font-medium mb-6 pb-4 text-slate-900 border-b border-slate-100'>Account setUp</h3>{' '}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                        <div className='sm:col-span-2'>
                            <label className='block mb-2'>Work Emil</label>
                            <input type='email' name='email' aria-label='Email' required defaultValue={initialData?.email} />
                        </div>
                        {!editMode && (
                            <div>
                                <label className='block mb-2'>Temporary password</label>
                                <input type='password' name='password' aria-label='password' required />
                            </div>
                        )}
                        {editMode && (
                            <div>
                                <label className='block mb-2'>Change Password (Optional)</label>
                                <input type='password' name='password' aria-label='password' placeholder='leave blank to keep current password' />
                            </div>
                        )}
                        <div>
                            <label className='block mb-2'>system Role</label>
                            <select name='role' defaultValue={initialData?.user?.role || 'Employee'}>
                                <option value='ADMIN'>Admin</option>
                                <option value='EMPLOYEE'>Employee</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* Buttons */}

                <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                    <button
                        type='button'
                        className='btn-secondary'
                        onClick={() => {
                            onCancel ? onCancel() : navigation(-1);
                        }}
                    >
                        Cancel
                    </button>
                    <button type='Submit' disabled={loading} className='btn-primary flex items-center justify-center'>
                        {editMode ? 'Update Employee' : 'Create Employee'}
                        {loading && <Loader2Icon className=' w-4 h-4 mr-2 animate-spin ' />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
