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
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import moment from 'moment';
import { URL } from '../../../config/serverUrls';

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

const AddOmcDetailsForm = ({ data, dealer_id, isEdit, currentUser, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [executedDate, setExecutedDate] = useState(data?.agreement_executed_on)
    const [validDate, setValidDate] = useState(data?.agreement_valid_till)

    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const handleExecutedDateChange = (date) => {
        setExecutedDate(date)
    }
    const handleValidDateChange = (date) => {
        setValidDate(date)
    }
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

            const executed_date = moment(executedDate).format('YYYY-MM-DD');
            const valid_date = moment(validDate).format('YYYY-MM-DD');
            const date = { ...values, agreement_executed_on: executed_date, agreement_valid_till: valid_date };
            const data = new FormData();
            Object.keys(date).forEach((key) => {
                data.append(key, date[key]);
            });
            fetch(`${URL.base}dealership/${dealer_id}`, {
                method: 'POST',
                body: data,
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then(res => {
                    enqueueSnackbar(res.message, {
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
                    enqueueSnackbar(e.message, {
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
                <div>Add OMC Details</div>
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
                                        labelText="Sales officer name"
                                        name="sales_officer_name"
                                        value={values.sales_officer_name}
                                        readOnly={readOnly}
                                        error={errors.sales_officer_name}
                                        helperText={errors.sales_officer_name}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Sales officer mobile"
                                        name="sales_officer_mobile"
                                        value={values.sales_officer_mobile}
                                        readOnly={readOnly}
                                        error={errors.sales_officer_mobile}
                                        helperText={errors.sales_officer_mobile}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Mode Call/Mail"
                                        name="communication_mode"
                                        value={values.communication_mode}
                                        error={errors.communication_mode}
                                        helperText={errors.communication_mode}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <label className="input-label">Dealership agreement executed on</label>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            hideTabs={true}
                                            variant='inline'
                                            inputVariant='outlined'
                                            readOnly={readOnly}
                                            disabled={readOnly}
                                            format='yyyy-MM-dd'
                                            animateYearScrolling={true}
                                            invalidDateMessage='Invalid Date Format'
                                            margin='normal'
                                            id='date-picker'
                                            autoOk={true}
                                            value={executedDate}
                                            onChange={handleExecutedDateChange}
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
                                </Grid>
                                <Grid item md={6}>
                                    <label className="input-label">Dealership agreement valid till</label>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            hideTabs={true}
                                            variant='inline'
                                            inputVariant='outlined'
                                            format='yyyy-MM-dd'
                                            readOnly={readOnly}
                                            disabled={readOnly}
                                            animateYearScrolling={true}
                                            invalidDateMessage='Invalid Date Format'
                                            margin='normal'
                                            id='date-picker'
                                            autoOk={true}
                                            value={validDate}
                                            onChange={handleValidDateChange}
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

export default AddOmcDetailsForm;