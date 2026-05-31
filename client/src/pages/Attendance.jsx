import { useCallback, useEffect, useState } from 'react';
import { dummyAttendanceData } from '../assets/assets';
import Loading from '../components/layout/Loading';
import CheckInButton from '../components/attendance/CheckInButton';
import AttendanceState from '../components/attendance/AttendanceState';
import AttendanceHistory from '../components/attendance/AttendanceHistory';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Attendance = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    const fetchAttendanceData = useCallback(async () => {
        try {
            const response = await api.get('/attendance');
            // Handle both admin (direct array) and employee (wrapped in .data) responses
            const attendanceData = Array.isArray(response.data) ? response.data : response.data.data || [];
            setHistory(attendanceData);
            if (response.data.employee?.isDeleted) setIsDeleted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch leave data');
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);
    if (loading) {
        return <Loading />;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecord = history.find((r) => {
        return new Date(r.date).toDateString() === today.toDateString();
    });

    return (
        <div className='animate-fade-in'>
            <div className='page-header'>
                <h1 className='page-title'>Attendance</h1>
                <p className='page-subtile'>Track your work hours and daily check-ins</p>
            </div>
            {isDeleted ? (
                <div className='mb-8 p-6 bg-rose-50 border border-rose-2øø rounded-2xl text-center'>
                    <p className='text-rose-600'> can no longer clock in or out because your have been marked as deleted</p>
                </div>
            ) : (
                <div className='mb-8'>
                    <CheckInButton todayRecord={todayRecord} onAction={fetchAttendanceData} />
                </div>
            )}
            <AttendanceState history={history} />
            <AttendanceHistory history={history} />
        </div>
    );
};

export default Attendance;
