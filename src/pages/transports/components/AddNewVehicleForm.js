import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from "@material-ui/styles";
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import { useMount } from 'react-use';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getAllRegion, getBusinessTypes, getOmcList } from '../../../services/common.service';
import { getDistricts, getFormattedStatesList } from '../../../utils/indianStates.util';
import { addNewVehicle, getAllTransport, updateVehicle } from '../../../services/transports.service';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';


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


const AddNewVehicleForm = ({ data, id, number, trans_id, isEdit, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Add' ? true : false);
    const { enqueueSnackbar } = useSnackbar();
    const [loading,setLoading] = useState(false)
    const classes = useStyles()
    
    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    // useMount(() => {
    //     getAllTransport()
    //         .then(data => {
    //             setTransport(data);
    //         })
    //         .catch(e => {
    //             console.log(e)
    //         })
    // })
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {
            ...number,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            tt_no: Yup.string().required('Please enter vehicle number'),
        }),
        onSubmit: formData => {
            if (isEdit === "EDIT") {
                updateVehicle(formData, id, trans_id)
                    .then(message => {
                        enqueueSnackbar(message, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        })

                        setTimeout(() => {
                            window.location.reload();
                        }, 2000)
                    })
                    .catch(e => {
                        enqueueSnackbar(e, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'error',
                        })
                    })
            }
            else {
                addNewVehicle(formData, id)
                    .then(message => {
                        enqueueSnackbar(message, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        })
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000)

                    })
                    .catch(e => {
                        enqueueSnackbar(e, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'error',
                        })
                    })
            }
        }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
    }
    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Vehicle Information</div>
                <CloseIcon onClick={callback} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    {
                                        readOnly ? (
                                            <TextInput
                                                {...inputProps}
                                                labelText="Vehicle Number"
                                                value={number}
                                                readOnly={readOnly}
                                                InputLabelProps={{ shrink: true }}

                                            />

                                        ) : (
                                            <TextInput
                                                {...inputProps}
                                                name="tt_no"
                                                labelText="Vehicle Number"
                                                value={values.tt_no}
                                                readOnly={readOnly}
                                                error={errors.tt_no}
                                                helperText={errors.tt_no}
                                                onChange={handleChange}
                                            />
                                        )
                                    }

                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </div>
            </div>
            <div className={classes.actionFooter}>
                <Divider />
                <div className={classes.actionButtonsWrapper}>
                    <div>
                        <Button
                            variant="outlined"
                            startIcon={<NavigateBeforeRoundedIcon />}
                            disabled={loading}
                            onClick={callback}
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
                            disabled={loading}
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

export default AddNewVehicleForm;