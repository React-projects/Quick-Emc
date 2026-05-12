import { useEffect, useState } from 'react';
import { dummyLeaveData } from '../assets/assets';
import Loading from '../components/layout/Loading';
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react';
import LeaveHistory from '../components/leave/LeaveHistory';
import ApplyModal from '../components/leave/ApplyModal';

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const isAdmin = false;
    const fetchLeaves = () => {
        setLeaves(dummyLeaveData);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);
    if (loading) {
        return <Loading />;
    }
    const approveLeaves = leaves.filter((leave) => {
        leave.status === 'APPROVED';
    });
    const skinCount = approveLeaves.filter((leave) => {
        leave.type === 'SICK';
    }).length;
    const causalCount = approveLeaves.filter((leave) => {
        leave.type === 'CAUSAL';
    }).length;
    const annualCount = approveLeaves.filter((leave) => {
        leave.type === 'ANNUAL';
    }).length;

    const leaveStates = [
        {
            label: 'Sick Leave',
            value: skinCount,
            icon: ThermometerIcon,
        },
        {
            label: 'causal Leave',
            value: causalCount,
            icon: UmbrellaIcon,
        },
        {
            label: 'Annual Leave',
            value: annualCount,
            icon: PalmtreeIcon,
        },
    ];
    return (
        <div className='animate-fade-in'>
            <div className='flex flex-col sm:items-center gap-4 mb-8 sm:flex-row justify-between items-start'>
                <div className=''>
                    <h1 className='page-title'>leave Management</h1>
                    <p className='page-subtitle'>{isAdmin ? 'Mange role Application' : 'Your Leave History and Request'}</p>
                </div>
                {!isAdmin && !isDeleted && (
                    <button
                        onClick={() => {
                            setShowModal(true);
                        }}
                        className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'
                    >
                        <PlusIcon className='w-4 h-4' /> Apply for Leave
                    </button>
                )}
            </div>
            {!isAdmin && (
                <div className='grid grid-cols-l sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
                    {leaveStates.map((leaveState) => {
                        return (
                            <div key={leaveState.label} className='card card-hover not-first:p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
                                <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70' />
                                <div className='p-3 bg-slate-100 rounded-lg transition-colors duration-200'>
                                    <leaveState.icon className='w-5 h-5 text-slate-500 rounded group-hover:text-indigo-600 transition-colors duration-200' />
                                </div>
                                <div>
                                    <p className='text-sm text-slat-500'>{leaveState.label}</p>
                                    <p className='font-2xl font-black text-slate-900 tracking-tight'>
                                        {leaveState.value} <span className='text-sm font-normal  text-slate-400'>taken</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
            <ApplyModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                onSuccess={fetchLeaves}
            />
        </div>
    );
};

export default Leave;
