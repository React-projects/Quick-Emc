import { use, useEffect, useState } from 'react';
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets';
import Loading from '../components/layout/Loading';
import Employee from '../components/dashboard/Employee';
import Admin from '../components/dashboard/Admin';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // setData(dummyAdminDashboardData);
        // setTimeout(() => {
        //   setLoading(false);
        // }, 1000);
        api.get('/dashboard')
            .then((data) => {
                const res = data.data;
                setData(res);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loading />;
    }
    if (!data) {
        return <p className='text-center text-slate-500 py-12'>No data available</p>;
    }
    if (data.role === 'ADMIN') {
        return (
            <div>
                <Admin data={data} />
                {/* Render admin-specific dashboard components */}
            </div>
        );
    } else {
        return (
            <div>
                {/* Render employee-specific dashboard components */}
                <Employee data={data} />
            </div>
        );
    }
};

export default Dashboard;
