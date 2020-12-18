import React from 'react';
import Grid from '@material-ui/core/Grid';
import TransportTable from '../transports/components/TransportsTable';
import usePageTitle from '../../hooks/usePageTitle';
import VehiclesLoanTable from './components/VehiclesLoanTable';

const Transport = ({ currentUser }) => {
  usePageTitle('Transports');
  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={6}>
        <TransportTable />
      </Grid>
      <Grid item sm={12} md={6}>
        <VehiclesLoanTable />
      </Grid>
    </Grid>
  );
}

export default Transport;