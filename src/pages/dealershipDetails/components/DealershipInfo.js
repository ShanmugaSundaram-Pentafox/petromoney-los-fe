import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextInput from '../../../components/TextInput/TextInput';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { URL } from '../../../config/serverUrls';
import { logger } from '../../../config/logger';
import CircularProgress from '@material-ui/core/CircularProgress';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
// import apiCall from '../../../utils/api.util';
import Button from '../../../components/CommonComponents/Button/Button';
import { encrypt } from '../../../services/crypto.service';
import { getBusinessTypes, getRegionById, getStates, getActiveStates } from '../../../services/common.service';
import { useSnackbar } from 'notistack';
// import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-end'
  }
}));


const DealershipInfo = ({ data, className, currentUser, toggleCreditReport }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState();
  const [apiStatus, setApiStatus] = useState({});
  const [businessTypes, setBusinessTypes] = useState([{}, {}, {}, {}, {}]);
  const [states, setStates] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { values, handleChange: onChange, handleSubmit } = useFormik({
    initialValues: data,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      // id: Yup.number().required('Please enter transporter code'),
      name: Yup.string().required('Please enter transporter name'),
      mobile: Yup.number()
        .min(10, 'Enter valid mobile number')
        .required('please Enter your mobile number'),
      // region: Yup.string().required('Please choose region'),
      address: Yup.string().required('Please enter address'),
      state: Yup.string().required('Please choose state'),
      district: Yup.string().required('Please choose district'),
      pincode: Yup.number()
        .min(6, 'Pincode must be 6 digits')
        .required('Enter pincode'),
      pan: Yup.string()
        .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
        .required('Enter PAN')
        .uppercase(),
      gst: Yup.number().min(15, 'Enter valid GST'),
    }),
    onSubmit: values => {
      const data = new FormData();
      Object.keys(values).forEach(key => {
        data.append(key, values[key]);
      })
      // console.log('Form Values >> ', values.id);
      // let pan = values?.pan ? encrypt(values.pan) : values?.pan;
      // let gst = values?.gst ? encrypt(values.gst) : values?.gst;
      setLoading(true);
      // setApiStatus({});
      fetch(`${URL.base}${URL.dealership}/${values.id}`, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${currentUser.token} `
        }
      })
        .then(res => {
          return res.json()
        })
        .then(({ status, message, data }) => {
          if (status == 'SUCCESS') {
            enqueueSnackbar(message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
            // setApiStatus({ type: 'success', message: message || 'Details updated successfully' })
            setLoading(false);
            setReadOnly(true);
          }
          else {
            enqueueSnackbar(message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            }
            )
            // setApiStatus({ type: 'error', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
            setReadOnly(true);

          }
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          }
          )
          // setApiStatus({ type: 'error', message: 'Unable to save the details. Please try again later' })
          setLoading(false);
          setReadOnly(true);
          logger(e);
        })
    }
  });
  useMount(() => {
    getBusinessTypes()
      .then(setBusinessTypes)
      .catch(err => {
        console.log('BusinessTypes fetch error - ', err)
      })
    getActiveStates()
      .then(d => {
        setStates([{ id: '', name: 'Choose State' }, ...d])
        return d;
      })
      .then(d => {
        let res = d.find(({ id }) => id === parseInt(values.state));

        if (res) {
          fetchRegions(parseInt(res.id));
        }
      })
      .catch(err => {
        console.log('BusinessTypes fetch error - ', err)
      })

  });
  useEffect(() => {
    // console.log(values)
    if (values.state) {
      // let res = states.find(({ name }) => name === values.state);
      fetchRegions(parseInt(values.state));
    }
  }, [values.state])

  const fetchRegions = (res) => {
    getRegionById(res)
      .then(res => {
        setRegionList(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const classes = useStyles();
  const gridProps = {
    item: true,
    xs: 12,
    sm: 6,
    className: classes.gridItemStyle
  }


  const fieldProps = {
    direction: "column",
    alignTop: true,
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
        <Paper>
          <Grid container spacing={2}>
            <Grid {...gridProps} sm={12}>
              <TextInput
                labelText="Name"
                name="name"
                error={values.name}
                readOnly={readOnly}
                value={values.name?.toUpperCase()}
                {...fieldProps}
              />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                multiline
                labelText="Address"
                name="address"
                error={values.address}
                value={values.address?.toUpperCase()}
                {...fieldProps}
              />
            </Grid>
            <Grid {...gridProps} sm={6}>
              <TextInput
                select
                labelText="Business Type"
                name="business_type"
                error={values.address}
                disabled={readOnly}
                defaultValue={businessTypes[values.business_type - 1]?.name}
                {...fieldProps}
              >
                <option value="">{businessTypes[values.business_type]?.name}</option>
                {
                  businessTypes?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                }
              </TextInput>
            </Grid>

            <Grid {...gridProps}>
              <TextInput
                labelText="GST"
                name="gst"
                readOnly={readOnly}
                // disabled={readOnly}
                defaultValue={values.gst}
                {...fieldProps}
              />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                labelText="PAN"
                name="pan"
                readOnly={readOnly}
                // disabled={readOnly}
                defaultValue={values.pan}
                {...fieldProps}
              />
            </Grid>
            <Divider />
            <Grid {...gridProps} sm={6}>
              <TextInput
                select
                labelText="State"
                name="state"
                readOnly={readOnly}
                disabled={readOnly}
                value={values.state}
                {...fieldProps}
              >
                {
                  states.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                }
              </TextInput>
            </Grid>
            <Grid {...gridProps} xs={6}>
              {

                <TextInput
                  select
                  labelText="Region"
                  name="region"
                  value={values.region}
                  readOnly={readOnly}
                  disabled={readOnly}
                  {...fieldProps}
                >
                  {
                    regionList?.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))
                  }
                </TextInput>
              }

            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput
                name="district"
                labelText="District"
                labelWidth={40}
                value={values.district}
                readOnly={readOnly}
                disabled={readOnly}
                // select
                alignTop
                direction="column"
                {...fieldProps}
              >
                {/* {
                  getDistricts().map(item => <option key={item} value={item}>{item}</option>)
                } */}
              </TextInput>
            </Grid>

            <Grid {...gridProps}>
              <TextInput
                labelText="Pincode"
                name="pincode"
                readOnly={readOnly}
                defaultValue={values.pincode}
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </Paper>
        <Divider />
        {/* {
          apiStatus.type && (
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          )
        } */}
        <CardActions className={classes.actionFooter}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={toggleCreditReport}
          >
            View/Edit Financial Report
          </Button>
          {!readOnly ? (
            !loading ? (
              <>
                <Button variant="contained" size="small" onClick={() => { setReadOnly(true); }}>Cancel</Button>
                <Button type="submit" color="primary" variant="contained" size="small">Save</Button>
              </>
            ) : <CircularProgress size={20} />
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

export default DealershipInfo;
