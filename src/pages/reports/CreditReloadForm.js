import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';
import Currency from '../../components/Number/Currency';
import TextInput from '../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../config/accessControl';
import { getDealershipForSearch } from '../../services/common.service';
import { addCreditReport } from '../../services/creditreport.service';
import { getCreditReloadLimitById } from '../../services/dealerships.service';
import { getBankDetailsbyID } from '../../services/PDReport.services';
import { isAllowed } from '../../utils/cerbos';
import { Box, Button, Grid, Text, Title, Alert, Checkbox, Group } from '@mantine/core';
import { IconCheck, IconInfoCircle } from '@tabler/icons-react';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';

const useStyles = makeStyles((theme) => ({
  // sidePanelFormWrapper: {
  //   position: 'relative',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   height: '100vh',
  //   width: '40vw',
  // },

  // sidePanelTitle: {
  //   padding: '12px 16px',
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   zIndex: 0,
  //   boxShadow: '0 1px 4px -3px #333',
  // },

  // sidePanelFormContentWrapper: {
  //   flex: 1,
  //   overflow: 'auto'
  // },
  // stepperRoot: {
  //   padding: 16,
  //   paddingTop: 8
  // },
  // inputFile: {
  //   width: '0.1px',
  //   height: '0.1px',
  //   opacity: 0,
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   zIndex: -1,
  // },
  // actionButtonsWrapper: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   padding: '12px 16px'
  // },
  // dropdown: {
  //   boxShadow: '1px 1px 4px -3px #333'
  // },
  // option: {
  //   padding: 6,
  // },
  // editButton: {
  //   marginRight: '8px',
  //   '&.MuiButton-contained': {
  //     backgroundColor: theme.palette.success.main,
  //     color: theme.palette.white
  //   },
  //   '&.MuiButton-contained:hover': {
  //     backgroundColor: theme.palette.success.dark
  //   }
  // },
  // image: {
  //   borderRadius: 6,
  //   padding: 1
  // },
  // number: {
  //   backgroundColor: 'white',
  //   '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
  //     '-webkit-appearance': 'none',
  //     margin: 0
  //   }
  // },
  // grid: {
  //   marginLeft: 4,
  //   marginRight: 4,
  //   marginTop: 2
  // },
  // alert: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   border: '1px solid #ccc',
  //   padding: 4,
  //   borderRadius: 4,
  // }
}));
const CreditReloadForm = ({ callback, currentUser, view }) => {
  const [repaymentType, setRepaymentType] = useState();
  const [amount, setAmount] = useState();
  const [selectedValue, setSelectedValue] = useState(!view ? null : currentUser.dealership_id);
  const classes = useStyles();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expressCRR, setExpressCRR] = useState(false);
  const [bankId, setBankId] = useState();
  const { data: bankData = [] } = useQuery(['bank-data', selectedValue], () => getBankDetailsbyID(selectedValue), {
    refetchOnWindowFocus: false,
    enabled: selectedValue ? true : false,
    select: d => {
      return d?.map(item => {
        if (item?.bank_verified === 1) {
          return {
            label: `${item?.bank_name}(${item?.account_name}) - ${item?.account_no}`,
            value: item.id
          };
        }
      })?.filter(item => item !== undefined)
    }
  })
  const { data: creditLimit, isError, isFetched } = useQuery(['credit-reload-limit', selectedValue], () => getCreditReloadLimitById(selectedValue), {
    refetchOnWindowFocus: false,
    retry: false,
    enabled: selectedValue ? true : false,
    onError: (err) => {
      setErrorMessage(err)
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

  const isLimit = creditLimit?.min_tranche_amount > 0 && creditLimit?.is_loan_limit_check;
  const { values, errors, handleChange, handleSubmit, setFieldValue, setFieldError } = useFormik({
    initialValues: {
      amount: amount,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      amount: Yup.number()
        .nullable('Enter Amount')
        .required('Enter Amount')
        .min(isLimit ? creditLimit?.min_tranche_amount : 50000, `The minimum amount you can request is ${isLimit ? creditLimit?.min_tranche_amount : 50000}`)
        .max(creditLimit?.eligible_amount, `The maximum amount you can request is ${creditLimit?.eligible_amount}`)
        .test('maxDigits', creditLimit?.eligible_amount ? `You can request amount from 50k to ${creditLimit?.eligible_amount}` : 'Enter dealership ID to check the limit', (value) => String(value) >= 50000 && String(value) <= creditLimit?.eligible_amount),
    }),
    onSubmit: (values) => {
      const d = { ...values, request_source: 'mdm', bank_id: bankId?.value, repayment_made: repaymentType?.value }
      // handling the express crr
      if (expressCRR) d.reload_type = 'express';
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
              displayNotification({
                message: res?.message,
                variant: 'success',
              })
              setTimeout(() => {
                window.location.reload(false)
              }, 1000);
            }
            else {
              setLoading(false)
              displayNotification({
                message: res?.message,
                variant: 'error',
              })
            }
          })
          .catch(e => {
            setLoading(false)
            displayNotification({
              message: e?.message,
              variant: 'error',
            })
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
    <Box>
      <>
        <Box>
          <Box>
            <Box>
              <form>
                <Grid>
                  <Grid.Col span={12}>
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
                          <Title order={'6'} mt={6}>{selectedValue}</Title>
                        )
                    }
                  </Grid.Col>
                  {
                    (!isError && isFetched) && (
                      <>
                        <Grid.Col span={12}>
                          <label style={{ marginBottom: 8 }}>Choose Bank</label>
                          <Select name='bankId' isClearable value={bankId} onChange={setBankId} options={bankData} />
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <label style={{ marginBottom: 8 }}>Repayment Made</label>
                          <Select
                            isClearable
                            onChange={setRepaymentType}
                            options={[
                              { label: 'Today', value: 'today' },
                              { label: 'Earlier today', value: 'earlier today' },
                            ]} />
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <label>Amount</label>
                          <TextInput
                            money
                            name="amount"
                            type="number"
                            value={values.amount}
                            error={errors.amount}
                            helperText={errors.amount}
                            onChange={handleChange}
                          />
                          <Box>
                            <Text style={{ color: 'gray', fontSize: 12 }}>Available Limit: < Currency value={creditLimit?.eligible_amount} /></Text>
                            {
                              typeof (creditLimit?.available_tranche_limit) == 'number' &&
                                <Text mt={'sm'} style={{ color: 'gray', fontSize: 12 }}>Available tranche count: {creditLimit?.available_tranche_limit}</Text>
                            }
                          </Box>
                        </Grid.Col>
                        {values?.is_express_fee_eligible &&
                          <Grid.Col span={12}>
                            <Group>
                              <label>Do you want proceed with express reload</label>
                              <Checkbox
                                checked={expressCRR}
                                size='xs'
                                onChange={(e) => setExpressCRR(e.currentTarget.checked)}
                              />
                            </Group>
                            <Alert mt={'md'} radius={'md'} variant="light" color="orange" title="Note" icon={<IconInfoCircle />} styles={{ message: { fontSize: 12 } }}>
                              Express Reload will charge Rs. 590 (including GST) will be deducted, and your request will be processed.
                            </Alert>
                          </Grid.Col>
                        }
                        <Grid.Col span={12}>
                          <Grid>
                            <Grid.Col span={12}>
                              <label>Payment Reference</label>
                            </Grid.Col>
                            <Grid.Col span={4}>
                              <div className={classes.grid}>
                                <input
                                  type='file'
                                  name='file'
                                  id='proof1'
                                  style={{
                                    width: '120px',
                                    height: '75px',
                                    opacity: 0,
                                    overflow: 'hidden',
                                    position: 'absolute',
                                  }}
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
                                          <IconCheck size={30} color={green[300]} />
                                        </>
                                      ) : (
                                        <label htmlFor='proof1' style={{ fontSize: 32, color: errors.proof_1_file ? 'red' : 'grey' }}>+</label>
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
                            </Grid.Col>
                            {
                              values.proof_1_file && (
                                <>
                                  <Grid.Col span={4}>
                                    <div className={classes.grid}>
                                      <input
                                        type='file'
                                        name='file'
                                        id='proof2'
                                        accept="image/jpeg,image/png,application/pdf"
                                        style={{
                                          width: '120px',
                                          height: '75px',
                                          opacity: 0,
                                          overflow: 'hidden',
                                          position: 'absolute',
                                        }}
                                        onChange={(e) => { onChangeHandler(e, 'proof2') }}
                                      />
                                      <label htmlFor='proof2'>
                                        <div style={{ border: '1px dashed grey', height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                          {
                                            values?.proof_2_file ? (
                                              <>
                                                <IconCheck color={green[300]} size={30} />
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
                                  </Grid.Col>
                                  {
                                    values.proof_2_file && (
                                      <Grid.Col span={4}>
                                        <div className={classes.grid}>
                                          <input
                                            type='file'
                                            name='file'
                                            id='proof3'
                                            accept="image/jpeg,image/png,application/pdf"
                                            style={{
                                              width: '120px',
                                              height: '75px',
                                              opacity: 0,
                                              overflow: 'hidden',
                                              position: 'absolute',
                                            }}
                                            onChange={(e) => { onChangeHandler(e, 'proof3') }}
                                          />
                                          <label htmlFor='proof3'>
                                            <div style={{ border: '1px dashed grey', height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                              {
                                                values?.proof_3_file ? (
                                                  <>
                                                    <IconCheck color={green[300]} size={30} />
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
                                      </Grid.Col>
                                    )
                                  }
                                </>
                              )
                            }
                          </Grid>
                        </Grid.Col>
                      </>
                    )
                  }
                </Grid>
              </form>
            </Box>
          </Box>
        </Box>
        <Box mt={'xl'}>
          {errorMessage && <Alert radius={'md'} variant="light" color="red" title="Error" icon={<IconInfoCircle />} styles={{ message: { fontSize: 12 } }}>{errorMessage}</Alert>}
          <Group justify='right' mt={'md'}>
            {
              (!isError && isFetched) && (
                <Button
                  loading={loading}
                  type='submit'
                  color='green'
                  onClick={() => {
                    if (repaymentType?.value == 'today') {
                      !values?.proof_1_file ? setFieldError('proof_1_file', 'Please add proof') : handleSubmit();
                    }
                    else {
                      handleSubmit();
                    }
                  }}
                >Submit</Button>
              )
            }
          </Group>
        </Box>
      </>
    </Box >
  );
};

export default CreditReloadForm;
