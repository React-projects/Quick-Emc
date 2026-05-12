import { ArrowRightIcon, CalculatorIcon, DollarSignIcon, FileTextIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Employee = ({ data }) => {
  const emp = data.employee;
  const cards = [
    {
      icon: CalculatorIcon,
      title: 'Days Present',
      subtile: 'this month',
      value: data.currentMonthAttendance,
    },
    {
      icon: FileTextIcon,
      title: 'Pending Leaves',
      subtile: 'Awaiting Approval',
      value: data.pendingLeaves,
    },
    {
      icon: DollarSignIcon,
      title: 'last Payslip',
      subtile: 'most recent payout',
      value: data.latestPayslip
        ? `Net Salary: $${data.latestPayslip.netSalary?.toLocaleString()}`
        : 'No payslip available',
    },
  ];
  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'> Welcome , {emp?.firstName}</h1>
        <p className='page-subtitle '>
          {emp?.position} -{emp?.department || 'Not Assigned'}
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
        {cards.map((card, index) => (
          <div className=' card card-hover p-S sm:p-6 relative overflow-hidden group flex items-center justify-between '>
            <div>
              <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full  bg-slate-500/70 group-hover:bg-indigo-500/70 ' />
              <p className='text-sm font-medium text-slate-700'>{card.title}</p>
              <p className='text-2x1 font-bold text-sl ate-900 mt-1'>{card.value}</p>
            </div>

            <card.icon className='size-16 p-2.5 rounded-lg bg-slate-løø text-slate-600 group-hover : bg-indigo-5Ø group-hover:text-indigo-6eø transition-colors duration- 200' />
          </div>
        ))}
      </div>
      <div className=' flex flex-col sm:flex-row gap-3'>
        <Link
          to={'/attendance'}
          className='btn-primary text-center inline-flex items-center justify-center gap-2'
        >
          {' '}
          Mark Attendance <ArrowRightIcon className='w-4 h-4' />{' '}
        </Link>
        <Link to={'/leave'} className='btn-secondary text-center '>
          {' '}
          Apply to leave
        </Link>
      </div>
    </div>
  );
};

export default Employee;
