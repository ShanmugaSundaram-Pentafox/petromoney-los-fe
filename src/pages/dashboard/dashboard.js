import React from 'react';
import LoansTable from './components/LoansTable';
import usePageTitle from '../../hooks/usePageTitle';

const Dashboard = ({ currentUser }) => {
  usePageTitle('Dashboard');
  return (
    <div>
      <LoansTable />
    </div>
  );
}

export default Dashboard;