import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import Button from '../../../components/CommonComponents/Button/Button';
import { useMount } from 'react-use';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
// import { URL } from '../../../config/serverUrls';
import EditIcon from '@material-ui/icons/Edit';
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import { getAllRegion, getBusinessTypes, getOmcList } from '../../../services/common.service';
import { getDistricts, getFormattedStatesList } from '../../../utils/indianStates.util';
import { addNewTransport, updateTransport } from '../../../services/transports.service';
import { useSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles((theme) => ({
    sidePanelTitle: {
        // textAlign: 'center',
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 0,
        boxShadow: '0 1px 4px -3px #333'
    },
    details: {
        padding: 6,
        borderColor: 'grey',
        minWidth: 80,
        height: 60,
        display: 'flex',
        textAlign: 'left',
        alignItems: 'left',
        justifyContent: 'left'
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
        // overflow: 'auto'
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
    readOnlyWrapper: {
        margin: '30px 4px',
        maxWidth: '100%',
    },
    text: {
        fontSize: 14
    },
    title: {
        fontSize: 12,
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

const AddNewTransportsForm = ({ title, handleBack, id, data, currentUser, callback, isAdd }) => {
    const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
    const [apiStatus, setApiStatus] = useState({});
    const [loading, setLoading] = useState(false)
    const [omcs, setOmcs] = useState([]);
    const [bussinessType, setBussinessType] = useState([]);
    const [regions, setRegions] = useState([]);
    const [checked, setChecked] = useState(false);
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar();


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClick = () => {
        setChecked(!checked);
    };
    const handleClose = () => {
        callback()
    }
    useMount(() => {
        getOmcList()
            .then(data => {
                setOmcs(data);
            })
            .catch(e => {
                console.log(e)
            })
        getBusinessTypes()
            .then(data => {
                setBussinessType(data);
            })
            .catch(e => {
                console.log(e)
            })
        getAllRegion()
            .then(data => {
                setRegions(data);
            })
            .catch(e => {
                console.log(e)
            })
    })
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // id: Yup.number().required('Please enter transporter code'),
            name: Yup.string().required('Please enter transporter name'),
            mobile: Yup.number().min(10, 'Enter valid mobile number').required('please Enter your mobile number'),
            omc: Yup.string().required('Please Choose OMC'),
            business_type: Yup.string().required('Please choose bussiness type'),
            region: Yup.string().required('Please choose region'),
            address: Yup.string().required('Please enter address'),
            state: Yup.string().required('Please choose state'),
            district: Yup.string().required('Please choose district'),
            pincode: Yup.number().min(6, 'Pincode must be 6 digits').required("Enter pincode"),
            // gst: Yup.number().min(15, 'Enter valid GST')
        }),
        onSubmit: values => {
            const data = { ...values, t_owner_id: id };
            let apiURL = isAdd === 'Add' ? `transporters` : `tranporters/${data.transporter_id}`
            if (isAdd === 'Add') {
                addNewTransport(data)
                    .then(res => {
                        enqueueSnackbar(res, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        }
                        )
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000)
                    })
                    .catch(error => {
                        enqueueSnackbar(error, {
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
                updateTransport(data.transporter_id, data)
                    .then(res => {
                        enqueueSnackbar(res, {
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
                        enqueueSnackbar(error.profile_status, {
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
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    const AntSwitch = withStyles((theme) => ({
        root: {
            width: 28,
            height: 16,
            padding: 0,
            display: 'flex',
        },
        switchBase: {
            marginBottom: 4,
            padding: 2,
            color: theme.palette.grey[500],
            '&$checked': {
                transform: 'translateX(12px)',
                color: theme.palette.common.white,
                '& + $track': {
                    opacity: 1,
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                },
            },
        },
        thumb: {
            width: 12,
            height: 12,
            boxShadow: 'none',
        },
        track: {
            border: `1px solid ${theme.palette.grey[500]}`,
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: theme.palette.common.white,
        },
        checked: {},
    }))(Switch);

    const gstAttachment = () => {
        return (
            <a style={{ display: 'inline-block', borderRadius: 2, lineHeight: 1, marginRight: 4, marginBottom: 4, padding: 4, backgroundColor: '#dedede' }}
                href={data.gst_file_url} target="_blank" title={'GST Attachment'}>{'GST Attachment'}</a>
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
                <div>{title ? title : 'Add New Transport Form'}</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    {
                        readOnly ? (
                            <Grid container spacing={2} className={classes.readOnlyWrapper}>
                                <Grid item md={6}>
                                    <Box className={classes.box} >
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Transport Code</p>
                                                <strong className={classes.text}>{values.transporter_id}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Mobile</p>
                                                <strong className={classes.text}>{values.mobile}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>OMC</p>
                                                <strong className={classes.text}>{values.omc}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Region</p>
                                                <strong className={classes.text}>{values.region}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>District</p>
                                                <strong className={classes.text}>{values.district}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>GST</p>
                                                <strong className={classes.text}>{values.gst}</strong>
                                            </div>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item md={6}>
                                    <Box className={classes.box} >
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Transport Name</p>
                                                <strong className={classes.text}>{values.name}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Address</p>
                                                <strong className={classes.text}>{values.address}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Business Type</p>
                                                <strong className={classes.text}>{values.business_type}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>State</p>
                                                <strong className={classes.text}>{values.state}</strong>
                                            </div>
                                        </Box>
                                        <Box className={classes.details}>
                                            <div>
                                                <p className={classes.title}>Pincode</p>
                                                <strong className={classes.text}>{values.pincode}</strong>
                                            </div>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                        ) : (
                            <Box>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item md={12}>
                                            {
                                                <Typography component="div">
                                                    <Grid component="label" container alignItems="center" spacing={2}>
                                                        <Grid item>Transporter Code</Grid>
                                                        <Grid item>No</Grid>
                                                        <Grid item>
                                                            <AntSwitch checked={checked} onChange={handleClick} name="checked" />
                                                        </Grid>
                                                        <Grid item>Yes</Grid>
                                                    </Grid>
                                                </Typography>
                                            }
                                            {
                                                checked &&
                                                <TextInput
                                                    {...inputProps}
                                                    // labelText="Transporter Code"
                                                    placeholder="Enter transporter code here"
                                                    name="transporter_id"
                                                    value={values.id}
                                                    readOnly={readOnly}
                                                    error={errors.id}
                                                    helperText={errors.id}
                                                >
                                                </TextInput>
                                            }
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                name="name"
                                                labelText="Transport Name"
                                                value={values.name?.toUpperCase()}
                                                readOnly={readOnly}
                                                error={errors.name}
                                                helperText={errors.name}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                name="mobile"
                                                labelText="Mobile"
                                                value={values.mobile}
                                                readOnly={readOnly}
                                                error={errors.mobile}
                                                helperText={errors.mobile}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                select
                                                name="omc"
                                                labelText="OMC"
                                                value={values.omc}
                                                readOnly={readOnly}
                                                disabled={readOnly}
                                                error={errors.omc}
                                            >
                                                <option value="">Choose OMC</option>
                                                {
                                                    omcs.map(omc => <option key={omcs.id} value={omcs.id}>{omc.name}</option>)
                                                }
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                select
                                                name="business_type"
                                                labelText="Business Type"
                                                readOnly={readOnly}
                                                value={values.business_type}
                                                disabled={readOnly}
                                                error={errors.business_type}
                                            >
                                                <option value="">Choose bussiness type</option>
                                                {
                                                    bussinessType.map(type => <option key={type.id} value={type.name}>{type.name}</option>)
                                                }
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                select
                                                name="region"
                                                labelText="Region"
                                                readOnly={readOnly}
                                                disabled={readOnly}
                                                value={values.region}
                                                error={errors.region}
                                            >
                                                <option value="">Choose region</option>
                                                {
                                                    regions.map(region => <option key={region.region} value={region.name} >{region.name}</option>)
                                                }
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                name="address"
                                                labelText="Address"
                                                value={values.address?.toUpperCase()}
                                                readOnly={readOnly}
                                                disabled={readOnly}
                                                error={errors.address}
                                                helperText={errors.address}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                select
                                                name="state"
                                                labelText="State"
                                                readOnly={readOnly}
                                                disabled={readOnly}
                                                value={values.state}
                                                error={errors.state}
                                            >
                                                <option value="">Choose state</option>
                                                {
                                                    getFormattedStatesList().map(item => <option key={item.code} value={item.value}>{item.label}</option>)
                                                }
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                select
                                                name="district"
                                                labelText="District"
                                                readOnly={readOnly}
                                                disabled={readOnly}
                                                value={values.district}
                                                error={errors.district}
                                            >
                                                <option value="">Choose District</option>
                                                {
                                                    getDistricts(values.state).map(item => <option key={item} value={item}>{item}</option>)
                                                }
                                            </TextInput>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                name="pincode"
                                                labelText="Pincode"
                                                value={values.pincode}
                                                disabled={readOnly}
                                                readOnly={readOnly}
                                                error={errors.pincode}
                                                helperText={errors.pincode}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                name="gst"
                                                labelText="GST"
                                                value={values.gst}
                                                readOnly={readOnly}
                                                disabled={readOnly}
                                                error={errors.gst}
                                                helperText={errors.gst}
                                            />
                                        </Grid>
                                        <Grid md={12} style={{ margin: '16px 8px' }}>
                                            <Typography variant="title">Documents </Typography>
                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography variant="subtitle2" component="subtitle2">
                                                PAN :{(readOnly) ?
                                                    <>
                                                        {data.pan_file_url ?
                                                            panAttachment()
                                                            : <Typography variant="subtitle2" component="subtitle2">
                                                                <Tooltip title={'Click Edit and attach'}>
                                                                    <AttachFileRoundedIcon disabled={readOnly} />
                                                                </Tooltip> Attach PAN
                                                            </Typography>}
                                                    </> :
                                                    <>
                                                        {data.pan_file_url ? panAttachment() :
                                                            <>
                                                                <TextInput
                                                                    type="file"
                                                                    accept="image/*"
                                                                    name="pan_file_url"
                                                                    readOnly={readOnly}
                                                                    disabled={readOnly}
                                                                    value={data.pan_file_url}
                                                                    onChange={(event) => {
                                                                        values[event.target.name] = event.currentTarget.files[0];
                                                                    }}
                                                                    InputLabelProps={{ shrink: true }}
                                                                ></TextInput>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item md={12} style={{ marginBottom: '8px' }}>
                                            <Typography variant="subtitle1">GST Bill </Typography>
                                        </Grid>
                                        <Grid item md={6}>
                                            <Typography variant="subtitle2" component="subtitle2">
                                                GST {(readOnly) ?
                                                    <>
                                                        {
                                                            data.gst_file_url ?
                                                                gstAttachment()
                                                                : <Typography variant="subtitle2" component="subtitle2">
                                                                    <Tooltip title={'Click Edit and attach'}>
                                                                        <AttachFileRoundedIcon disabled={readOnly} />
                                                                    </Tooltip> Attach GST
                                                                </Typography>}
                                                    </> :
                                                    <>
                                                        {data.gst_file_url ? gstAttachment() :
                                                            <>
                                                                <TextInput
                                                                    type="file"
                                                                    accept="image/*"
                                                                    name="gstS_file_url"
                                                                    value={data.aadhar_f_file_url}
                                                                    readOnly={readOnly}
                                                                    disabled={readOnly}
                                                                    onChange={(event) => {
                                                                        values[event.target.name] = event.currentTarget.files[0];
                                                                    }}
                                                                    InputLabelProps={{ shrink: true }}
                                                                ></TextInput>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box >

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
                            type="submit"
                            onClick={handleSubmit}
                            className={clsx(classes.btn, classes.editButton)}
                            startIcon={!readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />}
                            // disabled={loading}
                            onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
                        >
                            {loading ? <CircularProgress size={20} /> : readOnly ? `Edit` : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNewTransportsForm;