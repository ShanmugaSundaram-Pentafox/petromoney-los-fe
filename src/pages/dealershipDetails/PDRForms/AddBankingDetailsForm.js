import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import BankDetailsCard from './Components/BankDetailsCard';
import { action_id, resources_id } from '../../../config/accessControl';
import { URL } from '../../../config/serverUrls';
import { getBankDetailsbyID, updateBankDetailsByID } from '../../../services/PDReport.services';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';
import { ActionIcon, Button, Divider, Grid, Select, Text, TextInput, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '55vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  sidePanelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
    padding: 14,
  },
  actionFoot: {
    marginBottom: 16,
    marginTop: 12,

  },
  tableRow: {
    cursor: 'pointer'
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
  },
  table: {
    padding: 8,
    marginTop: 8
  },
  btn: {
    margin: 8
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
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
  subTitle: {
    marginTop: 8,
    marginBottom: 8
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
  typography: {
    marginTop: 12,
    textAlign: 'center'
  },
}))

const AddBankingDetailsForm = ({ dealer_id, isEdit, callback, currentUser, editable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient()
  const classes = useStyles()
  const [addNewRow, setAddNewRow] = useState(false);
  const [editRow, setEditRow] = useState({ editForm: false, index: 0});
  const { data: bankData = [] } = useQuery('bank-data', () => getBankDetailsbyID(dealer_id), {refetchOnWindowFocus: false})

  const editBankRow = (rowData, rowIndex) => {
    // setEditRow({ ...rowData, rowIndex });
    setEditRow({ editForm: true, index: rowIndex })
    setValues(rowData)
  }
  const handleClose = () => {
    callback();
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      ifsc: Yup.string().required('Enter IFSC code').nullable('Enter IFSC code').matches(/^[A-Za-z]{4}0[A-Z0-9]{6}$/, 'Enter valid IFSC'),
      account_name: Yup.string('Enter valid name').nullable('Enter Account Holder name').required('Enter Account holder name'),
      bank_name: Yup.string('Enter valid name').nullable('Enter bank name').required('Enter name'),
      account_no: Yup.string().nullable('Enter account number').required('Enter account number').matches(/^(?=.*\d)[a-zA-Z0-9]+$/,'Enter valid account number'),
      bank_branch: Yup.string('Enter valid branch name').nullable('Enter branch name').required('Enter branch name'),
      account_type: Yup.string('Enter valid type').nullable('Enter account type').required('Enter account type'),
    }),
    onSubmit: finalValues => {
      let v = { ...finalValues };
      if(finalValues.id) {
        v = compareObject(bankData[editRow?.index], finalValues, { id: finalValues.id })
      }
      updateBankDetailsByID(v, dealer_id)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          }
          )
          queryClient.invalidateQueries('bank-data')
          setAddNewRow(false)
          setEditRow({ editForm: false })

        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          }
          )
        })
    }
  });
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentYearDiff = date.getFullYear() - 1970;

  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }

  const onChangeIFSC = e => {
    if (/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(e.target.value)) {
      fetch(`${URL.ifscApiUrl}${e.target.value}`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          if (data.BANK) {
            setValues({
              ...values,
              ifsc: data.IFSC,
              bank_name: data.BANK,
              bank_branch: data.BRANCH,
              bank_city: data.CITY
            })
          } else {
            console.log(data)
          }
        })
        .catch(err => {
          console.log('GET IFSC DATA ERR >> ', err)
        })
    }
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Title order={3} className={classes.sidePanelTitle}>
        <div>Add Banking Details</div>
        <ActionIcon variant="white" color="gray" onClick={handleClose}>
          <IconX strokeWidth={1.5} size={20} color='black'/>
        </ActionIcon>
      </Title>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            bankData.length || addNewRow ? null :
              <Text className={classes.typography}>No bank found, Click &apos;Add Bank&apos; to add new bank.</Text>
          }
          {
            addNewRow || editRow?.editForm ? (
              <>
                <Grid gutter={'sm'}>
                  <Grid.Col span={6}>
                    <Select
                      styles={{
                        dropdown: { zIndex: 99999 }
                      }}
                      data={[
                        { value: 'Current', label: 'Current' },
                        { value: 'Savings', label: 'Savings' },
                        { value: 'SAP', label: 'SAP' },
                        { value: 'OD', label: 'OD' },
                        { value: 'eDFS', label: 'eDFS' },
                        { value: 'DT Plus', label: 'DT Plus' },]
                      }
                      label='Account Type'
                      placeholder="Choose account type"
                      value={values.account_type}
                      error={errors.account_type}
                      onChange={(e) => setFieldValue('account_type', e)} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Account Holder name"
                      placeholder='Enter account holder name'
                      value={values.account_name}
                      error={errors.account_name}
                      onChange={(e) => setFieldValue('account_name', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Account Number"
                      placeholder='Enter account number'

                      value={values.account_no?.toUpperCase()}
                      error={errors.account_no}
                      onChange={(e) => setFieldValue('account_no', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="IFSC"
                      placeholder='Enter IFSC number'
                      value={values.ifsc?.toUpperCase()}
                      error={errors.ifsc}
                      onChange={(e) => { onChangeIFSC(e) ,setFieldValue('ifsc',e.target.value)}}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Name of the Bank"
                      placeholder='Enter bank name'
                      value={values.bank_name}
                      error={errors.bank_name}
                      onChange={(e) => setFieldValue('bank_name', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Branch"
                      placeholder='Enter branch name'
                      value={values.bank_branch}
                      error={errors.bank_branch}
                      onChange={(e) => setFieldValue('bank_branch', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="City"
                      placeholder='Enter city name'
                      value={values.bank_city}
                      error={errors.bank_city}
                      onChange={(e) => setFieldValue('bank_city', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      styles={{
                        dropdown: { zIndex: 99999 }
                      }}
                      data={[...Array(currentYearDiff)].map((_, i) => ({
                        value: String(currentYear - i),
                        label: String(currentYear - i)
                      }))}
                      label='Account since'
                      placeholder="Vintage with bank"
                      value={String(values.account_since)}
                      searchable
                      error={errors.account_since}
                      onChange={(e) => setFieldValue('account_since', e)} />
                  </Grid.Col>
                </Grid>
                <div className={classes.actionFoot}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button
                        size='xs'
                        variant="light"
                        className={classes.btn}
                        onClick={() => { setAddNewRow(false); setEditRow({ editForm: false }) }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        size='xs'
                        type="submit"
                        color='green'
                        className={clsx(classes.btn, classes.editButton)}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <BankDetailsCard id={dealer_id} data={bankData} editBankDetails={editBankRow} editable={editable} currentUser={currentUser} />
            )
          }
        </div>
      </div >
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              size='xs'
              variant="light"
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion.bankAdd}>
            <Button
              size='xs'
              onClick={() => { setAddNewRow(true); setValues({}) }}
            >
              Add Bank
            </Button>
          </CheckAllowed>
        </div>
      </div>
    </div >


  )
}

export default AddBankingDetailsForm;