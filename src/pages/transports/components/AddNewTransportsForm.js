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
import { addNewTransport } from '../../../services/transports.service';

const AddNewTransportsForm = ({ handleNext, handleBack }) => {
    const [apiStatus, setApiStatus] = useState({});
    const [omcs, setOmcs] = useState([]);
    const [bussinessType, setBussinessType] = useState([]);
    const [regions, setRegions] = useState([]);
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        setChecked(!checked);
    };

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
        initialValues: {},
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
            gst: Yup.number().min(15, 'Enter valid GST')
        }),
        onSubmit: formData => {
            addNewTransport(formData)
                .then(message => {
                    setApiStatus({ type: 'success', message: message })
                })
                .catch(e => {
                    setApiStatus({ type: 'error', message: e })
                    console.log(e);
                })
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
    return (
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
                                name="id"
                                value={values.id}
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
                            value={values.name}
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
                            value={values.business_type}
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
                            value={values.address}
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
                            error={errors.gst}
                            helperText={errors.gst}
                        />
                    </Grid>
                    <Grid item md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button
                            size="large"
                            // type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleNext}
                        >
                            Add Transport
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box >
    )
}

export default AddNewTransportsForm;