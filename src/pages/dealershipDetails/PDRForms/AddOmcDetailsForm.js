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
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

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

const AddOmcDetailsForm = ({ data, dealer_id, isEdit, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState()


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const handleDateChange = (date) => {
        setSelectedDate(date)
        // handleDate(date)
    }
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            transport_name: Yup.string().required('Please enter transporter name'),

        }),
        // onSubmit: values => {
        //     updateFleetOperator(values, dealer_id, data.id)
        //         .then(res => {
        //             console.log(res)
        //             enqueueSnackbar(res, {
        //                 anchorOrigin: {
        //                     vertical: 'top',
        //                     horizontal: 'right',
        //                 },
        //                 variant: 'success',
        //             }
        //             )
        //             setTimeout(() => {
        //                 window.location.reload()
        //             }, 1500);

        //         })
        //         .catch(e => {
        //             enqueueSnackbar(e, {
        //                 anchorOrigin: {
        //                     vertical: 'top',
        //                     horizontal: 'right',
        //                 },
        //                 variant: 'error',
        //             }
        //             )
        //         })


        // }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add OMC Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* <Grid item md={6}>
                                    <TextInput
                                        select
                                        {...inputProps}
                                        labelText="OMC"
                                        name="omc"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Region"
                                        name="omc_region"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    />
                                </Grid> */}
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Sales officer name"
                                        name="sales_officer_name"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Sales officer mobile"
                                        name="sales_officer_mobile"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    />
                                </Grid>
                            </Grid>
                            {/* <Typography className={classes.subTitle} variant="h5"><div>OMC Agreement Details</div></Typography> */}
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <InputWrapper direction top>
                                        <label className="input-label">Agreement executed on</label>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                hideTabs={true}
                                                variant='inline'
                                                inputVariant='outlined'
                                                format='MM/dd/yyy'
                                                animateYearScrolling={true}
                                                invalidDateMessage='Invalid Date Format'
                                                margin='normal'
                                                id='date-picker'
                                                autoOk={true}
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                keyboardButtonProps={{
                                                    'aria-label': 'change date'
                                                }}
                                                PopoverProps={{
                                                    anchorOrigin: {
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </InputWrapper>
                                    {/* <TextInput
                                        {...inputProps}
                                        labelText="Agreement Executed on"
                                        name="agreement_executed_on"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    /> */}
                                </Grid>
                                <Grid item md={6}>
                                    {/* <TextInput
                                        {...inputProps}
                                        labelText="Agreement valid till"
                                        name="agreement_validity"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    /> */}
                                    <InputWrapper direction top>
                                        <label className="input-label">Agreement valid till</label>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                hideTabs={true}
                                                variant='inline'
                                                inputVariant='outlined'
                                                format='MM/dd/yyy'
                                                animateYearScrolling={true}
                                                invalidDateMessage='Invalid Date Format'
                                                margin='normal'
                                                id='date-picker'
                                                autoOk={true}
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                keyboardButtonProps={{
                                                    'aria-label': 'change date'
                                                }}
                                                PopoverProps={{
                                                    anchorOrigin: {
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </InputWrapper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        select
                                        {...inputProps}
                                        labelText="Outlet category"
                                        name="outlet_category"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </TextInput>
                                </Grid>
                            </Grid>

                            {/* <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        select
                                        {...inputProps}
                                        labelText="Vintage of the outlet"
                                        name="outlet_vintage"
                                        value={values.id}
                                        readOnly={readOnly}
                                        error={errors.id}
                                        helperText={errors.id}
                                    />
                                </Grid>
                            </Grid> */}
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

export default AddOmcDetailsForm;