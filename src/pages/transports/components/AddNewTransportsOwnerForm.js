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

const AddNewTransportsOwnerForm = ({ handleNext, currentUser, dealer_id, isEdit, form_data, id, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
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
            ...form_data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // id: Yup.number().required('Please enter transporter code'),
            first_name: Yup.string().required('Please enter transporter name'),
            last_name: Yup.string().required('Please enter transporter name'),
            email: Yup.string().email('Enter valid mail id '),
            mobile: Yup.number().min(10, 'Enter valid mobile number').required('please Enter your mobile number'),
            address: Yup.string().required('Please enter address'),
        }),
        onSubmit: values => {
            const data = new FormData();
            Object.keys(values).forEach(key => {
                data.append(key, values[key]);
            })
            if (id === null) {
                fetch(`${URL.base
                    }transport/owner/${id} `, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Authorization': `Bearer ${currentUser.token} `
                    }
                })
                    .then(res => {
                        console.log("result", res)
                        enqueueSnackbar(res, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        }
                        )
                        // window.location.reload();
                    })
                    .catch(error => {
                        enqueueSnackbar(error.message, {
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
                data.append('dealership_id', dealer_id)
                fetch(`${URL.base}transport/owner`, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Authorization': `Bearer ${currentUser.token} `
                    }
                })
                    .then(res => {
                        console.log("result", res)
                        enqueueSnackbar(res.message, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        }
                        )

                    })
                    .catch(error => {
                        console.log(error);
                        enqueueSnackbar(error.message, {
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

    const aadharBack = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.aadhar_b_file_url} target="_blank" title={'Aadhar Back'}>{'Aadhar Back'}</a>
        )
    }
    const profileAttachment = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.profile_image_url} target="_blank" title={'Profile Attachment'}>{'Profile Attachment'}</a>
        )
    }

    const aadharFront = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.aadhar_f_file_url} target="_blank" title={'Aadhar Front'}>{'Aadhar Front'}</a>
        )
    }
    const panAttachment = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.pan_file_url} target="_blank" title={'PAN Attachment'}>{'PAN Attachment'}</a>
        )
    }


    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Owner Information</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        label="First Name"
                                        name="first_name"
                                        defaultValue={values.first_name}
                                        error={errors.first_name}
                                        readOnly={readOnly}
                                        helperText={errors.first_name}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="Last Name"
                                        name="last_name"
                                        readOnly={readOnly}
                                        error={errors.last_name}
                                        helperText={errors.last_name}
                                        defaultValue={values.last_name}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        id="date"
                                        label="Date of Birth"
                                        name="dob"
                                        error={errors.dob}
                                        helperText={errors.dob}
                                        readOnly={readOnly}
                                        defaultValue={values.dob}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        select
                                        label="Gender"
                                        name="gender"
                                        error={errors.gender}
                                        helperText={errors.gender}
                                        value={values.gender}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        onChange={handleChange}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="null">Select Gender</option>
                                        <option value={'MALE'}>Male</option>
                                        <option value={'FEMALE'}>Female</option>
                                    </TextInput>
                                </Grid>
                                <Grid item md={12}>
                                    <TextInput
                                        label="Address"
                                        name="address"
                                        readOnly={readOnly}
                                        defaultValue={values.address}
                                        error={errors.address}
                                        helperText={errors.address}
                                        onChange={handleChange}
                                        rows={3}
                                        multiline={true}
                                        InputLabelProps={{ shrink: true }}

                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        select
                                        label="Residing Since"
                                        name="residing_since"
                                        value={values.residing_since}
                                        error={errors.residing_since}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        {
                                            <>
                                                <option value="null">Residing Since</option>
                                                {[...Array(currentYearDiff)].map((_, i) => {
                                                    return (
                                                        <option value={currentYear - i}>{currentYear - i}</option>
                                                    )
                                                })}
                                            </>
                                        }
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        select
                                        label="Marital Status"
                                        name="marital_status"
                                        error={errors.marital_status}
                                        helperText={errors.marital_status}
                                        value={values.marital_status}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="null">Choose Marital Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="Mobile"
                                        name="mobile"
                                        value={values.mobile}
                                        onChange={handleChange}
                                        error={errors.mobile}
                                        readOnly={readOnly}
                                        helperText={errors.mobile}
                                        type='number'
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
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="Aadhar"
                                        name="aadhar"
                                        value={values.aadhar}
                                        helperText={errors.aadhar}
                                        readOnly={readOnly}
                                        error={errors.aadhar}
                                        onChange={handleChange}
                                    >
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="PAN Number"
                                        name="pan"
                                        value={values.pan}
                                        error={errors.pan}
                                        readOnly={readOnly}
                                        helperText={errors.pan}
                                        onChange={handleChange}
                                    >
                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <Typography component="div">
                                        <Grid component="label" container alignItems="center" style={{ marginBottom: '10px', marginTop: '6px' }} spacing={2}>
                                            <Grid md={12} style={{ paddingLeft: '8px', fontSize: '13px' }}>Mobile number on Whatsapp?</Grid>
                                            <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                                            <Grid>
                                                <Switch
                                                    checked={state.checkedA}
                                                    onChange={handleChange}
                                                    name="checkedA"
                                                    color="primary"
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                            </Grid>
                                            <Grid>Yes</Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <Typography component="div" >
                                        <Grid component="label" container style={{ marginBottom: '8px', marginTop: '6px' }} alignItems="center" spacing={2}>
                                            <Grid md={12} style={{ paddingLeft: '8px', fontSize: '13px' }}>Mobile number linked with AADHAR?</Grid>
                                            <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                                            <Grid>
                                                <Switch
                                                    checked={state.checkedB}
                                                    onChange={handleChange}
                                                    color="primary"
                                                    name="checkedB"
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                            </Grid>
                                            <Grid>Yes</Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                                <Grid md={12} style={{ margin: '16px 8px' }}>
                                    <Typography variant="title">Documents </Typography>
                                </Grid>
                                <Grid item md={12}>
                                    <Typography variant="subtitle2" component="subtitle2">
                                        Photo :
                                        <>
                                            {
                                                data.profile_image_url ? profileAttachment() :
                                                    <>
                                                        <TextInput
                                                            type="file"
                                                            accept="image/*"
                                                            name="pan_file_url"
                                                            value={data.profile_image_url}
                                                            onChange={(event) => {
                                                                values[event.target.name] = event.currentTarget.files[0];
                                                            }}
                                                            InputLabelProps={{ shrink: true }}
                                                        ></TextInput>
                                                    </>
                                            }
                                        </>
                                    </Typography>
                                </Grid>
                                <Grid item md={12}>
                                    <Typography variant="subtitle2" component="subtitle2">
                                        PAN :
                                        <>
                                            {data.pan_file_url ? panAttachment() :
                                                <>
                                                    <TextInput
                                                        type="file"
                                                        accept="image/*"
                                                        name="pan_file_url"
                                                        value={data.pan_file_url}
                                                        onChange={(event) => {
                                                            values[event.target.name] = event.currentTarget.files[0];
                                                        }}
                                                        InputLabelProps={{ shrink: true }}
                                                    ></TextInput>
                                                </>
                                            }
                                        </>
                                    </Typography>
                                </Grid>
                                <Grid item md={12} style={{ marginBottom: '8px' }}>
                                    <Typography variant="subtitle1">Aadhar </Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <Typography variant="subtitle2" component="subtitle2">
                                        Front:
                                        <>
                                            {data.aadhar_f_file_url ? aadharFront() :
                                                <>
                                                    <TextInput
                                                        type="file"
                                                        accept="image/*"
                                                        name="aadhar_f_file_url"
                                                        value={data.aadhar_f_file_url}
                                                        onChange={(event) => {
                                                            values[event.target.name] = event.currentTarget.files[0];
                                                        }}
                                                        InputLabelProps={{ shrink: true }}
                                                    ></TextInput>
                                                </>
                                            }
                                        </>
                                    </Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <Typography variant="subtitle2" component="subtitle2">
                                        Back:
                                        <>
                                            {data.aadhar_b_file_url ?
                                                aadharBack() :
                                                <>
                                                    <TextInput
                                                        type="file"
                                                        accept="image/*"
                                                        name="aadhar_b_file_url"
                                                        value={data.aadhar_b_file_url}
                                                        onChange={(event) => {
                                                            values[event.target.name] = event.currentTarget.files[0];
                                                        }}
                                                        InputLabelProps={{ shrink: true }}
                                                    ></TextInput>
                                                </>
                                            }
                                        </>
                                    </Typography>
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

export default AddNewTransportsOwnerForm;