import { Drawer, Tooltip, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import CrimeInfoSideWrapper from './CrimeInfoSideWrapper';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import Button from '../../../components/CommonComponents/Button/Button';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { rulesList } from '../../../config/userRules';
import { getBusinessTypes, getRegionById, getActiveStates, getOmcList } from '../../../services/common.service';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { deleteDealershipDocument, validateId } from '../../../services/dealerships.service';
import { compareObject } from '../../../utils/compareObject.util';


const useStyles = makeStyles(theme => ({
  root: {},
  actionFooter: {
    justifyContent: 'flex-start',
    padding: 0,
    marginTop: 20,
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
  },
  icon: {
    marginRight: 4,
    marginTop: 12,
  },
  fileStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  icons: {
    marginRight: 16,
  },
  attachmentContainer: {
    display: 'flex', width: '39vw', marginLeft: 8, paddingRight: 12, flexWrap: 'wrap'
  }
}));

const DealershipInfo = ({ data, className, currentUser }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState();
  const [showUpload, setShowUpload] = useState(false);
  const [panValidateData, setPanValidateData] = useState({ icon: false })
  const [gstValidateData, setGstValidateData] = useState({ icon: false })
  const [gstDetails, setGstDetails] = useState({})
  const [omcs, setOmcs] = useState([])
  const [fileType, setFileType] = useState('');
  const [crimeData, setCrimeData] = useState();
  const businessTypes = useQuery('business-types', getBusinessTypes, { cacheTime: 300000 })
  const states = useQuery('state', getActiveStates, { cacheTime: 300000 })
  const { enqueueSnackbar } = useSnackbar();
  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit);
  const viewOnly = permissionCheck(currentUser.role_name, rulesList.dealership_view);

  const handleValidate = (action, id) => {
    if (id) {
      action === 'pan' ? setPanValidateData({ icon: true, loading: true }) : setGstValidateData({ icon: true, loading: true })
      validateId(action, id)
        .then((res) => {
          action === 'pan' ?
            setPanValidateData({ icon: true, loading: false, idType: 'PAN', details: res?.details || {}, is_verified: res?.is_verified }) :
            setGstValidateData({ icon: true, loading: false, idType: 'GST', details: res?.details || {}, is_verified: res?.is_verified })
          !values?.name && setFieldValue('name', res?.details?.tradeNam);
          setFieldValue('address', res?.details?.pradr?.adr);
        })
        .catch(e => {
          console.log(e);
          action === 'pan' ?
            setPanValidateData({ icon: true, idType: 'PAN' }) :
            setGstValidateData({ icon: true, idType: 'GST' })
        })
    } else {
      action === 'pan' ? validateField('pan') : validateField('gst')
    }
  }
  useMount(() => {
    getOmcList()
      .then((data) => {
        setOmcs(data);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  useEffect(() => {
    setValues(data)
    setGstDetails(data?.gst_verified ? JSON.parse(data?.gst_details) || {} : {})
  }, [data])
  const { values, errors, handleChange: onChange, handleSubmit, setFieldValue, setValues, validateField } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable('Please enter dealership name').required('Please enter Dealership name').matches(/^[aA-zZ.,&/-\s]+$/, 'Only alphabets are allowed for this field ').max(50),
      address: Yup.string().nullable('Please enter address').required('Please enter address'),
      state: Yup.string().nullable('Please choose state').required('Please choose state'),
      district: Yup.string().nullable('Please enter district').required('Please enter district'),
      pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
      pan: Yup.string()
        .nullable('Enter PAN')
        .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
        .required('Enter PAN')
        .uppercase(),
      gst: Yup.string().nullable('Enter GST').matches(/^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/, 'Invalid GST').required('Enter GST').uppercase(),

    }),
    onSubmit: values => {
      values.name = values.name.toUpperCase();
      values.gst = values.gst.toUpperCase();
      values.pan = values.pan.toUpperCase();
      const date_values = {
        ...values,
        name: values.name.toUpperCase(),
        gst: values.gst?.toUpperCase(),
        pan: values.pan?.toUpperCase()
      };
      let obj = {};
      if (date_values.id) {
        let commonObj = { id: data.id }
        obj = compareObject(data, date_values, commonObj)
      }
      const formData = new FormData();
      Object.keys(obj).forEach(key => {
        if (key === 'pan') {
          let pan = values?.pan ? cryptoEncrypt(values.pan) : values?.pan;
          formData.append(key, pan)
        } else {
          formData.append(key, obj[key]);
        }
      })
      setLoading(true);
      fetch(`${URL.base}${URL.dealership}/${values.id}`, {
        method: 'POST',
        body: formData,
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
            setTimeout(() => {
              window.location.reload()
            }, 1500);
            setLoading(false);
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
            setLoading(false);
            setReadOnly(true);
          }
        })
        .catch(e => {
          enqueueSnackbar(e.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          }
          )
          setLoading(false);
          setReadOnly(true);
          logger(e);
        })
    }
  });
  const getRegion = useQuery(['region', values?.state], () => getRegionById(parseInt(values?.state || 1)))

  const docUpload = (val) => {
    setShowUpload(true);
    setFileType(val);
  };
  const onCloseUploader = () => {
    setShowUpload(false);
  };
  const handleSave = (value) => {
    fileType === 'PAN'
      ? setFieldValue('pan_file_url', value[0])
      : setFieldValue('gst_file_url', value[0]);
    onCloseUploader();
  };
  const onDocDelete = (value) => {
    deleteDealershipDocument(value, data.id)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      })
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }
  const classes = useStyles();
  const gridProps = {
    item: true,
    className: classes.gridItemStyle
  }

  const fieldProps = {
    direction: 'column',
    alignTop: true,
    readOnly,
    onChange
  }

  const ValidateProps = (valid, key) => {
    return ({
      endAdornment: <div style={{ marginRight: 6, marginTop: 4, cursor: 'pointer' }}>
        {
          valid?.icon ?
            valid?.loading ? <CircularProgress size={15} /> :
              valid?.is_verified ? <Tooltip title={`Valid ${valid.idType}`} ><CheckCircleOutlineOutlinedIcon fontSize='small' style={{ color: '#4caf50' }} /></Tooltip> :
                <Tooltip title={`Invalid ${valid.idType}`} ><CancelOutlinedIcon fontSize='small' color='error' /></Tooltip> : null
        }
      </div>
    })
  }
  return (
    <Card className={clsx(classes.root, className)}>
      <div style={{ marginBottom: 20 }}>
        {
          readOnly ? (
            <>
              <Grid container spacing={2} className={classes.readOnlyWrapper}>
                <Grid md={4}>
                  <ViewData title='Name' value={values?.name} />
                  <ViewData title='Address' value={values?.address ? values.address + '' : '' + (values?.pincode ? values?.pincode : '')} />
                  <ViewData title='PAN' value={values?.pan} endIcon={<CustomToken variant={values?.pan_verified ? 'success' : 'error'} label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.pan_verified ? 'tick' : 'cross'} />} />
                  {values?.gst_verified ? <ViewData title='Effective Date of registration' value={gstDetails?.rgdt} /> : null}
                  {values?.gst_verified ? <ViewData title='Legal Trade Name' value={gstDetails?.tradeNam} /> : null}
                </Grid>
                <Grid md={4}>
                  <ViewData title='State' value={(states?.data?.find(function (state, index) {
                    if (state.id == values?.state)
                      return true;
                  }))?.name} />
                  <ViewData title='Region' value={values?.region_name} />
                  <ViewData title='GST' value={values?.gst} endIcon={<CustomToken variant={values?.gst_verified ? 'success' : 'error'} label={values?.gst_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.gst_verified ? 'tick' : 'cross'} />} />
                  {values?.gst_verified ? <ViewData title='Taxpayer Type' value={gstDetails?.dty} /> : null}
                </Grid>
                <Grid md={4}>
                  <ViewData title='Business type' value={businessTypes.data?.find(function (type, index) {
                    if (type.id == values?.business_type)
                      return true;
                  })?.name} />
                  <ViewData title='OMC' value={omcs?.find(item => { return item?.id === values?.omc })?.name} />
                  {values?.gst_verified ? <ViewData title='Legal Business Name' value={gstDetails?.lgnm} /> : null}
                  {values?.gst_verified ? <ViewData title='GSTIN Status' value={gstDetails?.sts} /> : null}
                </Grid>
              </Grid>
              {
                values?.pan_file_url ||
                  values?.gst_file_url ? (
                    <div className={classes.readOnlyWrapper}>
                      <Typography variant='h4'>Attachments</Typography>
                      <div style={{ marginTop: 16, display: 'flex', width: '39vw' }}>
                        {values.pan_file_url && <DocAttachment tooltip='View PAN' imgUrl={values?.pan_file_url} docName='PAN Card' style={{ marginRight: 10 }} />}
                        {values.gst_file_url && <DocAttachment tooltip='View GST' imgUrl={values?.gst_file_url} docName='GST' style={{ marginRight: 10 }} />}
                      </div>
                    </div>
                  ) : (
                    <div className={classes.readOnlyWrapper}>
                      <Typography variant='h4'>Attachments</Typography>
                      <div
                        style={{
                          marginTop: '20px',
                        }}
                      >
                        <Typography variant='h7'>No Attachments Found</Typography>
                      </div>
                    </div>
                  )}
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid {...gridProps} md={12}>
                  <TextInput
                    labelText="Name"
                    name="name"
                    readOnly={readOnly}
                    value={values?.name?.toUpperCase()}
                    error={errors.name}
                    helperText={errors.name}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    labelText="GST"
                    name="gst"
                    readOnly={readOnly}
                    disabled={gstValidateData?.loading || values?.gst_verified}
                    value={values?.gst?.toUpperCase()}
                    error={errors.gst}
                    helperText={errors.gst}
                    InputProps={ValidateProps(gstValidateData, values?.gst_verified)}
                    {...fieldProps}
                  />
                  {
                    !values?.gst_verified || values?.gst !== data?.gst ?
                      <Typography variant="caption" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleValidate('gst', values?.gst)}>Validate GST</Typography> : null
                  }
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    labelText="PAN"
                    name="pan"
                    readOnly={readOnly}
                    disabled={panValidateData?.loading || values?.pan_verified}
                    value={values?.pan?.toUpperCase()}
                    error={errors.pan}
                    helperText={errors.pan}
                    InputProps={ValidateProps(panValidateData, values?.pan_verified)}
                    {...fieldProps}
                  />
                  {
                    !values?.pan_verified || values?.pan !== data?.pan ?
                      <Typography variant="caption" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleValidate('pan', values?.pan)}>Validate PAN</Typography> : null
                  }
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    multiline
                    labelText="Address"
                    name="address"
                    readOnly={readOnly}
                    disabled={readOnly}
                    value={values?.address}
                    error={errors.address}
                    helperText={errors.address}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    select
                    labelText="Business Type"
                    name="business_type"
                    readOnly={readOnly}
                    disabled={readOnly}
                    defaultValue={values?.business_type}
                    error={errors.business_type}
                    helperText={errors.business_typeF}
                    {...fieldProps}
                  >
                    {
                      businessTypes.data?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid {...gridProps} sm={6} md={6}>
                  <TextInput
                    select
                    labelText="State"
                    name="state"
                    readOnly={readOnly}
                    disabled={readOnly}
                    value={values?.state}
                    error={errors.state}
                    helperText={errors.state}
                    {...fieldProps}
                  >
                    {
                      states.data?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={6}>
                  {
                    <TextInput
                      select
                      labelText="Region"
                      name="region"
                      value={values?.region}
                      readOnly={readOnly}
                      disabled={readOnly}
                      error={errors.region}
                      helperText={errors.region}
                      {...fieldProps}
                    >
                      {
                        getRegion?.data?.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))
                      }
                    </TextInput>
                  }

                </Grid>
                <Grid {...gridProps} xs={6}>
                  <TextInput
                    name="district"
                    labelText="District"
                    labelWidth={40}
                    value={values?.district}
                    readOnly={readOnly}
                    disabled={readOnly}
                    error={errors.district}
                    helperText={errors.district}
                    // select
                    alignTop
                    direction="column"
                    {...fieldProps}
                  >

                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    number
                    labelText="Pincode"
                    name="pincode"
                    readOnly={readOnly}
                    value={values?.pincode}
                    error={errors.pincode}
                    helperText={errors.pincode}
                    {...fieldProps}
                  />
                </Grid>
                {
                  gstDetails?.gstin || gstValidateData?.details ?
                    <>
                      <Grid item md={3}>
                        <ViewData title='Effective Date of registration' value={gstDetails?.rgdt || gstValidateData?.details?.rgdt} />
                      </Grid>
                      <Grid item md={3}>
                        <ViewData title='Taxpayer Type' value={gstDetails?.dty || gstValidateData?.details?.dty} />
                      </Grid>
                      <Grid item md={3}>
                        <ViewData title='Legal Business Name' value={gstDetails?.lgnm || gstValidateData?.details?.lgnm} />
                      </Grid>
                      <Grid item md={3}>
                        <ViewData title='GSTIN Status' value={gstDetails?.sts || gstValidateData?.details?.sts} />
                      </Grid>
                      <Grid item md={3}>
                        <ViewData title='Legal Trade Name' value={gstDetails?.tradeNam || gstValidateData?.details?.tradeNam} />
                      </Grid>
                    </> : null
                }
                <Grid {...gridProps} md={12} >
                  <Typography variant="title"><strong>Attachments</strong></Typography>
                </Grid>
                <div className={classes.attachmentContainer}>
                  <DocAttachment action={true} imgUrl={values?.pan_file_url} docName='PAN Card' onUpload={() => docUpload('PAN')} onDelete={() => onDocDelete({ pan_file_url: '' })} disabled={!values?.pan_file_url} style={{ marginRight: 15 }} />
                  <DocAttachment action={true} imgUrl={values?.gst_file_url} docName='GST' onUpload={() => docUpload('GST')} onDelete={() => onDocDelete({ gst_file_url: '' })} disabled={!values?.gst_file_url} style={{ marginRight: 15 }} />
                </div>
              </Grid>
            </>
          )
        }
        {/* <Divider /> */}

        {showUpload && (
          <FileUpload
            handleSave={(value) => handleSave(value)}
            id={values.id}
            title='Upload Dealership Documents'
            open={showUpload}
            onCloseUploader={onCloseUploader}
          />
        )}
        <CardActions className={classes.actionFooter}>
          {!readOnly ? (
            !loading ? (
              <>
                <Button variant="contained" size="small" onClick={() => { setReadOnly(true); }}>Cancel</Button>
                <Button type="submit" color="primary" onClick={handleSubmit} variant="contained" size="small">Save</Button>
              </>
            ) : <CircularProgress size={20} />
          ) : (
            !viewOnly &&
            (
              <>
                <Button
                  disabled={!editable}
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => { setReadOnly(false); }}>Edit Details</Button>
                <Button
                  disabled={!editable}
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => setCrimeData({ ...crimeData, userType: 'dealership', id: data?.id, first_name: data?.name })}>Crime check</Button>
              </>
            )
          )}
        </CardActions>
        <Drawer
          anchor="right"
          open={crimeData}
          variant="temporary"
        >
          <div className={classes.sidePanelWrapper}>
            {
              <CrimeInfoSideWrapper dealershipId={data?.id} data={crimeData} currentUser={currentUser} onClose={() => setCrimeData()} />
            }
          </div>
        </Drawer>
      </div>
    </Card >
  );
};

export default DealershipInfo;
