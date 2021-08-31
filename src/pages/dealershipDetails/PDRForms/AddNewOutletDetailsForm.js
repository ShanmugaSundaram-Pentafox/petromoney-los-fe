import React, { Fragment, useState } from 'react';
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
import { addOutletDetails } from '../../../services/PDReport.services';

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
        width: '40vw'
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

const AddNewOutletDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [apiData, setApiData] = useState({});
    const [editRow, setEditRow] = useState({});


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };


    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),

        }),
        onSubmit: values => {
            const data = {...values}

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
                },1500);
            })
            .catch(e => {
                console.log(e);
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
                                        {...inputProps}
                                        labelText="Outlet Address"
                                        name="outlet_address"
                                        value={values.outlet_address}
                                        readOnly={readOnly}
                                        error={errors.outlet_address}
                                        helperText={errors.outlet_address}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Outlet Landmark"
                                        name="outlet_landmark"
                                        value={values.outlet_landmark}
                                        readOnly={readOnly}
                                        error={errors.outlet_landmark}
                                        helperText={errors.outlet_landmark}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Distance from Headquaters"
                                        name="distance_from_headquater"
                                        value={values.distance_from_headquater}
                                        readOnly={readOnly}
                                        error={errors.distance_from_headquater}
                                        helperText={errors.distance_from_headquater}
                                    />
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
                                        labelText="Distance from Terminal"
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
                                        labelText="Size of the Outlet"
                                        placeholder="in Sq. ft"
                                        name="size_of_outlet"
                                        value={values.size_of_outlet}
                                        readOnly={readOnly}
                                        error={errors.size_of_outlet}
                                        helperText={errors.size_of_outlet}
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
                                </Grid><Grid item md={6}>
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
                                        name="relation_type"
                                        value={values.relation_type}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        error={errors.relation_type}
                                        helperText={errors.relation_type}
                                    />
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
                                <Grid item md={6}>
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
        </div>


    )
}

export default AddNewOutletDetailsForm;