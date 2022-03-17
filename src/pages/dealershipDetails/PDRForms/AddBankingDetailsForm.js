import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import * as Yup from 'yup';
import BankDetailsCard from './Components/BankDetailsCard';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { URL } from '../../../config/serverUrls';
import { getBankDetailsbyID, updateBankDetailsByID } from '../../../services/PDReport.services';
import { useQuery, useQueryClient } from 'react-query';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
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
    backgroundColor: '#f6f6f6',
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
  const [editRow, setEditRow] = useState(false);
  const { data: bankData = [] } = useQuery('bank-data', () => getBankDetailsbyID(dealer_id), {refetchOnWindowFocus: false})

  const editBankRow = (rowData, rowIndex) => {
    // setEditRow({ ...rowData, rowIndex });
    setEditRow(true)
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
      account_no: Yup.number().nullable('Enter account number').required('Enter account number'),
      bank_branch: Yup.string('Enter valid branch name').nullable('Enter branch name').required('Enter branch name'),
      account_type: Yup.string('Enter valid type').nullable('Enter account type').required('Enter account type'),
    }),
    onSubmit: values => {
      updateBankDetailsByID(values, dealer_id)
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
          setEditRow(false)

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
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Banking Details</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            bankData.length || addNewRow ? null :
              <Typography className={classes.typography}>No bank found,Click &apos;Add Bank&apos; to add new bank.</Typography>
          }
          {
            addNewRow || editRow ? (
              <>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <TextInput
                      select
                      {...inputProps}
                      labelText="Account Type"
                      name="account_type"
                      value={values.account_type}
                      error={errors.account_type}
                      helperText={errors.account_type}
                    >
                      <option value="">Choose account type</option>
                      <option value="Current">Current</option>
                      <option value="Savings">Savings</option>
                      <option value="SAP">SAP</option>
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Account Holder name"
                      name="account_name"
                      value={values.account_name}
                      error={errors.account_name}
                      helperText={errors.account_name}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      number
                      labelText="Account Number"
                      name="account_no"
                      value={values.account_no}
                      error={errors.account_no}
                      helperText={errors.account_no}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="IFSC"
                      name="ifsc"
                      value={values.ifsc?.toUpperCase()}
                      error={errors.ifsc}
                      helperText={errors.ifsc}
                      onChange={(e) => { onChangeIFSC(e); handleChange(e) }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Name of the Bank"
                      name="bank_name"
                      value={values.bank_name}
                      error={errors.bank_name}
                      helperText={errors.bank_name}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Branch"
                      name="bank_branch"
                      value={values.bank_branch}
                      error={errors.bank_branch}
                      helperText={errors.bank_branch}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="City"
                      name="bank_city"
                      value={values.bank_city}
                      error={errors.bank_city}
                      helperText={errors.bank_city}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      select
                      labelText="Account since"
                      name="account_since"
                      value={values.account_since}
                      error={errors.account_since}
                      helperText={errors.account_since}
                    >
                      {
                        <>
                          <option value="null">Vintage with bank</option>
                          {[...Array(currentYearDiff)].map((_, i) => {
                            return (
                              <option value={currentYear - i} key={i}>{currentYear - i}</option>
                            )
                          })}
                        </>
                      }
                    </TextInput>
                  </Grid>
                </Grid>
                <div className={classes.actionFoot}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button
                        variant="outlined"
                        className={classes.btn}
                        onClick={() => { setAddNewRow(false); setEditRow(false) }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        type="submit"
                        className={clsx(classes.btn, classes.editButton)}
                        startIcon={<CheckOutlinedIcon />}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <BankDetailsCard id={dealer_id} data={bankData} editBankDetails={editBankRow} editable={editable} />
            )
          }
        </div>
      </div >
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          {
            !editable &&
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNewRow(true); setValues({}) }}
              style={{ marginBottom: 12 }}
            >
              Add Bank
            </Button>
          }
        </div>
      </div>
    </div >


  )
}

export default AddBankingDetailsForm;