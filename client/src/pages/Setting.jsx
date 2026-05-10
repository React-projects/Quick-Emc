import { useEffect, useState } from 'react';
import { dummyProfileData } from '../assets/assets';
import Loading from '../components/layout/Loading';
import { Lock } from 'lucide-react';
import ProfileForm from '../components/settings/ProfileForm';
import ChangPasswordModal from '../components/settings/ChangPasswordModal';

const Setting = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const fetchProfile = async () => {
        setProfile(dummyProfileData);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    if (loading) return <Loading />;

    return (
        <div className='animate-fade-in'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 '>
                <div>
                    <h1 className='page-title'>Settings</h1>
                    <p className='page-subtitle'>Manage your Account and Preferences</p>
                </div>
            </div>
            {profile && <ProfileForm initialDate={profile} onSucess={fetchProfile} />}
            {/* Change password Trigger */}
            <div className=' card max-w-md p-6 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='p-2.5 text-slate-100 rounded-lg'>
                        <Lock className='w-5 h-5 text-slate-600' />
                    </div>
                    <div className='p-2.5 text-slate-100 rounded-lg'>
                        <p className='font-medium text-slate-900'> Password</p>
                        <p className='text-sm text-slate-500'>Update Your Account password</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setShowPasswordModal(true);
                    }}
                    className='btn-secondary text-sm'
                >
                    change
                </button>
            </div>
            {showPasswordModal && <ChangPasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />}
        </div>
    );
};
export default Setting;
