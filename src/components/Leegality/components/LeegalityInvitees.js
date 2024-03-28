import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import CardsCheckList from './CardsCheckList';

const useStyles = makeStyles(() => ({
  info: {
    color: 'rgb(0,0,0,0.4)',
    marginTop: 8,
  }
}));

const LeegalityInvitees = ({ dealers, applicants, guarantor, updateSelectedDealers, updateSelectedCoAppicants, updateSelectedGuarantors }) => {
  const classes = useStyles();

  return (
    <Grid item sm={3} md={4}>
      <Box>
        <Typography variant="h4">Select Invitees</Typography>
      </Box>
      <Box pt={2}>
        <Typography variant="body1">Dealers</Typography>
        {dealers?.length !== 0 ? (
          <Box pt={1}>
            <CardsCheckList data={dealers} onChange={updateSelectedDealers} />
          </Box>
        ) : (
          <Typography variant="body1" className={classes.info}>
            No Dealers Found!
          </Typography>
        )}
      </Box>

      <Box pt={2}>
        <Typography variant="body1">Co-applicants</Typography>
        {applicants?.length !== 0 ? (
          <Box pt={1}>
            <CardsCheckList
              data={applicants}
              onChange={updateSelectedCoAppicants}
              tooltip={true}
            />
          </Box>
        ) : (
          <Typography variant="body1" className={classes.info}>
            No Applicants Found!
          </Typography>
        )}
      </Box>
      <Box pt={2}>
        <Typography variant="body1">Guarantors</Typography>
        {guarantor?.length !== 0 ? (
          <Box pt={1}>
            <CardsCheckList
              data={guarantor}
              onChange={updateSelectedGuarantors}
            />
          </Box>
        ) : (
          <Typography variant="body1" className={classes.info}>
            No Guarantors Found!
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default LeegalityInvitees;
