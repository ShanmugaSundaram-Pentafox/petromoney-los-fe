import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { useFormik } from 'formik';
import { API } from '../../../config/api';
import { URL } from '../../../config/serverUrls';
import { logger } from '../../../config/logger';
import CircularProgress from '@material-ui/core/CircularProgress';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';



const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-end'
  }
}));

const TransportsInfo = ({ data, className, currentUser, toggleCreditReport }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState();
  const [apiStatus, setApiStatus] = useState({});
  const {values, handleChange: onChange, handleSubmit} = useFormik({
    initialValues: data,
    onSubmit: values => {
      console.log('Form Values >> ', values);
      setLoading(true);
      setApiStatus({});
      API.post(`${URL.dealership}/${values.id}`, { ...values, user_id: currentUser.id })
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
          setReadOnly(true);
          logger(e);
        })
    }
  });
//   // const [values, setValues] = useState(data);
  const classes = useStyles();
  const gridProps = {
    item: true,
    xs: 12,
    className: classes.gridItemStyle
  }

//   // const handleChange = event => {
//   //   setValues({
//   //     ...values,
//   //     [event.target.name]: event.target.value
//   //   });
//   // };

  const fieldProps = {
    readOnly,
    onChange
  }

  return (
    <Card className={clsx(classes.root, className)}>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <CardContent>
          <Grid container>
            <Grid {...gridProps}>
              <TextInput
                labelText="Name"
                name="name"
                defaultValue={values.name}
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
            <Grid {...gridProps}>
              <TextInput
                multiline
                labelText="Mobile"
                name="mobile"
                defaultValue={values.mobile}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                multiline
                labelText="OMC"
                name="omc"
                defaultValue={values.omc}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                labelText="Pincode"
                name="pincode"
                defaultValue={values.pincode === 'NULL' ? '' : values.pincode}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                labelText="PAN"
                name="pan"
                defaultValue={values.pan}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput 
                labelText="GST"
                name="gst"
                defaultValue={values.gst}
                {...fieldProps}
                />
            </Grid>
            <Divider />
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="District"
                labelWidth={40}
                defaultValue={values.district}
                readOnly
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="State"
                labelWidth={40}
                defaultValue={values.state}
                readOnly
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="Region"
                labelWidth={40}
                defaultValue={values.region}
                readOnly
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="Zone"
                labelWidth={40}
                defaultValue={values.zone}
                readOnly
                />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        {
          apiStatus.type && (
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          )
        }
        <CardActions className={classes.actionFooter}>
            
          {!readOnly ? (
              !loading ? (
                <>
                  <Button variant="contained" size="small" onClick={() => { setReadOnly(true); }}>Cancel</Button>
                  <Button type="submit" color="primary" variant="contained" size="small">Save</Button>
                </>
                ) : <CircularProgress />
            ) : (
              <Button
                disabled={!permissionCheck(currentUser.role_name, rulesList.dealership_edit)}
                color="primary"
                variant="contained"
                size="small"
                onClick={() => { setReadOnly(false); }}>Edit Details</Button>
            )}
        </CardActions>
      </form>
    </Card>

  );
};

export default TransportsInfo;

