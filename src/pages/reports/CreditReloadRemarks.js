import React, { useState, useEffect } from 'react';
import { useMount } from 'react-use';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Box, Button, CircularProgress, Divider, FormHelperText, Grid, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import { addNewRemarks, getAllWithheldRemarks, updateRemarks } from '../../services/withheld.services';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import apiCall from '../../utils/api.util';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { addCreditReport, creditReloadById } from '../../services/creditreport.service';
import FilePreview, { ViewData } from '../../components/CommonComponents/FilePreview';
import FormDialog from '../../components/CommonComponents/FormDialog/FormDialog';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import { green, grey } from '@material-ui/core/colors';



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
  image: {
    borderRadius: 6,
    padding: 1,
    objectFit: 'cover'
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
  const [imageModal, setImageModal] = useState({})
  const [disburseLoading, setDisburseLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const postApiCall = (submitData) => {
    setDisburseLoading(true)
    const formData = new FormData();
    Object.keys(submitData).forEach((key) => {
      formData.append(key, submitData[key]);
    });
    addCreditReport(formData, currentUser, rowData?.dealership_id)
      .then((res) => {
        setDisburseLoading(false)
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
      .catch((e) => {
        setDisburseLoading(false)
        enqueueSnackbar(e.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      if (newRemarks || status === 'disburse') {
        if (typeof (newRemarks) === 'number') {
          if (status === 'decline') {
            const submitData = { 'remarks_id': newRemarks, 'is_status': 0 }
            postApiCall(submitData)
          } else {
            const submitData = { 'is_status': 1 }
            postApiCall(submitData)
          }
        } else {
          if (status === 'decline') {
            const submitData = { 'remarks': newRemarks, 'is_status': 0 }
            postApiCall(submitData)
          } else {
            const submitData = { 'is_status': 1 }
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
  const disburseSubmit = () => {
    setStatus('disburse')
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

  const handleRemarkChange = (newValue) => {
    if (remarks?.includes(newValue?.label)) {
      setNewRemarks(newValue?.label)
    }
    else {
      setNewRemarks(newValue?.value)
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
            <>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <Box>
                    <ViewData title="Dealership ID" value={rowData?.dealership_id} />
                    <ViewData title='Amount' value={rowData?.amount} />
                    <ViewData title='Remarks' value={rowData?.remarks} />
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Box>
                    <ViewData title="Request ID" value={rowData?.request_id} />
                    <ViewData title="Status" value={rowData?.status} />
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={12}>
                  <Typography variant="h6">Payment Reference</Typography>
                </Grid>
                {
                  !rowData?.payment_proof_attachment?.proof_1_url ? (
                    <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginTop: 5}}>
                      <Typography variant='h7'>No Attachments Found</Typography>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', width: '80%', marginLeft: 30}}>
                    <Grid item md={4}>
                      <div style={{ width: 125}}>
                      { 
                        !rowData?.payment_proof_attachment.proof_1_url?.endsWith('.pdf') ? (
                          rowData?.payment_proof_attachment?.proof_1_url && (
                            <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_1_url, type: rowData?.payment_proof_attachment.proof_1_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <img src={`${rowData?.payment_proof_attachment.proof_1_url}`} height="100%" width="100%" className={classes.image} />
                            </div> )
                        ) : (
                          rowData?.payment_proof_attachment?.proof_1_url && (
                            <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_1_url, type: rowData?.payment_proof_attachment.proof_1_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                            </div>
                          )
                        )
                      }
                      {
                        rowData?.payment_proof_attachment.proof_1_url ? (
                          <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{rowData?.payment_proof_attachment.proof_1_url.split('/')[5]}</h5>
                        ) : null
                      }
                      </div>
                    </Grid>
                    <Grid item md={4}>
                    <div style={{ width: 125}}>
                      {
                        !rowData?.payment_proof_attachment.proof_2_url?.endsWith('.pdf') ? (
                          rowData?.payment_proof_attachment?.proof_2_url && (
                            <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_2_url, type: rowData?.payment_proof_attachment.proof_2_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <img src={`${rowData?.payment_proof_attachment.proof_2_url}`} height="100%" width="100%" className={classes.image} />
                            </div>
                          )
                        ) : (
                          rowData?.payment_proof_attachment?.proof_2_url && (
                            <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_2_url, type: rowData?.payment_proof_attachment.proof_2_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                            </div>
                          )
                        )
                      }
                      {
                        rowData?.payment_proof_attachment.proof_2_url ? (
                          <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{rowData?.payment_proof_attachment.proof_2_url.split('/')[5]}</h5>
                        ) : null
                      }
                    </div>
                    </Grid>
                    <Grid item md={4}>
                    <div style={{ width: 125}}>
                      {
                        !rowData?.payment_proof_attachment.proof_3_url?.endsWith('.pdf') ? (
                          rowData?.payment_proof_attachment?.proof_3_url && (
                            <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_3_url, type: rowData?.payment_proof_attachment.proof_3_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <img src={`${rowData?.payment_proof_attachment.proof_3_url}`} height="100%" width="100%" className={classes.image} />
                            </div>
                            )
                        ) : (
                          rowData?.payment_proof_attachment?.proof_2_url && (
                            <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_3_url, type: rowData?.payment_proof_attachment.proof_3_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                            </div>
                          )
                        )
                      }
                      {
                        rowData?.payment_proof_attachment.proof_3_url ? (
                          <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{rowData?.payment_proof_attachment.proof_3_url.split('/')[5]}</h5>
                        ) : null
                      }
                      </div>
                    </Grid>
                    </div>
                  )
                }
              </Grid>
            </>
            {
              rowData.status == 'Disbursed' || rowData.status == 'Declined' ? null : (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={8} style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ marginBottom: 8, marginTop: 25 }}>Remarks</label>
                      <CreatableSelect
                        name='remarks'
                        isClearable
                        onChange={handleRemarkChange}
                        options={remarks}
                      />
                      <FormHelperText style={{ color: '#FF5C58', marginLeft: 5 }}>{!newRemarks && status === 'decline' ? 'Need a Remark to Proceed!' : null}</FormHelperText>
                    </Grid>
                  </Grid>
                </>
              )
            }
          </Box>
        </div >
      </div >
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant='outlined'
              onClick={callback}
              startIcon={<NavigateBeforeRoundedIcon />}
            >
              Back
            </Button>
          </div>
          {
            (rowData.status != 'Disbursed' && rowData.status != 'Declined') && (
              <div style={{ display: 'flex', justifyContent: 'center'}}>
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
                      onClick={disburseSubmit}
                      className={clsx(classes.btn, classes.editButton)}
                    >
                      Disburse
                    </Button>
                {/* {
                  disburseLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                  )
                } */}
              </div>
            )
          }
          {
            <FormDialog className={classes.dialogBox} title='Payment Reference' onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
              <FilePreview data={imageModal} />
            </FormDialog>
          }
        </div>
      </div>
    </div >
  );
};

export default CreditReloadRemarks;
