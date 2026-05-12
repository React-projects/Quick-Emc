import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginLanding from './pages/LoginLanding';
import Leave from './pages/Leave';
import Employs from './pages/Employs';
import Settings from './pages/Setting';
import Payslips from './pages/Payslips';
import Attendance from './pages/Attendance';
import PrintPayslips from './pages/PrintPayslips';
import Layout from './pages/Layout';
import LoginForm from './components/login/LoginForm';

const App = () => {
    return (
        <>
            <Toaster />
            <Routes>
                <Route path='/login' element={<LoginLanding />} />
                <Route path='/login/admin' element={<LoginForm role='admin' title='Admin Portal' subtitle='sign in to manage organization' />} />
                <Route path='/login/employee' element={<LoginForm role='employee' title='Employee Portal' subtitle='sign in to access your account' />} />
                <Route element={<Layout />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/leave' element={<Leave />} />
                    <Route path='/employee' element={<Employs />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/attendance' element={<Attendance />} />
                    <Route path='/payslips' element={<Payslips />} />
                </Route>
                <Route path='print/payslips/:id' element={<PrintPayslips />} />
                <Route path='*' element={<Navigate to='/dashboard' replace />} />
            </Routes>
        </>
    );
};

export default App;
