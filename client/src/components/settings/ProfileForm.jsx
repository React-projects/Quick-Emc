import { CalendarDays, FileText, Loader2, Save, SendIcon, User } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function ProfileForm({ initialDate, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // ✅ Fixed: changed from 'massage' to 'message'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const response = await api.post('/profile', data);

            // setMessage('Profile updated successfully');
            toast.success('Profile updated successfully');

            if (onSuccess) onSuccess();
        } catch (error) {
            // const errorMsg = 'Failed to update profile';
            // setError(errorMsg);
            toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='card p-5 sm:p-6 mb-4'>
            <h2 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-200 flex items-center gap-2'>
                <User className='w-5 h-5 text-slate-400' />
                Public Profile
            </h2>

            {/* Error Message */}
            {/* {error && (
                <div className='bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-3'>
                    <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0' />
                    <span className='flex-1'>{error}</span>
                </div>
            )} */}

            {/* Success Message */}
            {/* {message && (
                <div className='bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-3'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0' />
                    <span className='flex-1'>{message}</span>
                </div>
            )} */}

            <div className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Name</label>
                        <input
                            className='bg-slate-50 text-slate-400 cursor-not-allowed w-full rounded-md border border-slate-300 px-3 py-2'
                            type='text'
                            disabled
                            value={`${initialDate.firstName} ${initialDate.lastName}`}
                            aria-label='Profile employee Name'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
                        <input
                            className='bg-slate-50 text-slate-400 cursor-not-allowed w-full rounded-md border border-slate-300 px-3 py-2'
                            type='text'
                            disabled
                            value={initialDate.email}
                            aria-label='Profile employee Email'
                        />
                    </div>

                    <div className='sm:col-span-2'>
                        <label className='block text-sm font-medium text-slate-700 mb-1'>Position</label>
                        <input
                            className='bg-slate-50 text-slate-400 cursor-not-allowed w-full rounded-md border border-slate-300 px-3 py-2'
                            type='text'
                            disabled
                            value={initialDate.position}
                            aria-label='Profile employee Position'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1'>Bio</label>
                    <textarea
                        className={`w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 ${
                            initialDate?.isDeleted ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-white'
                        }`}
                        disabled={initialDate?.isDeleted}
                        defaultValue={initialDate?.bio || ''}
                        name='bio'
                        aria-label='Profile employee Bio'
                        placeholder='Write a brief bio...'
                        rows={4}
                    />
                    <p className='text-sm text-slate-400 mt-1.5'>This will be displayed on your profile</p>
                </div>

                {initialDate?.isDeleted ? (
                    <div className='pt-2'>
                        <div className='p-4 bg-rose-50 border border-rose-200 rounded-xl text-center'>
                            <p className='text-rose-600 font-medium tracking-tight'>Account Deactivated</p>
                            <p className='text-rose-500 text-sm mt-0.5'>You can no longer update your profile</p>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-end pt-2'>
                        <button
                            className='btn-primary flex items-center gap-2 justify-center w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}

export default ProfileForm;
