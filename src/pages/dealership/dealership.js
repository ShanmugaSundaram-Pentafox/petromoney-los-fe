import React from 'react';
import DealershipsTable from './components/DealershipsTable';
import usePageTitle from '../../hooks/usePageTitle';

const Dealership = ({ currentUser }) => {
  usePageTitle('Dealership List');
  return (
    <DealershipsTable />
  );
}

export default Dealership;