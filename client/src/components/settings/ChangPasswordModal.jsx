import { Loader2Icon, LockIcon, X } from 'lucide-react';
import { useState } from 'react';

function ChangPasswordModal({ open, onClose }) {
    const [loading, setLoading] = useState(false);
    const [massage, setMassage] = useState({ type: '', text: '' });
    const handelSubmit = async (e) => {
        e.preventDefault();
    };
    if (!open) return null;
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4' onClick={onClose}>
            <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />
            <div
                className=' relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in'
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className='flex items-center justify-between p-6 pb-0'>
                    <h2 className='text-lg font-medium  text-slate-900 flex item-center gap-2'>
                        {' '}
                        <LockIcon className='w-5 h-5 text-slate-400' />
                        Change password
                    </h2>
                    <button onClick={onClose} className='p-2 rounded-Ig hover:bg-slate-100 transition-colors text-slate-40 hover: text-slate-600'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                <form onSubmit={handelSubmit} className='p-6'>
                    {massage.text && (
                        <div
                            className={`p-3 rounded-md text-sm flex items-start gap-3 ${massage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${massage.type === 'success' ? 'bg-emerald-500 ' : 'bg-rose-500 '}`} />
                            {massage.text}
                        </div>
                    )}
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>Current Password</label>
                            <input
                                type='password'
                                name='currentPassword'
                                required
                                className='border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                aria-label=' current Password'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-2'>New Password</label>
                            <input
                                type='password'
                                name='newPassword'
                                required
                                className='border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                aria-label=' new Password'
                            />
                        </div>
                        <div className='flex gap-2 pt-2'>
                            <button onClick={onClose} type='button' className='btn-secondary flex-1'>
                                cancel
                            </button>
                            <button onClick={handelSubmit} disabled={loading} type='submit' className='flex-1 btn-primary flex items-center justify-center gap-2'>
                                {loading && <Loader2Icon className='w-4 h-4 animate-spin' />}
                                Update Password
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangPasswordModal;
