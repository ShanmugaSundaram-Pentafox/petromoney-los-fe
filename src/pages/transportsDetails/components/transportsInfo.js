import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { getOmcList } from '../../../services/common.service';
import apiCall from '../../../utils/api.util';
import { getDistricts, getFormattedStatesList } from '../../../utils/indianStates.util';

const TransportsInfo = ({ data, currentUser }) => {
  const [loading, setLoading] = useState();
  const [omcOptions, setOmcOptions] = useState([]);
  const [apiStatus, setApiStatus] = useState({});

  useMount(() => {
    getOmcList()
      .then(setOmcOptions)
      .catch(e => console.log(e))
  })

  const {values, handleChange: onChange, handleSubmit, setValues} = useFormik({
    initialValues: data,
    onSubmit: values => {
      setLoading(true);
      setApiStatus({});
      apiCall(
        `${URL.vehicleInfo}/${values.id}`,
        {
          method: 'post',
          body: { ...values, user_id: currentUser.id },
        })
        .then(({ status, message, data }) => {
          if(status == 'success') {
            setApiStatus({ type: 'success', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
          }
          else {
            setApiStatus({ type: 'error', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
          }
        })
        .catch(e => {
          setApiStatus({ type: 'error', message: 'Unable to save the details. Please try again later' })
          setLoading(false);
          logger(e);
        })
    }
  });

  const gridProps = {
    item: true,
    xs: 12,
  }

  const fieldProps = {
    alignTop: true,
    direction: 'column',
    onChange
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      <Grid container spacing={2}>
        <Grid {...gridProps}>
          <TextInput
            labelText="Name"
            name="name"
            defaultValue={values.name}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput
            type="number"
            labelText="Mobile"
            name="mobile"
            defaultValue={values.mobile}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps}>
          <TextInput
            multiline
            labelText="Address"
            name="address"
            defaultValue={values.address}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput
            labelText="Pincode"
            name="pincode"
            defaultValue={values.pincode === 'NULL' ? '' : values.pincode}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput
            select
            labelText="OMC"
            name="omc"
            defaultValue={values.omc}
            {...fieldProps}
          >
            <option value="">Choose OMC</option>
            {
              omcOptions.map(item => <option key={item.id} value={String(item.id)}>{item.name}</option>)
            }
          </TextInput>
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput
            labelText="PAN"
            name="pan"
            defaultValue={values.pan}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput 
            labelText="GST"
            name="gst"
            defaultValue={values.gst}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput 
            select
            labelText="State"
            name="state"
            value={values.state}
            {...fieldProps}
          >
            <option value="">Choose State</option>
            {
              getFormattedStatesList().map(item => <option key={item.code} value={item.value}>{item.label}</option>)
            }
          </TextInput>
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput 
            select
            labelText="District"
            name="district"
            value={values.district}
            {...fieldProps}
          >
            <option value="">Choose District</option>
            {
              getDistricts(values.state).map(item => <option key={item} value={item}>{item}</option>)
            }
          </TextInput>
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput 
            labelText="Region"
            name="region"
            defaultValue={values.region}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps} md={6}>
          <TextInput 
            labelText="Zone"
            name="zone"
            defaultValue={values.zone}
            {...fieldProps}
          />
        </Grid>
        <Grid {...gridProps}>
          {
            apiStatus.type && (
              <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
            )
          }
          {!loading ? (
            <Box textAlign="right">
              <Button type="submit" color="primary" variant="contained" size="medium">Save</Button>
            </Box>
          ) : <CircularProgress />
          }
        </Grid>
      </Grid>
    </form>
  );
};

export default TransportsInfo;

