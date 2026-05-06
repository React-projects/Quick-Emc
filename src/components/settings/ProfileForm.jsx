import { CalendarDays, FileText, Loader2, Save, SendIcon, User } from 'lucide-react';
import { useState } from 'react';

function ProfileForm({ initialDate, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [massage, setMassage] = useState('');

    const handelSubmit = async (e) => {
        e.preventDefault();
    };
    return (
        <form onSubmit={handelSubmit} className='card p-5 sm:p-6 mb-4'>
            <h2 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-løø flex items-center gap-2'>
                {' '}
                <User className=' w-5 h-5 text-slate-400' />
                Public Profile
            </h2>
            {error && (
                <div className='bg-rose-50 text-rose-700 p-4 rounded-xl tex-sm border  border-rose-200 mb-6 flex item-start gap-3 '>
                    <div className='w-1.5 h-1.5 rounded-full border-rose-500 mt-10.5 shrink-0' />
                    {error}
                </div>
            )}
            {massage && (
                <div className='bg-emerald-50 text-emerald-700 p-4 rounded-xl tex-sm border  border-emerald-200 mb-6 flex item-start gap-3 '>
                    <div className='w-1.5 h-1.5 rounded-full border-emerald-500 mt-10.5 shrink-0' />
                    {massage}
                </div>
            )}
            <div className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Name</label>
                        <input
                            className='bg-slate-50 text-slate-400 cursor-not-allowed'
                            type='text'
                            disabled
                            value={`${initialDate.firstName} ${initialDate.lastName}`}
                            aria-label=' Profile employee Name'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
                        <input className='bg-slate-50 text-slate-400 cursor-not-allowed' type='text' disabled value={`${initialDate.email}`} aria-label=' Profile employee Email' />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Position</label>
                        <input className='bg-slate-50 text-slate-400 cursor-not-allowed' type='text' disabled value={`${initialDate.position}`} aria-label=' Profile employee Position' />
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1'>Bio</label>
                    <textarea
                        className={`resize-none ${initialDate ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}  w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200`}
                        disabled={initialDate.isDeleted}
                        defaultValue={`${initialDate.bio || ''}`}
                        name='bio'
                        aria-label=' Profile employee Bio'
                        placeholder='writer a brief Bio ......'
                    />
                    <p className='text-sm text-slate-400 mt-1.5'> This Will be Display on your profile</p>
                </div>
                {initialDate.isDeleted ? (
                    <div className='pt-2'>
                        <div className='p-4 bg-rose-50 border border-rose-200 rounded-xl text-center'>
                            <p className='text-rose-600 font-medium tracking-tight'>Account DeaActivated</p>
                            <p className='text-rose-500 text-sm mt-0.5'> You can no Longer update your Profile</p>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-end pt-2'>
                        <button className='btn-primary flex items-center gap-2 justify-center w-full sm:w-auto' type='submit' disabled={loading}>
                            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4 ' />}
                            save changes
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}

export default ProfileForm;
