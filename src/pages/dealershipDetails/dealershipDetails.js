import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import DealershipInfo from './components/DealershipInfo';
import { useMount } from 'react-use';
import { getDealershipById, getDealershipLoansById } from '../../services/dealerships.service';
import { getDealersByDealershipId } from '../../services/dealers.service';
import DealersList from './components/DealersList';
import LoansList from './components/LoansList';
import { NavLink as RouterLink } from 'react-router-dom';

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
  const [loansData, setLoansData] = useState();
  const [dealersData, setDealersData] = useState();
  const { url, params: { id } } = match;
  
  useMount(() => {
    getDealershipById(id)
      .then(data => setDealershipData(data))
      .catch(e => null);

    getDealershipLoansById(id)
      .then(data => setLoansData(data))
      .catch(e => null)

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
          dealershipData && <Grid item md={5} xs={12}><DealershipInfo data={dealershipData} /></Grid>
        }
        
        { (dealersData && dealersData.length > 0) || (loansData && loansData.length > 0) ? (
            <Grid container item md={7} xs={12}>
              <Grid item xs={12}><DealersList data={dealersData} /></Grid>
              <Grid item xs={12}><LoansList data={loansData} /></Grid>
            </Grid>
          ) : null}
      </Grid>
    </div>
  );
}

export default DealershipDetails;