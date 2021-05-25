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
import Button from '../../../components/CommonComponents/Button/Button';
import { useMount } from 'react-use';
import { getAllRegion, getBusinessTypes, getOmcList } from '../../../services/common.service';
import { getDistricts, getFormattedStatesList } from '../../../utils/indianStates.util';
import { addNewVehicle, getAllTransport, updateVehicle } from '../../../services/transports.service';
import { useSnackbar } from 'notistack';


const AddNewVehicleForm = ({ data, id, number, trans_id }) => {
    const [apiStatus, setApiStatus] = useState({});
    const [transport, setTransport] = useState([]);
    const [bussinessType, setBussinessType] = useState([]);
    const [regions, setRegions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [checked, setChecked] = useState(false);
    const { enqueueSnackbar } = useSnackbar();


    const handleClick = () => {
        setChecked(!checked);
    };
    useMount(() => {
        getAllTransport()
            .then(data => {
                setTransport(data);
            })
            .catch(e => {
                console.log(e)
            })
    })
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {},
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport: Yup.number().required('Please Choose the transport'),
            tt_no: Yup.string().required('Please enter vehicle number'),
        }),
        onSubmit: formData => {
            if (trans_id === "") {
                updateVehicle(formData, id, trans_id)
                    .then(message => {
                        enqueueSnackbar(message, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        })

                        // setApiStatus({ type: 'success', message: message })
                    })
                    .catch(e => {
                        // setApiStatus({ type: 'error', message: e })
                        enqueueSnackbar(e, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'error',
                        })
                        // console.log(e);
                    })
            }
            else {
                addNewVehicle(formData, data.id)
                    .then(message => {
                        enqueueSnackbar(message, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        })
                        window.location.reload();

                        // setApiStatus({ type: 'success', message: message })
                    })
                    .catch(e => {
                        // setApiStatus({ type: 'error', message: e })
                        enqueueSnackbar(e, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'error',
                        })
                        // console.log(e);
                    })
            }
        }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
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
    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item md={12}>
                        {/* <TextInput
                            {...inputProps}
                            select
                            name="transport"
                            labelText="Transport"
                            value={values.transport}
                            error={errors.transport}
                        >
                            <option value="">Choose Transport</option>
                            {
                                transport.map(transport => <option key={transport.id} value={transport.id}>{transport.name}</option>)
                            }
                        </TextInput> */}
                    </Grid>
                    <Grid item md={6}>
                        {
                            number && trans_id ? (
                                <TextInput
                                    {...inputProps}
                                    name="tt_no"
                                    labelText="Vehicle Number"
                                    value={number}
                                    error={errors.tt_no}
                                    helperText={errors.tt_no}
                                    onChange={handleChange}
                                />

                            ) : (
                                <TextInput
                                    {...inputProps}
                                    name="tt_no"
                                    labelText="Vehicle Number"
                                    value={values.tt_no}
                                    error={errors.tt_no}
                                    helperText={errors.tt_no}
                                    onChange={handleChange}
                                />
                            )
                        }

                    </Grid>
                    <Grid item xs={12} justify="flex-end" alignItems="flex-end">
                        <Button
                            size="large"
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Add New Vehicle
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default AddNewVehicleForm;