import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
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
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addOutletDetails } from '../../../services/PDReport.services';

const useStyles = makeStyles((theme) => ({
    sidePanelTitle: {
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
    number: {
        backgroundColor: 'white',
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        }
      },
      input: {
        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        }
      }

}))

const AddNewOutletDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const relationShipOptions = [
        { label: "Choose Relationship", value: "" },
        { label: "Father", value: "FATHER" },
        { label: "Mother", value: "MOTHER" },
        { label: "Uncle", value: "UNCLE" },
        { label: "Aunt", value: "AUNT" },
        { label: "Son", value: "SON" },
        { label: "Daughter", value: "DAUGHTER" },
        { label: "Grandfather", value: "GRANDFATHER" },
        { label: "Grandmother", value: "GRANDMOTHER" },
        { label: "Mother-in-law", value: "MOTHER-IN-LAW" },
        { label: "Father-in-law", value: "FATHER-IN-LAW" },
        { label: "Sister-in-law", value: "SISTER-IN-LAW" },
        { label: "Brother-in-law", value: "BROTHER-IN-LAW" },
        { label: "Brother", value: "BROTHER" },
        { label: "Newphew", value: "NEPHEW" },
        { label: "Partner", value: "PARTNER" },
        { label: "Friend", value: "FRIEND" },
        { label: "Shareholder", value: "SHAREHOLDER" },
        { label: "Buyer", value: "BUYER" },
        { label: "Supplier", value: "SUPPLIER" },
        { label: "Business Neighbour", value: "BUSINESS NEIGHBOUR" },
        { label: "Home Neighbour", value: "HOME NEIGHBOUR" },
        { label: "Director", value: "DIRECTOR" },
        { label: "Proprietor", value: "PROPRIETOR" },
        { label: "Debtors", value: "DEBTORS" },
        { label: "Creditors", value: "CREDITORS" },
        { label: "Principal", value: "PRINCIPAL" },
        { label: "Others", value: "OTHERS" }
    ]




    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            outlet_category: Yup.string().required('Choose outlet category'),
            fuel_transported_from: Yup.string().required('Please enter fuel transported from area'),
            terminal_name: Yup.string().required('Please enter terminal name'),
            size_of_outlet: Yup.number().required('Please enter outlet size'),

        }),
        onSubmit: values => {
            const data = { ...values }

            addOutletDetails(data, dealer_id)
                .then(res => {
                    enqueueSnackbar(res, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'success',
                    });
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
                    });
                })
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
                <div>Add Outlet Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        select
                                        {...inputProps}
                                        labelText="Outlet category"
                                        name="outlet_category"
                                        value={values.outlet_category}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        error={errors.outlet_category}
                                        helperText={errors.outlet_category}
                                    >
                                        <option value="">Choose category</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Fuel Transported from"
                                        name="fuel_transported_from"
                                        value={values.fuel_transported_from}
                                        readOnly={readOnly}
                                        error={errors.fuel_transported_from}
                                        helperText={errors.fuel_transported_from}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Terminal name"
                                        name="terminal_name"
                                        value={values.terminal_name}
                                        readOnly={readOnly}
                                        error={errors.terminal_name}
                                        helperText={errors.terminal_name}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Distance from Terminal (in Km)"
                                        name="distance_from_terminal"
                                        value={values.distance_from_terminal}
                                        readOnly={readOnly}
                                        error={errors.distance_from_terminal}
                                        helperText={errors.distance_from_terminal}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Size of the Outlet (in Sq. ft)"
                                        name="size_of_outlet"
                                        value={values.size_of_outlet}
                                        readOnly={readOnly}
                                        error={errors.size_of_outlet}
                                        helperText={errors.size_of_outlet}
                                        className={classes.number}
                                        inputProps={{className: classes.input}}
                                        type='number'
                                    />
                                </Grid><Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        select
                                        labelText="Land Type"
                                        name="land_type"
                                        value={values.land_type}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        error={errors.land_type}
                                        helperText={errors.land_type}
                                    >
                                        <option value="Owned">Owned</option>
                                        <option value="leased">Leased</option>
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Land Owner Name"
                                        name="land_owner_name"
                                        value={values.land_owner_name}
                                        readOnly={readOnly}
                                        error={errors.land_owner_name}
                                        helperText={errors.land_owner_name}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        money
                                        labelText="Lease Amount"
                                        name="lease_amount"
                                        value={values.lease_amount}
                                        readOnly={readOnly}
                                        error={errors.lease_amount}
                                        helperText={errors.lease_amount}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        select
                                        labelText="Outlet operated by"
                                        name="outlet_operated_by"
                                        value={values.outlet_operated_by}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        error={errors.outlet_operated_by}
                                        helperText={errors.outlet_operated_by}
                                    >
                                        <option>Proprietor</option>
                                        <option>Managing Partner</option>
                                        <option>Third Party</option>
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        select
                                        labelText="Relationship with owner"
                                        name="relation_type_with_owner"
                                        error={errors.relation_type_with_owner}
                                        helperText={errors.relation_type_with_owner}
                                        readOnly={readOnly}
                                        value={values.relation_type_with_owner}
                                        disabled={readOnly}
                                    >
                                        {
                                            relationShipOptions.map((item, i) => {
                                                return (
                                                    <option value={item.value}>{item.label}</option>
                                                )
                                            })
                                        }
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Operator Mobile number"
                                        name="operator_mobile"
                                        value={values.operator_mobile}
                                        readOnly={readOnly}
                                        error={errors.operator_mobile}
                                        helperText={errors.operator_mobile}
                                    />
                                </Grid>
                                {/* <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        money
                                        labelText="Salary expenses per month"
                                        name="salary_expense_per_month"
                                        value={values.salary_expense_per_month}
                                        readOnly={readOnly}
                                        error={errors.salary_expense_per_month}
                                        helperText={errors.salary_expense_per_month}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        money
                                        labelText="EB expenses per month"
                                        name="eb_charge_per_month"
                                        value={values.eb_charge_per_month}
                                        readOnly={readOnly}
                                        error={errors.eb_charge_per_month}
                                        helperText={errors.eb_charge_per_month}
                                    />
                                </Grid> */}
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
        </div>


    )
}

export default AddNewOutletDetailsForm;