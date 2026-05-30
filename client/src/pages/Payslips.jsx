import { useCallback, useEffect, useState } from 'react';
import { dummyEmployeeData, dummyPayslipData } from '../assets/assets';
import { is } from 'date-fns/locale';
import Loading from '../components/layout/Loading';
import PayslipsList from '../components/payslips/PayslipsList';
import GeneratePayslipsFrom from '../components/payslips/GeneratePayslipsFrom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Payslips = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const fetchPayslips = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/payslips');
            const payslipData = Array.isArray(response.data) ? response.data : response.data.data || [];
            setPayslips(payslipData);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch payslips');
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchPayslips();
    }, [fetchPayslips]);
    useEffect(() => {
        if (isAdmin) {
            api.get('/employees')
                .then((res) => setEmployee(res.data.filter((emp) => !emp.isDeleted)))
                .catch((err) => toast.error(err.response?.data?.message || err.message || 'Failed to fetch employees'));
        }
    }, [isAdmin]);
    if (loading) {
        return <Loading />;
    }

    return (
        <div className='animate-fade-in'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 '>
                <div>
                    <h1 className='page-title'>Payslips</h1>
                    <p className='page-subtitle'>{isAdmin ? 'Generate and Mange payslips for Employees' : 'Your Payslip History and Request'}</p>
                </div>
                {isAdmin && <GeneratePayslipsFrom employees={employee} onSuccess={fetchPayslips} />}
            </div>
            <PayslipsList payslips={payslips} isAdmin={isAdmin} />
        </div>
    );
};

export default Payslips;
