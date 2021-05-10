import React from 'react';
import Grid from '@material-ui/core/Grid';
import TransportTable from '../transports/components/TransportsTable';
import usePageTitle from '../../hooks/usePageTitle';
import VehiclesLoanTable from './components/VehiclesLoanTable';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import DealerTransportsTable from './components/DealerTransportsTable';

const Transport = ({ currentUser }) => {
  usePageTitle('Transports');
  const editable = permissionCheck(currentUser.role_name, rulesList.dealer_view)
  return (
    <Grid container spacing={2}>
      {
        editable ? (
          <>
            <Grid item sm={12} md={8}>
              <DealerTransportsTable currentUser={currentUser} />
            </Grid>  
          </>
        ) : (
          <>
            <Grid item sm={12} md={6}>
              <TransportTable />
            </Grid>
            <Grid item sm={12} md={6}>
              <VehiclesLoanTable />
            </Grid>
          </>

        )
      }

    </Grid>
  );
}

export default Transport;