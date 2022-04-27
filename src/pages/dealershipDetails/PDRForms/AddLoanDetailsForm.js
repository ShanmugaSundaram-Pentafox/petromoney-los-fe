import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core'
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { getLoanTypes } from '../../../services/common.service';
import { addLoanDetailsByID, deleteLoanDetailsByID, getLoanDetailsbyID, updateLoanDetailsByID } from '../../../services/PDReport.services';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    overflow: 'auto',
    backgroundColor: '#f6f6f6',
  },
  sidePanelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
    padding: 14,
  },
  actionButtons: {
    // paddingTop: 8
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
  actionFoot: {
    marginBottom: 16,
    marginTop: 12,

  },
  btn: {
    margin: 8
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
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  }

}))

const AddLoanDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser, editable }) => {

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [loanData, setLoanData] = useState([])
  const [loanTypes, setLoanTypes] = useState([])
  const [addNew, setAddNew] = useState(loanData ? false : true)
  const [editRow, setEditRow] = useState(false);

  useMount(() => {
    getLoanDetailsbyID(dealer_id)
      .then(data => {
        setLoanData(data)
      })
      .catch((e) => {
        console.log(e);
      })
    getLoanTypes()
      .then(data => {
        setLoanTypes(data)
      })
      .catch((e) => {
        console.log(e)
      })
  })
  const handleClose = () => {
    callback();
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      loan_type: Yup.string().nullable('Choose loan type').required('Choose loan type'),
      loan_amount: Yup.number().nullable('Enter loan amount').required('Enter loan amount'),
      bank_name: Yup.string().nullable('Enter valid bank name').required('Enter valid bank name'),

    }),
    onSubmit: values => {
      if (editRow) {
        updateLoanDetailsByID(values, dealer_id)
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
      else {
        addLoanDetailsByID(values, dealer_id)
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
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }
  const editLoanRow = (rowData, rowIndex) => {
    setEditRow(true)
    setValues(rowData)
  }
  const deleteLoanRow = (row, index) => {
    deleteLoanDetailsByID(row, dealer_id)
      .then(data => {
        enqueueSnackbar(data, {
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
      .catch((e) => {
        console.log(e);
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
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Loan Details</div>
        <IconButton onClick={handleClose}  size='small'>
          <CloseIcon fontSize='size' />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            loanData.length || addNew ? null :
              <Typography className={classes.typography}>No loan found&#44; Click &apos;Add Loan&apos; to add new loan.</Typography>
          }
          {
            addNew || editRow ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      select
                      labelText="Loan Type"
                      name="loan_type"
                      value={values.loan_type}
                      error={errors.loan_type}
                      helperText={errors.loan_type}
                    >
                      {loanTypes.map((type, i) => (<option key={i} value={type.loan_id}>{type.name}</option>))}
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Bank/NBFC name"
                      name="bank_name"
                      value={values.bank_name}
                      error={errors.bank_name}
                      helperText={errors.bank_name}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      money
                      labelText="Monthly obligation towards this Loan"
                      name="loan_amount"
                      value={values.loan_amount}
                      error={errors.loan_amount}
                      helperText={errors.loan_amount}
                      className={classes.number}
                      inputProps={{ className: classes.input }}
                      type='number'
                    />
                  </Grid>
                </Grid>
                <div className={classes.actionFoot}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button
                        variant="outlined"
                        className={classes.btn}
                        onClick={() => { setAddNew(false); setEditRow(false) }}
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
              </Box >
            ) : (
              <Grid container spacing={2}>{
                loanData.map((item, i) => {
                  return (
                    <Grid item md={6} key={i}>
                      <PreviewCard
                        onEdit={() => { editLoanRow(item, i) }}
                        onDelete={() => deleteLoanRow(item, i)}
                        action={!editable}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <ViewData title="Bank name" value={item.bank_name} />
                            <ViewData title="Loan type" value={(loanTypes.find(function (type, index) {
                              if (type.loan_id == item?.loan_type)
                                return true;
                            }))?.name} />
                            <ViewData title="Amount" value={item.loan_amount} />
                          </Grid>
                          <Grid item md={6}>
                          </Grid>
                        </Grid>
                      </PreviewCard>
                    </Grid>
                  )
                })
              }
              </Grid>
            )
          }
        </div>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              // disabled={loading}
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
              onClick={() => { setAddNew(true); setValues({}) }}
              style={{ marginBottom: 12 }}
            >
              Add Loan
            </Button>
          }
        </div>
      </div>
    </div >


  )
}

export default AddLoanDetailsForm;