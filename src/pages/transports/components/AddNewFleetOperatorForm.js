import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
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
import { addNewFleetOperator, addNewTransport, updateFleetOperator } from '../../../services/transports.service';

const useStyles = makeStyles((theme) => ({
    sidePanelTitle: {
        // textAlign: 'center',
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 0,
        boxShadow: '0 1px 4px -3px #333'
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
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
        overflowX: 'hidden',
    },
    details: {
        padding: 6,
        borderColor: 'grey',
        minWidth: 80,
        height: 50,
        display: 'flex',
        textAlign: 'left',
        alignItems: 'left',
        justifyContent: 'left'
    },
    text: {
        fontSize: 12
    },
    title: {
        fontSize: 11,
        marginBottom: 4,

    },
    readOnlyWrapper: {
        margin: '8px 4px',
        maxWidth: '100%',
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
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
export const ViewData = ({ title, value }) => {
    const classes = useStyles()
    return (
        <Box className={classes.details}>
            <div>
                <p className={classes.title}>{title}</p>
                <strong className={classes.text}>{value ? value : '-'}</strong>
            </div>
        </Box >
    )
}


const AddNewFleetOperatorForm = ({ data, dealer_id, isEdit, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)

    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    }
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),
            // email: Yup.string().email('Enter valid mail id '),
            mobile: Yup.number().min(10, 'Enter valid mobile number').required('Please enter your mobile number'),
            name_on_card: Yup.string().required('Please Enter your name'),
            // amount_limit: Yup.string().required('Please Enter amount limit '),
            dtplus_card_number: Yup.string().max(16, 'Enter valid card number').required('Please enter your card number'),

        }),
        onSubmit: values => {
            if (data) {
                setLoading(true)
                updateFleetOperator(values, dealer_id, data.id)
                    .then(res => {
                        setLoading(false)
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
                        setLoading(false)
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
                setLoading(true);
                addNewFleetOperator(values, dealer_id)
                    .then(res => {
                        setLoading(false)
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
                        setLoading(false)
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


    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Fleet Operator Information</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            {
                readOnly ? (
                    <div className={classes.sidePanelFormContentWrapper}>
                        <Grid container spacing={2} className={classes.readOnlyWrapper}>
                            <Grid item md={6}>
                                <Box className={classes.box} >
                                    <ViewData title='Transport Name' value={values.transport_name} />
                                    <ViewData title='Vehicle Number' value={values.vehicle_no} />
                                    <ViewData title='Mobile' value={values.mobile} />
                                    <ViewData title='Email' value={values.email} />
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box className={classes.box}>
                                    <ViewData title='Amount Limit' value={values.amount_limit} />
                                    <ViewData title='DT Plus Card Number' value={values.dtplus_card_number} />
                                    <ViewData title='Name on Card' value={values.name_on_card} />
                                    <ViewData title='Validity' value={values.validity} />
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    <div className={classes.sidePanelFormContentWrapper}>
                        <div className={classes.stepperRoot}>
                            <Box>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Transport Name"
                                                name="transport_name"
                                                value={values.transport_name?.toUpperCase()}
                                                error={errors.transport_name}
                                                readOnly={readOnly}
                                                helperText={errors.transport_name}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Vehicle Number"
                                                name="vehicle_no"
                                                readOnly={readOnly}
                                                error={errors.vehicle_no}
                                                // helperText={errors.vehicle_no}
                                                defaultValue={values.vehicle_no}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Mobile"
                                                name="mobile"
                                                defaultValue={values.mobile}
                                                onChange={handleChange}
                                                error={errors.mobile}
                                                readOnly={readOnly}
                                                InputLabelProps={{ shrink: true }}
                                                helperText={errors.mobile}
                                            ></TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Email"
                                                name="email"
                                                readOnly={readOnly}
                                                error={errors.email}
                                                helperText={errors.email}
                                                defaultValue={values.email}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Amount Limit"
                                                name="amount_limit"
                                                value={values.amount_limit}
                                                helperText={errors.amount_limit}
                                                readOnly={readOnly}
                                                error={errors.amount_limit}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography className={classes.title} variant="h4">Card Details</Typography>

                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="DT Plus Card Number "
                                                name="dtplus_card_number"
                                                value={values.dtplus_card_number}
                                                error={errors.dtplus_card_number}
                                                readOnly={readOnly}
                                                helperText={errors.dtplus_card_number}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Name on Card"
                                                name="name_on_card"
                                                value={values.name_on_card}
                                                error={errors.name_on_card}
                                                readOnly={readOnly}
                                                helperText={errors.name_on_card}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Validity"
                                                name="validity"
                                                value={values.validity}
                                                error={errors.validity}
                                                readOnly={readOnly}
                                                helperText={errors.validity}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography className={classes.title} variant="h4">Billing Details</Typography>
                                        </Grid>

                                        <Grid item md={6}>
                                            <TextInput
                                                label="Monthly_billing"
                                                name="monthly_billing"
                                                value={values.monthly_billing}
                                                error={errors.monthly_billing}
                                                readOnly={readOnly}
                                                helperText={errors.monthly_billing}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Payment method"
                                                name="mode_of_payment"
                                                value={values.mode_of_payment}
                                                error={errors.mode_of_payment}
                                                readOnly={readOnly}
                                                select
                                                helperText={errors.mode_of_payment}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                                <option>Credit</option>
                                                <option>Cash</option>
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Credit Period"
                                                name="credit_period"
                                                value={values.credit_period}
                                                error={errors.credit_period}
                                                readOnly={readOnly}
                                                helperText={errors.credit_period}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Total Credit Outstanding"
                                                name="total_credit_outstand"
                                                value={values.total_credit_outstand}
                                                error={errors.total_credit_outstand}
                                                readOnly={readOnly}
                                                helperText={errors.total_credit_outstand}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                label="Highest number of days Outstanding"
                                                name="highest_no_of_days_outstanding"
                                                value={values.validity}
                                                error={errors.validity}
                                                readOnly={readOnly}
                                                helperText={errors.validity}
                                                InputLabelProps={{ shrink: true }}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box >
                        </div>
                    </div>

                )

            }

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
                        !readOnly ? (
                            !loading ? (
                                <>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    className={clsx(classes.btn, classes.editButton)}
                                    startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                                    // disabled={loading}
                                    onClick={loading ? () => null : handleSubmit}
                                    >
                                    Save
                                </Button>
                                </>   
                            ) : (
                                <div style={{display: 'flex', justifyContent: 'flex-end', width: '90%', margin: '0 auto'}}>
                                  <CircularProgress size={30}/>
                                </div>
                            )
                        ) : (
                            <>
                            <div>
                            <Button
                            variant="contained"
                            type="submit"
                            className={clsx(classes.btn, classes.editButton)}
                            startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                            // disabled={loading}
                            onClick={loading ? () => null : handleEdit }
                        >
                            Edit
                        </Button>
                        </div>
                        </>
                        )
                    }
                </div>
            </div>
        </div >


    )
}

export default AddNewFleetOperatorForm;