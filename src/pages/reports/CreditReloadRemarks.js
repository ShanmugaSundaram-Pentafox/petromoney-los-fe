import { InputAdornment } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Check, Close } from '@material-ui/icons';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import CreatableSelect from 'react-select/creatable';
import { useMount } from 'react-use';
import FilePreview, { ViewData } from '../../components/CommonComponents/FilePreview';
import FormDialog from '../../components/CommonComponents/FormDialog/FormDialog';
import TextInput from '../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../config/accessControl';
import { addCreditReport, updateCreditReload } from '../../services/creditreport.service';
import { getAllWithheldRemarks } from '../../services/withheld.services';
import { isAllowed } from '../../utils/cerbos';
import { Box, Button, Grid, Group, Text, Title } from '@mantine/core';
import Currency from '../../components/Number/Currency';

const CreditReloadRemarks = ({ callback, rowData, currentUser, view }) => {
  const classes = {};
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState();
  const [newRemarks, setNewRemarks] = useState()
  const [imageModal, setImageModal] = useState({})
  const [utrNumber, setUtrNumber] = useState();
  const [disburseLoading, setDisburseLoading] = useState(false);
  const [amount, setAmount] = useState({ isEdit: false, value: rowData?.amount, loading: false })
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient()

  const postApiCall = (submitData) => {
    setDisburseLoading(true)
    const formData = new FormData();
    Object.keys(submitData).forEach((key) => {
      formData.append(key, submitData[key]);
    });
    addCreditReport(formData, currentUser, rowData?.request_id)
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
            const submitData = { 'remarks_id': newRemarks, 'reload_status': 'Declined' }
            postApiCall(submitData)
          } else {
            if (utrNumber) {
              const submitData = { 'reload_status': 'Disbursed', 'utr': utrNumber }
              postApiCall(submitData)
            }
          }
        } else {
          if (status === 'decline') {
            const submitData = { 'remarks': newRemarks, 'reload_status': 'Declined' }
            postApiCall(submitData)
          } else {
            if (utrNumber) {
              const submitData = { 'reload_status': 'Disbursed', 'utr': utrNumber }
              postApiCall(submitData)
            }
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
  const handleAmountChange = () => {
    if (amount?.value >= 50000 && amount?.value <= 3000000) {
      setAmount({ ...amount, loading: true });
      const data = { amount: amount?.value, dealership_id: rowData?.dealership_id }
      updateCreditReload(data, rowData?.request_id)
        .then(res => {
          setAmount({ ...amount, isEdit: false, loading: false });
          callback()
          queryClient.invalidateQueries('new-request')
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
    else
      setAmount({ ...amount, error: 'Enter valid amount to raise request' })
  }

  const handleRemarkChange = (newValue) => {
    if (remarks?.includes(newValue?.label)) {
      setNewRemarks(newValue?.label)
    }
    else {
      setNewRemarks(newValue?.value)
    }
  };
  return (
    <Box>
      <Box>
        <Box>
          <Box>
            <>
              <Grid gutter={'md'}>
                <Grid.Col span={6}>
                  <Box mb={'sm'}>
                    <ViewData title="Dealership ID" value={rowData?.dealership_id} />
                  </Box>
                  <Box mb={'sm'}>
                    <ViewData title='Amount' value={<Currency value={rowData?.amount} />} />
                  </Box>
                  <Box mb={'sm'}>
                    <ViewData title='Remarks' value={rowData?.remarks} />
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box mb={'sm'}>
                    <ViewData title="Request ID" value={rowData?.request_id} />
                  </Box>
                  <Box mb={'sm'}>
                    <ViewData title="Status" value={rowData?.status} />
                  </Box>
                  <Box mb={'sm'}>
                    <ViewData title='Bank details' value={`${rowData?.account_no} - ${rowData?.bank_name}`} />
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Title order={5}>Payment Reference</Title>
                </Grid.Col>
                {
                  !rowData?.payment_proof_attachment?.proof_1_url ? (
                    <Grid.Col span={12}>
                      <Text c={'gray'} ta={'center'} size={'xs'} mt={10}>No Attachments Found</Text>
                    </Grid.Col>
                  ) : (
                    <div style={{ display: 'flex', width: '80%', marginLeft: 30 }}>
                      <Grid.Col span={4}>
                        <div style={{ width: 125 }}>
                          {
                            !rowData?.payment_proof_attachment.proof_1_url?.endsWith('.pdf') ? (
                              rowData?.payment_proof_attachment?.proof_1_url && (
                                <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_1_url, type: rowData?.payment_proof_attachment.proof_1_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <img alt="document" src={`${rowData?.payment_proof_attachment.proof_1_url}`} height="100%" width="100%" className={classes.image} />
                                </div>)
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
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <div style={{ width: 125 }}>
                          {
                            !rowData?.payment_proof_attachment.proof_2_url?.endsWith('.pdf') ? (
                              rowData?.payment_proof_attachment?.proof_2_url && (
                                <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_2_url, type: rowData?.payment_proof_attachment.proof_2_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <img alt="document" src={`${rowData?.payment_proof_attachment.proof_2_url}`} height="100%" width="100%" className={classes.image} />
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
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <div style={{ width: 125 }}>
                          {
                            !rowData?.payment_proof_attachment.proof_3_url?.endsWith('.pdf') ? (
                              rowData?.payment_proof_attachment?.proof_3_url && (
                                <div onClick={() => setImageModal({ open: true, image: rowData?.payment_proof_attachment.proof_3_url, type: rowData?.payment_proof_attachment.proof_3_url?.endsWith('.pdf') })} style={{ border: '1px dashed grey', width: 120, height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <img alt="document" src={`${rowData?.payment_proof_attachment.proof_3_url}`} height="100%" width="100%" className={classes.image} />
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
                      </Grid.Col>
                    </div>
                  )
                }
              </Grid>
            </>
            {
              isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.disburse) && (
                rowData.status == 'Disbursed' || rowData.status == 'Declined' ? null : (
                  <>
                    <Grid>
                      <Grid.Col span={12}>
                        <label style={{ marginBottom: 8, marginTop: 25 }}>Remarks</label>
                        <CreatableSelect
                          name='remarks'
                          isClearable
                          onChange={handleRemarkChange}
                          options={remarks}
                        />
                        <Text style={{ color: '#FF5C58', marginLeft: 5, fontSize: '10px' }}>{!newRemarks && status === 'decline' ? 'Need a Remark to Proceed!' : null}</Text>
                      </Grid.Col>
                      {
                        // show only for loans except vivriti
                        !rowData?.product_name?.includes('Vivriti') && (
                          <Grid.Col span={12}>
                            <TextInput
                              direction='column'
                              alignTop={true}
                              labelText="UTR"
                              value={utrNumber}
                              onChange={e => setUtrNumber((e.target.value).toUpperCase())}
                            />
                            <Text style={{ color: '#FF5C58', marginLeft: 5, fontSize: '10px' }}>{!utrNumber && status === 'disburse' ? 'Need UTR to Proceed!' : null}</Text>
                          </Grid.Col>
                        )
                      }
                    </Grid>
                  </>
                )
              )
            }
          </Box>
        </Box>
      </Box>
      <Box mt={'xl'}>
        <Box>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant='outline'
              onClick={callback}
              startIcon={<NavigateBeforeRoundedIcon />}
            >
              Back
            </Button>
            {
              rowData.status != 'Disbursed' && rowData.status != 'Declined' &&
              <Group gap={'md'}>
                {
                  // Credit Reload decline permission check for vivriti loans which doesn't have tranche_code and for other petromoney loans 
                  (isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.decline) && (!rowData?.tranche_code)) ?
                    <Button
                      type='submit'
                      // variant='light'
                      color='red'
                      onClick={declineSubmit}
                    >
                      Decline
                    </Button> : null
                }
                {
                  // Credit Reload disburse permission check, don't allow user to disburse the vivirit loans
                  (isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.disburse) && !rowData?.product_name?.includes('Vivriti')) ?
                    <Button
                      // variant='light'
                      color='green'
                      type='submit'
                      onClick={disburseSubmit}
                    >
                      Disburse
                    </Button> : null
                }
              </Group>
            }
          </div>
          {
            <FormDialog className={classes.dialogBox} title='Payment Reference' onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
              <FilePreview data={imageModal} />
            </FormDialog>
          }
        </Box>
      </Box>
    </Box >
  );
};

export default CreditReloadRemarks;
