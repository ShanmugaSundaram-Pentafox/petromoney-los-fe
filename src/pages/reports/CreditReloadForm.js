import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import CloseIcon from '@material-ui/icons/Close';
import { getTypeOfAccount } from '../../services/users.service';
import { Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Select from 'react-select';
import { Button } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import clsx from 'clsx';
import { TextField } from '@material-ui/core';
import apiCall from '../../utils/api.util';
import { useSnackbar } from 'notistack';
import { URL } from '../../config/serverUrls';

const useStyles = makeStyles((theme) => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },

  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
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
dropdown: {
    boxShadow: '1px 1px 4px -3px #333'
},
option: {
    padding: 6,
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
}
}));

const CreditReloadForm = ({ data, callback, currentUser, dealershipData }) => {
  const [accountId, setAccountId] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [mobile, setMobile] = useState();
  const [amount, setAmount] = useState();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

const {
  values,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting,
  setSubmitting,
} = useFormik({
  initialValues: {
    mobile: mobile,
    amount: amount,
  },
  validateOnChange: false,
  validateOnBlur: true,
  validationSchema: Yup.object().shape({
    mobile: Yup.number().required("Enter mobile number").test("maxDigits","Mobile Number mush have 10 digits", (number) => String(number).length === 10),
    amount: Yup.number().required("Enter Request Amount"),
  }),
  onSubmit: (data) => {
    const submitData = {'request_source': 'MDM', 'amount': data.amount, 'mobile': data.mobile, 'account_id': accountId?.id}

    if(accountId && amount && mobile && dealershipId){
      apiCall(`credit/reload/${dealershipId?.value}`, {
          method: 'POST',
          body: submitData,
          headers: {
            Authorization: `Bearer ${currentUser.token} `
          }
      })
      .then(res => {
          console.log(res);
          callback()
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setTimeout(() => {
            window.location.reload(false)
        }, 1000);
      })
      .catch(e => {
          console.log(e);
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
      })
  }
  }
})

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Add Withheld Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <>
        <div className={classes.sidePanelFormContentWrapper}>
          <div className={classes.stepperRoot}>
            <Box>
              <form>
                <Grid container spacing={2}>
                  <Grid item md={6} style={{marginBottom: 10}}>
                    <label style={{ marginBottom: 8 }}>Account Type</label>
                    <Select isClearable onChange={setAccountId} options={data} />
                  </Grid>
                  <Grid item md={6} style={{marginBottom: 10}}>
                    <label style={{ marginBottom: 8 }}>Dealership ID</label>
                    <Select isClearable onChange={setDealershipId} options={dealershipData} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <label style={{ marginBottom: 8 }}>Mobile Number</label>
                    <TextField
                    name="mobile"
                    type="number"
                    value={values.mobile}
                    error={errors.mobile}
                    helperText={errors.mobile}
                    variant='outlined'
                    onChange={handleChange}
                    fullWidth
                    />
                  </Grid>

                  <Grid item md={6}>
                    <label style={{ marginBottom: 8 }}>Amount</label>
                    <TextField 
                    name="amount"
                    type="number"
                    value={values.amount}
                    error={errors.amount}
                    helperText={errors.amount}
                    variant='outlined'
                    onChange={handleChange}
                    fullWidth
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
          </div>
        </div>
        <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <div>
              <Button variant='outlined' onClick={callback}>
                Back
              </Button>
            </div>
            <div>
              <Button
                variant='contained'
                type='submit'
                onClick={handleSubmit}
                className={clsx(classes.btn, classes.editButton)}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default CreditReloadForm;
