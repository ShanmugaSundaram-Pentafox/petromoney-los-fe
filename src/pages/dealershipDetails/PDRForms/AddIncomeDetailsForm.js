import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput, { InputWrapper } from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { useMount } from 'react-use';
import { getExpensesDetailsById, getIncomeDetailsById } from '../../../services/PDReport.services';
import { getBusinessTypes } from '../../../services/common.service';

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
    }

}))

const AddIncomeDetailsForm = ({ data, dealer_id, isEdit, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [businessTypes, setBusinessTypes] = useState();
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);



    useMount(() => {
        getBusinessTypes()
            .then(setBusinessTypes)
            .catch(err => {
                console.log('BusinessTypes fetch error - ', err)
            })
        getIncomeDetailsById(dealer_id)
            .then(data => {
                console.log("income respnse >>>>>", data)
                setIncomeData(data[0])
            })
            .catch(err => {
                console.log('Income details fetch error - ', err)
            })
        getExpensesDetailsById(dealer_id)
            .then(data => {
                console.log("expense response >>>>", data);
                setExpenseData(data[0])
            })
            .catch(err => {
                console.log('Expense details fetch error - ', err)
            })
    })



    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: { ...incomeData },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),
        }),
        onSubmit: values => {

            // addOmcDetails(values, dealer_id)
            //     .then(res => {
            //         enqueueSnackbar(res, {
            //             anchorOrigin: {
            //                 vertical: 'top',
            //                 horizontal: 'right',
            //             },
            //             variant: 'success',
            //         });
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 1500);
            //     })
            //     .catch(e => {
            //         console.log(e);
            //     })
        }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }

    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Income/Expense Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Name of the business"
                                        name="business_name"
                                        value={values.business_name}
                                        error={errors.business_name}
                                        helperText={errors.business_name}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Business owner"
                                        name="business_owner"
                                        value={values.business_owner}
                                        error={errors.business_owner}
                                        helperText={errors.business_owner}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Business age"
                                        name="business_age"
                                        value={values.business_age}
                                        error={errors.business_age}
                                        helperText={errors.business_age}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Expenses Type"
                                        name="expense_type"
                                        value={values.expense_type}
                                        error={errors.expense_type}
                                        helperText={errors.expense_type}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        money
                                        labelText="Expenses Amount"
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
                            type="submit"
                            className={clsx(classes.btn, classes.editButton)}
                            startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                            onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
                        >
                            {loading ? <CircularProgress size={20} /> : readOnly ? `Edit` :
                                'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div >


    )
}

export default AddIncomeDetailsForm;