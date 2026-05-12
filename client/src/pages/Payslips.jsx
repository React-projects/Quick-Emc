import { useCallback, useEffect, useState } from 'react';
import { dummyEmployeeData, dummyPayslipData } from '../assets/assets';
import { is } from 'date-fns/locale';
import Loading from '../components/layout/Loading';
import PayslipsList from '../components/payslips/PayslipsList';
import GeneratePayslipsFrom from '../components/payslips/GeneratePayslipsFrom';

const Payslips = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState([]);
    const isAdmin = true;
    const fetchPayslips = useCallback(async () => {
        setLoading(true);
        setPayslips(dummyPayslipData);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);
    useEffect(() => {
        fetchPayslips();
    }, [fetchPayslips]);
    useEffect(() => {
        if (isAdmin) setEmployee(dummyEmployeeData);
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
