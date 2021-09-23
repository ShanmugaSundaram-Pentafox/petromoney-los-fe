import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '../../../components/CommonComponents/Button/Button';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { useMount } from 'react-use';
import { deleteExpenseDetailsByID, deleteIncomeDetailsByID, getExpensesDetailsById, getIncomeDetailsById } from '../../../services/PDReport.services';
import { getBusinessTypes } from '../../../services/common.service';
import AddIncomeForm from './Components/AddIncomeForm';
import AddExpenseForm from './Components/AddExpenseForm';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import { ViewData } from '../../../components/CommonComponents/FilePreview';

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
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
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
  typography: {
    marginBottom: 12
  },
  typo: {
    marginTop: 12,
    marginBottom: 36,
    textAlign: 'center'
  }

}))

const AddIncomeDetailsForm = ({ dealer_id, callback }) => {
  const [businessTypes, setBusinessTypes] = useState();
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [addIncome, setAddIncome] = useState(false);
  const [editIncomeData, setEditIncomeData] = useState({})
  const [addExpense, setAddExpense] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState({});
  const [type, setType] = useState(false)
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();


  useMount(() => {
    getBusinessTypes()
      .then(setBusinessTypes)
      .catch(err => {
        console.log('BusinessTypes fetch error - ', err)
      })
    getIncomeDetailsById(dealer_id)
      .then(data => {
        setIncomeData(data)
      })
      .catch(err => {
        console.log('Income details fetch error - ', err)
      })
    getExpensesDetailsById(dealer_id)
      .then(data => {
        setExpenseData(data)
      })
      .catch(err => {
        console.log('Expense details fetch error - ', err)
      })
  })
  const handleClose = () => {
    callback();
  };
  const handleCancel = () => {
    setAddIncome(false)
    setAddExpense(false)
  }
  const handleIncomeEdit = (item, i) => {
    setAddIncome(true)
    setType(true)
    setEditIncomeData(item)
  }
  const handleIncomeDelete = (item, i) => {
    deleteIncomeDetailsByID(item)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      })
      .catch(e => {
        enqueueSnackbar('Something went wrong.Please try again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }
  const handleExpenseEdit = (item, i) => {
    setAddExpense(true)
    setType(true)
    setEditExpenseData(item)

  }
  const handleExpenseDelete = (item, i) => {
    deleteExpenseDetailsByID(item)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      })
      .catch(e => {
        enqueueSnackbar('Something went wrong.Please try again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Income/Expense Details</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            !addIncome && !addExpense ? (
              <>
                <div>
                  <Typography variant="h4" component="h2" className={classes.typography}>Income details</Typography>
                </div>
                {
                  incomeData.length ? null :
                    <Typography className={classes.typo}>No income data found...</Typography>
                }
                <Grid container spacing={2}>
                  {
                    Array.isArray(incomeData) && incomeData?.map((item, i) => {
                      return (
                        <Grid item md={6}>
                          <PreviewCard
                            onEdit={() => { handleIncomeEdit(item, i) }}
                            onDelete={() => handleIncomeDelete(item, i)}
                          >
                            <Grid container spacing={2}>
                              <Grid item md={6}>
                                <ViewData title="Business name" value={item.business_name} />
                                <ViewData title="Business age(In years)" value={item.business_age} />
                              </Grid>
                              <Grid item md={6}>
                                <ViewData title="Business owner" value={item.business_owner} />
                                <ViewData title="FY income" value={item.cur_fy_income} />
                              </Grid>
                            </Grid>
                          </PreviewCard>
                        </Grid>
                      )
                    })
                  }
                </Grid>
                <div>
                  <Typography variant="h4" component="h2" className={classes.typography}>Expense details</Typography>
                </div>
                {
                  expenseData.length ? null :
                    <Typography className={classes.typo}>No expense data found...</Typography>

                }
                <Grid container spacing={2}>
                  {
                    Array.isArray(expenseData) && expenseData?.map((item, i) => {
                      return (
                        <Grid item md={6}>
                          <PreviewCard
                            onEdit={() => { handleExpenseEdit(item, i) }}
                            onDelete={() => { handleExpenseDelete(item, i) }}
                          >
                            <Grid container spacing={2}>
                              <Grid item md={6}>
                                <ViewData title="Expense type" value={item.expense_type} />
                              </Grid>
                              <Grid item md={6}>
                                <ViewData title="Expense amount" value={item.expense_amount} />
                              </Grid>
                            </Grid>
                          </PreviewCard>
                        </Grid>
                      )
                    })
                  }
                </Grid>
              </>
            ) : (
              <>
                {addIncome && <AddIncomeForm data={editIncomeData} isEdit={type} id={dealer_id} handleClose={handleCancel} />}
                {addExpense && <AddExpenseForm data={editExpenseData} isEdit={type} id={dealer_id} handleClose={handleCancel} />}
              </>

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
          <div>
            <Button
              variant="contained"
              className={clsx(classes.btn, classes.editButton)}
              onClick={() => { setAddIncome(true); setAddExpense(false) }}
            >
              Add income
            </Button>
            <Button
              variant="contained"
              className={clsx(classes.btn, classes.editButton)}
              onClick={() => { setAddExpense(true); setAddIncome(false) }}
            >
              Add expense
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AddIncomeDetailsForm;