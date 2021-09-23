import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { useSnackbar } from 'notistack';
import { useMount } from 'react-use';
import Button from '../../../../components/CommonComponents/Button/Button';
import TextInput from '../../../../components/TextInput/TextInput';
import { addExpenseDetailsByID, getExpensesDetailsById, getIncomeDetailsById } from '../../../../services/PDReport.services';

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
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 16px'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
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
  btn: {
    margin: 8
  }

}))


const AddExpenseForm = ({ data, isEdit, id, handleClose }) => {
  const [expenseData, setExpenseData] = useState([]);

  useMount(() => {
    getExpensesDetailsById(id)
      .then(data => {
        console.log("expense response >>>>", data);
        setExpenseData(data[0])
      })
      .catch(err => {
        console.log('Expense details fetch error - ', err)
      })
  })

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      // transport_name: Yup.string().required('Please enter transporter name'),
    }),
    onSubmit: values => {
      const data = { ...values, is_pdr: 1 }
      addExpenseDetailsByID(data, id, isEdit)
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
  const inputProps = {
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }

  return (

    <>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    labelText="Expense Type"
                    name="expense_type"
                    value={values.expense_type}
                    error={errors.expense_type}
                    helperText={errors.expense_type}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    labelText="Expense Amount"
                    name="expense_amount"
                    value={values.expense_amount}
                    error={errors.expense_amount}
                    helperText={errors.expense_amount}
                  />
                </Grid>
              </Grid>
            </form>
          </Box >
        </div>
      </div>
      <div className={classes.actionFoot}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              className={classes.btn}
              // disabled={loading}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              type="submit"
              className={clsx(classes.btn, classes.editButton)}
              startIcon={<NavigateNextRounded />}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )

}
export default AddExpenseForm;