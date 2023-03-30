import { Typography, Box, Grid, Button, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import Select from 'react-select';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import TextInput from '../../components/TextInput/TextInput';
import { postReferralData } from '../../services/dealerships.service';


const useStyles = makeStyles((theme) => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },

  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },

  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
}));
const AddSettlementForm = ({ dealershipId, rowData, callback }) => {
  const [settlementType, setSettlementType] = useState();
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = () => {
    if (reference && settlementType) {
      setLoading(true);
      postReferralData(dealershipId, { settlement_type: settlementType?.value, ref_no: reference, amount: amount }, rowData?.referral_id)
        .then((res) => {
          setLoading(false);
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          callback();
        })
        .catch((err) => {
          setLoading(false);
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
          callback();
        })
    }
    else {
      if (settlementType)
        setError('Please enter reference number')
      else
        setError('Please choose settlement type')
    }
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Add settlement Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <>
        <div className={classes.sidePanelFormContentWrapper}>
          <div className={classes.stepperRoot}>
            <Box>
              <form>
                <Grid container spacing={2}>
                  <Grid item md={8} style={{ marginBottom: 10 }}>
                    <label style={{ marginBottom: 8 }}>Settlement Type</label>
                    <Select
                      isClearable
                      onChange={setSettlementType}
                      options={[
                        { label: 'Net off Interest', value: 'net off' },
                        { label: 'Payout', value: 'payout' },
                      ]} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={8}>
                    <label>UTR/Loan number</label>
                    <TextInput
                      onChange={(e) => { setReference(e.target.value) }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={8}>
                    <label>Settled Amount</label>
                    <TextInput
                      onChange={(e) => { setAmount(e.target.value) }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
          </div>
        </div>
        {error && (
          <Alert severity='error'>{error}</Alert>
        )}
        <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <div>
              <Button variant='outlined' onClick={callback}>
                Back
              </Button>
            </div>
            <div>
              {
                <LoaderButton
                  variant='contained'
                  className={clsx(classes.btn, classes.editButton)}
                  isLoading={loading}
                  loadingText='Submitting...'
                  type='submit'
                  onClick={() => handleSubmit()}
                >Submit</LoaderButton>
              }
            </div>
          </div>
        </div>
      </>
    </div >
  );
};

export default AddSettlementForm;
