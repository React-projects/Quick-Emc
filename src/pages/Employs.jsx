import { useCallback, useEffect, useState } from 'react';
import { dummyEmployeeData, DEPARTMENTS } from '../assets/assets';
import { Plus, Search, X } from 'lucide-react';
import Loading from '../components/layout/Loading';
import EmployeeCard from '../components/empolyee/EmployeeCard';
import EmployeeForm from '../components/empolyee/EmployeeForm';

const Employs = () => {
    const [employs, setEmploys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [editEmployee, setEditEmployee] = useState(null);
    const [createEmployeeModal, setCreateEmployeeModal] = useState(false);
    const fetchEmploys = useCallback(async () => {
        setLoading(true);
        setEmploys(dummyEmployeeData.filter((emp) => !selectedDept || emp.department === selectedDept));
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [selectedDept]);

    useEffect(() => {
        fetchEmploys();
    }, [fetchEmploys]);
    const filteredEmploys = employs.filter((emp) => `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className='animate-fade-in'>
            {/* header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className='page-title'>Employees</h1>
                    <p className='page-subtitle'>Manage your team members</p>
                </div>
                <button onClick={() => setCreateEmployeeModal(true)} className=' btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'>
                    <Plus size={16} /> Add Employee
                </button>
            </div>
            {/* search bar  */}
            <div className='flex flex-col sm:flex-row gap-3 mb-6'>
                <div className='flex-1 relative'>
                    <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4' />
                    <input
                        type='text'
                        placeholder='search employs'
                        aria-label='Search employees'
                        className='w-full pl-10'
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        value={searchTerm}
                    />
                </div>
                <select className='max-w-40' value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <option value=''>All Departments</option>
                    {DEPARTMENTS.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>
            {/* employs card */}
            {loading ? (
                <div className='flex items-center justify-center p-10'>
                    <Loading />
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'>
                    {filteredEmploys.length === 0 ? (
                        <p className='col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed'>No employees found.</p>
                    ) : (
                        filteredEmploys.map((emp) => (
                            <EmployeeCard
                                key={emp.id}
                                employee={emp}
                                onDelete={fetchEmploys}
                                onEdit={(e) => {
                                    setEditEmployee(e);
                                }}
                            />
                        ))
                    )}
                </div>
            )}

            {/* show create modal  */}
            {createEmployeeModal && (
                <div className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto' onClick={() => setCreateEmployeeModal(false)}>
                    <div className=' fixed inset-0' />
                    <div
                        className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in'
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className='flex items-center justify-between p-6 pb-0'>
                            <div>
                                <h2 className='text-lg font-semibold text-slate-900'>Create Employee</h2>
                                <p className=' text-sm mt-0.5 text-slate-500'>Create a user account and employee profile</p>{' '}
                            </div>
                            <button
                                onClick={() => createEmployeeModal(false)}
                                className='p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700'
                                onClick={() => setCreateEmployeeModal(false)}
                            >
                                <X className='w-4 h-4' />
                            </button>{' '}
                        </div>
                        <div className='p-6'>
                            <EmployeeForm
                                onsuccess={() => {
                                    setCreateEmployeeModal(false);
                                    fetchEmploys();
                                }}
                                onCancel={() => {
                                    setCreateEmployeeModal(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* show edit modal  */}
            {editEmployee && (
                <div className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto' onClick={() => setCreateEmployeeModal(false)}>
                    <div className=' fixed inset-0' />
                    <div
                        className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in'
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div className='flex items-center justify-between p-6 pb-0'>
                            <div>
                                <h2 className='text-lg font-semibold text-slate-900'>Edit Employee</h2>
                                <p className=' text-sm mt-0.5 text-slate-500'>Update a user account and employee profile</p>{' '}
                            </div>
                            <button
                                onClick={() => editEmployee(null)}
                                className='p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700'
                                onClick={() => setEditEmployee(null)}
                            >
                                <X className='w-4 h-4' />
                            </button>{' '}
                        </div>
                        <div className='p-6'>
                            <EmployeeForm
                                initialData={editEmployee}
                                onsuccess={() => {
                                    setEditEmployee(null);
                                    fetchEmploys();
                                }}
                                onCancel={() => {
                                    setEditEmployee(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employs;
