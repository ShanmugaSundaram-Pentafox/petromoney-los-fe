import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useMount } from 'react-use';
import { useSnackbar } from 'notistack';
import { getBankDetailsbyID, updateBankDetailsByID } from '../../../services/PDReport.services';
import BankDetailsCard from './Components/BankDetailsCard';

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
  }
}))

const AddBankingDetailsForm = ({ dealer_id, isEdit, callback, currentUser }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [bankData, setBankData] = useState([])
  const [addNewRow, setAddNewRow] = useState(false);
  const [editRow, setEditRow] = useState(false);

  useMount(() => {
    getBankDetailsbyID(dealer_id)
      .then(data => {
        setBankData(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })
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
      ifsc: Yup.string().length(11).required("Enter valid IFSC code"),
      account_name: Yup.string('Enter valid name').nullable('Enter Account Holder name').required('Enter Account holder name'),
      bank_name: Yup.string('Enter valid name').nullable('').required('Enter name'),
      account_no: Yup.number().nullable('Enter account number').required('Enter account number'),
      bank_branch: Yup.string('Enter valid branch name').nullable('Enter branch name').required('Enter branch name'),
      account_type: Yup.string('Enter valid type').nullable('Enter account type').required('Enter account type'),
      transaction_limit: Yup.number('Enter valid amount').nullable('Enter transaction limit').required('Enter transaction limit')
    }),
    onSubmit: values => {
      updateBankDetailsByID(values, dealer_id)
        .then(res => {
          console.log(res)
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          }
          )
          setTimeout(() => {
            window.location.reload()
          }, 1500);

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
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }
  // const onChangeIFSC = (value) => {
  //     fetch(`${URL.ifscApiUrl}${value}`)
  //         .then(res => {
  //             return res.json()
  //         })
  //         .then(data => {
  //             console.log("data 111", data)
  //             if (data.BANK) {
  //                 console.log("data", data)
  //             } else {
  //                 enqueueSnackbar("please enter valid IFSC code", {
  //                     anchorOrigin: {
  //                         vertical: 'top',
  //                         horizontal: 'right',
  //                     },
  //                     variant: 'warning',
  //                 }
  //                 )
  //             }
  //         })
  //         .catch(err => {
  //             console.log('GET IFSC DATA ERR >> ', err)
  //             enqueueSnackbar("please enter valid IFSC code", {
  //                 anchorOrigin: {
  //                     vertical: 'top',
  //                     horizontal: 'right',
  //                 },
  //                 variant: 'warning',
  //             }
  //             )
  //         })
  // }
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
              <Typography className={classes.typography}>No bank found,Click 'Add Bank' to add new bank.</Typography>
          }
          {
            addNewRow || editRow ? (
              <>
                <Grid container spacing={2}>
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
                      labelText="Account Number"
                      name="account_no"
                      type="number"
                      value={values.account_no}
                      error={errors.account_no}
                      helperText={errors.account_no}
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

                      direction="column"
                      alignTop={true}
                      labelText="IFSC"
                      name="ifsc"
                      value={values.ifsc}
                      error={errors.ifsc}
                      helperText={errors.ifsc}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Account Type"
                      name="account_type"
                      value={values.account_type}
                      error={errors.account_type}
                      helperText={errors.account_type}
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
                              <option value={currentYear - i}>{currentYear - i}</option>
                            )
                          })}
                        </>
                      }
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      money
                      labelText="Transaction Limit"
                      name="transaction_limit"
                      type="number"
                      value={values.transaction_limit}
                      error={errors.transaction_limit}
                      helperText={errors.transaction_limit}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      select
                      labelText="Is Secured"
                      name="security"
                      value={values.security}
                      error={errors.security}
                      helperText={errors.security}
                    >
                      <option>Secured</option>
                      <option>Unsecured</option>
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
              <BankDetailsCard id={dealer_id} data={bankData} editBankDetails={editBankRow} />
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
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNewRow(true); setValues({}) }}
              style={{ marginBottom: 12 }}
            >
              Add Bank
            </Button>
          </div>
        </div>
      </div>
    </div >


  )
}

export default AddBankingDetailsForm;