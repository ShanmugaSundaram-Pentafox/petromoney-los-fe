import React from 'react';
import TransportTable from '../transports/components/TransportsTable';
import usePageTitle from '../../hooks/usePageTitle';

const Transport = ({ currentUser }) => {
  usePageTitle('Transport List');
  return (
    <TransportTable />
  );
}

export default Transport;