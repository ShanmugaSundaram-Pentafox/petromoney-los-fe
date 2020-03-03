import React from 'react';
import LoansTable from './components/LoansTable';

const Dashboard = ({ currentUser }) => {
  return (
    <div>
      <LoansTable />
    </div>
  );
}

export default Dashboard;