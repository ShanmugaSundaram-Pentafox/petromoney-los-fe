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
import { URL } from '../../../config/serverUrls';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addNewFleetOperator, addNewTransport } from '../../../services/transports.service';

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
    wrapper: {
        padding: 8,
        width: '50vw',
    },
    title: {
        paddingLeft: 8,
        marginBottom: 8
    },
    table: {
        // minWidth: 650,
        padding: 8
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    footer: {
        paddingTop: 8,
        textAlign: 'right'
    },
    sidePanelWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '40vw',
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
    sidePanelWrapper: {
        width: '40vw',
        padding: '14px',
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
    },
    transportFormWrapper: {
        padding: theme.spacing(2),
    },
    transWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
    },
    ownerWrapper: {
        flex: 1,
        overflowY: 'auto'
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
    },
    actionButtons: {
        // paddingTop: 8
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
    },
    stepTitle: {
        '& .MuiStepLabel-label.MuiStepLabel-active': {
            fontSize: 15,
            fontWeight: 600
        }
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

const AddNewFleetOperatorForm = ({ data, dealer_id, isEdit,callback}) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false)
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
    });
    const handleClick = () => {
        setChecked(!checked);
    };
    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    }
    const { enqueueSnackbar } = useSnackbar();
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentYearDiff = date.getFullYear() - 1970;
    const classes = useStyles()


    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            transport_name: Yup.string().required('Please enter transporter name'),
            vehicle_no: Yup.string().required('Please enter vehicle number'),
            // email: Yup.string().email('Enter valid mail id '),
            // mobile: Yup.number().min(10, 'Enter valid mobile number').required('Please enter your mobile number'),
            // name_on_card: Yup.string().required('Please Enter your name'),
            // amount_limit: Yup.string().required('Please Enter amount limit '),
            // validity: Yup.date('Enter valid date'),
            // dtplus_card_number: Yup.string().max(16, 'Enter valid card number').required('Please enter your card number'),

        }),
        onSubmit: values => {
            addNewFleetOperator(values, dealer_id)
                .then(message => {
                    console.log(message)
                    // setApiStatus({ type: 'success', message: message })
                })
                .catch(e => {
                    // setApiStatus({ type: 'error', message: e })
                    console.log(e);
                })
        }
    });


    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Fleet Operator Information</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        label="Transport Name"
                                        name="transport_name"
                                        defaultValue={values.transport_name}
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
                            // disabled={loading}
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

export default AddNewFleetOperatorForm;