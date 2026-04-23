import { AlertCircleIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import React from 'react';

const AttendanceState = ({ history }) => {
    const totalPresent = history.filter((h) => {
        (h.status === 'PRESENT') | (h.status === 'LATE');
    }).length;
    const totalLate = history.filter((h) => {
        h.status === 'LATE';
    }).length;
    const Stats = [
        { label: 'Days present', value: totalPresent, icon: CalendarIcon },
        { label: 'Late Arrivals', value: totalLate, icon: AlertCircleIcon },
        { label: 'Avg. Work.Hrs', value: '8.5 Hrs', icon: ClockIcon },
    ];
    return (
        <div className='grid grid-cols-l sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
            {Stats.map((state) => (
                <div key={state.label} className='card card-hover not-first:p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group'>
                    <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70' />
                    <div className='p-3 bg-slate-100 rounded-lg transition-colors duration-200'>
                        <state.icon className='w-5 h-5 text-slate-500 rounded group-hover:text-indigo-600 transition-colors duration-200' />
                    </div>
                    <div>
                        <p className='text-sm text-slate-500'>{state.label}</p>
                        <p className='text-2xl font-medium text-slate-900 tracking-tight'>{state.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceState;
