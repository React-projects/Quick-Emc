import React, { useState } from 'react';
import { getDayTypeDisplay, getWorkingHoursDisplay } from '../../assets/assets';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Check, CrossIcon, Loader2Icon, X } from 'lucide-react';

function LeaveHistory({ leaves, isAdmin, onUpdate }) {
    const [processing, setProcessing] = useState(null);

    const handleStatusUpdate = async (id, status) => {
        setProcessing(id);
    };

    return (
        <div className='card overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='table-modern'>
                    <thead>
                        <tr>
                            {isAdmin && <th className='px-6 py-4'>Employee</th>}
                            <th className='px-6 py-4'>Type</th>
                            <th className='px-6 py-4'> Dates</th>
                            <th className='px-6 py-4'>Reasons</th>
                            <th className='px-6 py-4'>status</th>
                            {isAdmin && <th className='text-center'>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 4} className='text-center py-12 text-slate-400'>
                                    No Leaves Application found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => {
                                const leaveId = leave._id || leave.id;
                                return (
                                    <tr key={leaveId}>
                                        {isAdmin && (
                                            <td className='text-slate-900'>
                                                {leave.employee?.firstName} {leave.employee?.lastName}
                                            </td>
                                        )}
                                        <td>
                                            <span className='badge bg-slate-100 text-slate-600'>{leave.type}</span> {/* ✅ Fixed typo */}
                                        </td>
                                        <td className='text-xs text-slate-500'>
                                            {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className='max-w-xs truncate text-slate-500' title={leave.reason}>
                                            {leave.reason}
                                        </td>
                                        <td>
                                            <span className={`badge ${leave.status === 'APPROVED' ? 'badge-success' : leave.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                {leave.status === 'PENDING' && (
                                                    <div className='flex justify-center gap-2'>
                                                        <button
                                                            onClick={() => handleStatusUpdate(leaveId, 'APPROVED')} // ✅ Arrow function - NOT called immediately
                                                            disabled={!!processing}
                                                            className='p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors' // ✅ Fixed space
                                                        >
                                                            {processing === leaveId ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <Check className='w-4 h-4' />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(leaveId, 'REJECTED')} // ✅ Arrow function - NOT called immediately
                                                            disabled={!!processing}
                                                            className='p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors' // ✅ Fixed spaces
                                                        >
                                                            {processing === leaveId ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <X className='w-4 h-4' />}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaveHistory;
