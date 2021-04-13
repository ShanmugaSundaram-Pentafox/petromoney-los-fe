import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import { useMount } from 'react-use';
import { getAllRegion, getBusinessTypes, getOmcList } from '../../../services/common.service';
import { getDistricts, getFormattedStatesList } from '../../../utils/indianStates.util';
import { addNewTransport } from '../../../services/transports.service';

const AddNewTransportsForm = ({ data }) => {
    const [apiStatus, setApiStatus] = useState({});
    const [omcs, setOmcs] = useState([]);
    const [bussinessType, setBussinessType] = useState([]);
    const [regions, setRegions] = useState([]);

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
            id: Yup.number().required('Please enter transporter code'),
            name: Yup.string().required('Please enter transporter name'),
            omc: Yup.string().required('Please Choose OMC'),
            bussiness_type: Yup.string().required('Please choose bussiness type'),
            region: Yup.string().required('Please choose region'),
            address: Yup.string().required('Please enter address'),
            state: Yup.string().required('Please choose state'),
            district: Yup.string().required('Please choose district'),
            pincode: Yup.number().required("Enter pincode"),
            gst:Yup.number().min(15)
        }),
        onSubmit: formData => {
            setApiStatus({ type: 'info', message: 'Creating a new user. Please wait...' })
            const userID = data.pm_user_id;
            addNewTransport(formData, userID)
                .then(message => {
                    setApiStatus({ type: 'success', message: message })
                })
                .catch(e => {
                    setApiStatus({ type: 'error', message: e })
                    console.log(e);
                })
            //   addNewUser(formData, userType.role_name)
            //     .then(message => {
            //       setApiStatus({ type: 'success', message: 'Successfully created new user.' });
            //       callback && setTimeout(() => {
            //         callback();
            //       }, 1000)
            //     })
            // .catch(e => {
            //   setApiStatus({ type: 'error', message: e })
            //   console.log(e);
            // })
        }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item md={12}>
                        <TextInput
                            {...inputProps}
                            labelText="Transporter Code"
                            name="id"
                            value={values.id}
                            error={errors.id}
                            helperText={errors.id}
                        >
                        </TextInput>
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
                            name="bussiness_type"
                            labelText="Bussiness Type"
                            value={values.bussiness_type}
                            error={errors.bussiness_type}
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

                    <Grid item xs={12} justify="flex-end" alignItems="flex-end">
                        <Button
                            size="large"
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Create New Transport
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {/* {apiStatus.type && (
                <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
            )} */}
        </Box>
    )
}

export default AddNewTransportsForm;