import React from 'react';
import DealershipsTable from './components/DealershipsTable';
import usePageTitle from '../../hooks/usePageTitle';

const Dealership = ({ currentUser }) => {
  usePageTitle('Dealership List');
  return (
    <div>
      <DealershipsTable />
    </div>
  );
}

export default Dealership;