import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DealershipInfo from './components/DealershipInfo';
import { useMount } from 'react-use';
import { getDealershipById } from '../../services/dealerships.service';
import { getDealersByDealershipId } from '../../services/dealers.service';
import DealersList from './components/DealersList';
import LoansList from './components/LoansList';
import { NavLink as RouterLink } from 'react-router-dom';
import SalesInfo from '../dashboard/components/SalesInfo';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  title: {
    fontWeight: 500,
    marginBottom: theme.spacing(1)
  },
  titleActionContainer: {
    textAlign: 'right'
  },
  bottomSpacing: {
   marginBottom: theme.spacing(2) 
  }
}));

const DealershipDetails = ({ currentUser, match }) => {
  const classes = useStyles();
  const [dealershipData, setDealershipData] = useState();
  const [dealersData, setDealersData] = useState();
  const { url, params: { id } } = match;
  
  useMount(() => {
    getDealershipById(id)
      .then(data => setDealershipData(data))
      .catch(e => null);

    getDealersByDealershipId(id)
      .then(data => setDealersData(data))
      .catch(e => null)
  });

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item md={5} xs={12}>
          <Typography className={classes.title} variant="h4">{id} - {dealershipData && dealershipData.name}</Typography>
        </Grid>
        <Grid item md={7} xs={12} className={classes.titleActionContainer}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            component={RouterLink}
            to={`${url}/credit-form`}
            exact
            >Credit Eval. Form</Button>
        </Grid>
      </Grid>
      <Divider className={classes.bottomSpacing} />
      <Grid container spacing={2}>
        {
          dealershipData && <Grid item md={6} xs={12}><DealershipInfo data={dealershipData} /></Grid>
        }
        
        <Grid item md={6} xs={12}>
          <Paper className={classes.bottomSpacing}>
            <LoansList id={id} titleAlign="center" />
          </Paper>
          <Paper className={classes.bottomSpacing}>
            <SalesInfo id={id} titleAlign="center" column />
          </Paper>
          { (dealersData && dealersData.length > 0) ? <DealersList data={dealersData} /> : null}
        </Grid>
      </Grid>
    </div>
  );
}

export default DealershipDetails;