import { Typography, Box, Grid, Button, Divider } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import TextInput from '../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../config/accessControl';
import { getDealershipForSearch } from '../../services/common.service';
import { addCreditReport } from '../../services/creditreport.service';
import { getBankDetailsbyID } from '../../services/PDReport.services';
import { isAllowed } from '../../utils/cerbos';
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
  inputFile: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
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
  },
  image: {
    borderRadius: 6,
    padding: 1
  },
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  grid: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2
  }
}));
const CreditReloadForm = ({ callback, currentUser, view }) => {
  const [repaymentType, setRepaymentType] = useState();
  const [amount, setAmount] = useState();
  const [selectedValue, setSelectedValue] = useState(!view ? null : currentUser.dealership_id);
  const classes = useStyles();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [bankId, setBankId] = useState();
  const { data: bankData = [] } = useQuery(['bank-data', selectedValue], () => getBankDetailsbyID(selectedValue), {
    refetchOnWindowFocus: false,
    enabled: selectedValue ? true : false,
    select: d => {
      return d?.map(item => {
        if (item?.bank_verified === 1) {
          return {
            label: `${item?.bank_name} - ${item?.account_no}`,
            value: item.id
          };
        }
      })?.filter(item => item !== undefined)
    }
  })
  useEffect(() => {
    if (selectedValue) {
      if ((bankData.length) <= 0)
        setErrorMessage('Please add and verify your bank details in PDR section to raise reload request')
      else
        setErrorMessage(null)
    }
  }, [bankData, selectedValue])

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setFieldValue, setFieldError } = useFormik({
    initialValues: {
      amount: amount,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      amount: Yup.number().nullable('Enter Amount').required('Enter Amount').moreThan(0, 'Invalid Amount').test('maxDigits', 'Request Amount Invalid', (value) => String(value) >= 50000 && String(value) <= 3000000),
    }),
    onSubmit: (values) => {
      const d = { ...values, request_source: 'mdm', bank_id: bankId?.value, repayment_made: repaymentType?.value }
      const formData = new FormData();
      Object.keys(d).forEach((key) => {
        formData.append(key, d[key]);
      });
      if (selectedValue && bankId) {
        setLoading(true)
        addCreditReport(formData, currentUser, selectedValue)
          .then(res => {
            if (res.status === 'SUCCESS') {
              setLoading(false)
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
            }
            else {
              setLoading(false)
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
            setLoading(false)
            enqueueSnackbar(e.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          })
      }
      else {
        if (selectedValue)
          if (bankData.length)
            setErrorMessage('Please select bank account')
          else
            setErrorMessage('Please add and verify your bank details in PDR section to raise reload request')
        else
          setErrorMessage('Please choose dealership ID & bank account')
      }
    }
  })
  const getOptions = (inputValue, callback) => {
    if (inputValue.toString().length > 2) {
      setOptionsLoading(true)
      getDealershipForSearch(inputValue)
        .then(data => {
          setOptionsLoading(false)
          callback(data);
        })
        .catch(e => {
          console.log(e);
          setOptionsLoading(false)
        })
    }
  }
  const onChangeOption = (newValue) => {
    setSelectedValue(newValue.dealership_id)
  }
  const onChangeHandler = (e, type) => {
    type == 'proof1' ?
      setFieldValue('proof_1_file', e.target.files[0]) :
      type == 'proof2' ?
        setFieldValue('proof_2_file', e.target.files[0]) :
        setFieldValue('proof_3_file', e.target.files[0])
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Credit Reload Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <>
        <div className={classes.sidePanelFormContentWrapper}>
          <div className={classes.stepperRoot}>
            <Box>
              <form>
                <Grid container spacing={2}>
                  <Grid item md={8} style={{ marginBottom: 10 }}>
                    <label style={{ marginBottom: 8 }}>Dealership</label>
                    {
                      isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.disburse) ?
                        (
                          <AsyncSelect
                            components={optionsLoading ? null : { LoadingIndicator: null }}
                            styles={{
                              menu: provided => ({ ...provided, zIndex: 9999 })
                            }}
                            onChange={onChangeOption}
                            loadingMessage={() => ' '}
                            loadOptions={getOptions}
                            placeholder='Search Dealership ID or Name'
                          />
                        ) : (
                          <Typography variant='h6' style={{ marginTop: 7 }}>{selectedValue}</Typography>
                        )
                    }
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={8} style={{ marginBottom: 10 }}>
                    <label style={{ marginBottom: 8 }}>Choose Bank</label>
                    <Select name='bankId' isClearable value={bankId} onChange={setBankId} options={bankData} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={8} style={{ marginBottom: 10 }}>
                    <label style={{ marginBottom: 8 }}>Repayment Made</label>
                    <Select
                      isClearable
                      onChange={setRepaymentType}
                      options={[
                        { label: 'Today', value: 'today' },
                        { label: 'Earlier today', value: 'earlier today' },
                      ]} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={8}>
                    <label>Amount</label>
                    <TextInput
                      money
                      name="amount"
                      type="number"
                      className={classes.number}
                      value={values.amount}
                      error={errors.amount}
                      helperText={errors.amount}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: 11 }}>
                  <Grid item md={12}>
                    <Grid container spacing={1}>
                      <Grid style={{ marginLeft: 4 }} md={12}>
                        <label>Payment Reference</label>
                      </Grid>
                      <Grid md={3}>
                        <div className={classes.grid}>
                          <input
                            type='file'
                            name='file'
                            id='proof1'
                            className={classes.inputFile}
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(e) => { onChangeHandler(e, 'proof1') }}
                          />
                          <label htmlFor='proof1'>
                            <div style={{
                              border: '1px dashed grey', height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: errors.proof_1_file ? 'red' : 'grey'
                            }}>
                              {
                                values?.proof_1_file ? (
                                  <>
                                    <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                                  </>
                                ) : (
                                  <label htmlFor='proof1' style={{ fontSize: 32, color: 'grey' }}>+</label>
                                )
                              }
                            </div>
                          </label>
                          {
                            values?.proof_1_file && (
                              <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{values.proof_1_file?.name}</h5>
                            )
                          }
                        </div>
                      </Grid>
                      {
                        values.proof_1_file && (
                          <>
                            <Grid md={3}>
                              <div className={classes.grid}>
                                <input
                                  type='file'
                                  name='file'
                                  id='proof2'
                                  accept="image/jpeg,image/png,application/pdf"
                                  className={classes.inputFile}
                                  onChange={(e) => { onChangeHandler(e, 'proof2') }}
                                />
                                <label htmlFor='proof2'>
                                  <div style={{ border: '1px dashed grey', height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                      values?.proof_2_file ? (
                                        <>
                                          <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                                        </>
                                      ) : (
                                        <label htmlFor='proof2' style={{ fontSize: 32, color: 'grey' }}>+</label>
                                      )
                                    }
                                  </div>
                                </label>
                                {
                                  values?.proof_2_file && (
                                    <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{values.proof_2_file?.name}</h5>
                                  )
                                }
                              </div>
                            </Grid>
                            {
                              values.proof_2_file && (
                                <Grid md={3}>
                                  <div className={classes.grid}>
                                    <input
                                      type='file'
                                      name='file'
                                      id='proof3'
                                      accept="image/jpeg,image/png,application/pdf"
                                      className={classes.inputFile}
                                      onChange={(e) => { onChangeHandler(e, 'proof3') }}
                                    />
                                    <label htmlFor='proof3'>
                                      <div style={{ border: '1px dashed grey', height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {
                                          values?.proof_3_file ? (
                                            <>
                                              <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                                            </>
                                          ) : (
                                            <label htmlFor='proof3' style={{ fontSize: 32, color: 'grey' }}>+</label>
                                          )
                                        }
                                      </div>
                                    </label>
                                    {
                                      values?.proof_3_file && (
                                        <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{values.proof_3_file?.name}</h5>
                                      )
                                    }
                                  </div>
                                </Grid>
                              )
                            }
                          </>
                        )
                      }
                    </Grid>
                  </Grid>

                </Grid>
              </form>
            </Box>
          </div>
        </div>
        <div className={classes.actionFooter}>
          {errorMessage && <Alert severity={'error'}>{errorMessage}</Alert>}
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
                  onClick={() => {
                    if (repaymentType?.value == 'today') {
                      !values?.proof_1_file ? setFieldError('proof_1_file', 'Please add proof') : handleSubmit();
                    }
                    else {
                      handleSubmit();
                    }
                  }}
                >Submit</LoaderButton>
              }
            </div>
          </div>
        </div>
      </>
    </div >
  );
};

export default CreditReloadForm;
