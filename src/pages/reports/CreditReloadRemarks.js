import React, { useState, useEffect } from 'react';
import { useMount } from 'react-use';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Box, Button, Divider, FormHelperText, Grid, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import { addNewRemarks, getAllWithheldRemarks, updateRemarks } from '../../services/withheld.services';
import { useFormik } from 'formik';
import { number } from 'prop-types';
import { useSnackbar } from 'notistack';
import apiCall from '../../utils/api.util';


const useStyles = makeStyles((theme) => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },

  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },

  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  dropdown: {
    boxShadow: '1px 1px 4px -3px #333',
  },
  option: {
    padding: 6,
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },

  declineButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: '#FF5C58',
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: '#DF2E2E',
    },
  },
}));

const CreditReloadRemarks = ({ callback, rowData, currentUser }) => {
  const classes = useStyles();
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState();
  const [newRemarks, setNewRemarks] = useState()
  const [value, setValue] = useState()
  const { enqueueSnackbar } = useSnackbar();

  const postApiCall = (submitData) => {

      apiCall(`credit/reload/${rowData?.dealership_id}`, {
        method: 'POST',
        body: submitData,
        headers: {
          Authorization: `Bearer ${currentUser.token} `
        }
    })
    .then(res => {
        if(res.status === "SUCCESS"){
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
        } else {
            enqueueSnackbar(res.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'error',
            });
        }
    })
    .catch(e => {
        console.log(e);
    })
  }

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
        // remarks: Yup.string().required('Need a Remark to proceed!')
      }),
    onSubmit: () => {
        if(value){
            if(typeof(value) === 'number'){
                if(status === 'decline'){
                    const submitData = {'remarks_id': value, 'is_cancel':1}
                    postApiCall(submitData)
                } else {
                    const submitData = {'remarks_id': value, 'is_status':1}
                    postApiCall(submitData)
                }
            } else {
                if(status === 'decline'){
                    const submitData = {'remarks': value, 'is_cancel':1}
                    postApiCall(submitData)
                } else {
                    const submitData = {'remarks': value, 'is_status':1}
                    postApiCall(submitData)
                }
            }
        }
    }
  });

  const declineSubmit = () => {
      setStatus('decline')
      handleSubmit()
  }
  const disperseSubmit = () => {
      setStatus('disperse')
      handleSubmit()
  }

  useMount(() => {
    getAllWithheldRemarks()
        .then((data) => {
            setRemarks(data)
        })
        .catch((e) => {
            console.log(e);
        })
    })

    const handleRemarkChange = (newValue, actionMeta) => {
        if (remarks?.includes(newValue?.label)) {
            setNewRemarks(newValue?.label)
        }
        else {
            setValue(newValue?.value)
        }
    };

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Credit Reload Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <Grid container spacing={2}>
              <Grid item md={8} style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{ marginBottom: 8 }}>Remarks</label>
                <CreatableSelect
                name='remarks'
                isClearable
                onChange={handleRemarkChange}
                options={remarks}
                />
                <FormHelperText style={{color: '#FF5C58', marginLeft: 5}}>{!value? 'Need a Remark to Proceed!' : null}</FormHelperText>
              </Grid>
            </Grid>
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
                onClick={declineSubmit}
              className={clsx(classes.btn, classes.declineButton)}
            >
              Decline
            </Button>
            <Button
              variant='contained'
              type='submit'
              color='primary'
                onClick={disperseSubmit}
              className={clsx(classes.btn, classes.editButton)}
            >
              Disperse
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditReloadRemarks;
