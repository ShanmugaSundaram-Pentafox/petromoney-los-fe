import DateFnsUtils from '@date-io/date-fns';
import { Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import Button from '../../../components/CommonComponents/Button/Button';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import {
  ViewData,
} from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { URL } from '../../../config/serverUrls';
import { rulesList } from '../../../config/userRules';
import {
  getBusinessTypes,
  getOmcList,
  getRegionById,
  getStates,
} from '../../../services/common.service';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { validateId } from '../../../services/dealerships.service';
import { deleteTransportProfileDoc } from '../../../services/transports.service';
import { compareObject } from '../../../utils/compareObject.util';
import { getDistricts } from '../../../utils/indianStates.util';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  details: {
    padding: 6,
    borderColor: 'grey',
    minWidth: 80,
    height: 50,
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'left',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflowY: 'auto',
  },
  title: {
    marginBottom: 4,
    fontSize: 11,
  },
  fileAttachement: {
    display: 'flex',
    // justifyContent:'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 4,
    marginTop: 12,
  },
  typography: {
    marginTop: 14,
  },
  sidePanelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
    padding: '14px',
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
  },
  text: {
    fontSize: 12,
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  fileStyle: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  profileLink: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
    marginRight: 4,
    marginBottom: 4,
    padding: 4,
    backgroundColor: '#dedede',
    color: '#43a047',
  },
  attachmentContainer: {
    display: 'flex', width: '39vw', paddingRight: 12, flexWrap: 'wrap', marginLeft: 8
  }
}));

const AddNewTransportsForm = ({
  title,
  // handleBack,
  id,
  data,
  currentUser,
  callback,
  isAdd,
}) => {
  const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
  const [loading, setLoading] = useState(false);
  const [omcs, setOmcs] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [states, setStates] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [regionList, setRegionList] = useState([]);
  const [fileType, setFileType] = useState('');
  const [gstDetails, setGstDetails] = useState({})
  const [checked, setChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(data?.doi && parse(data?.doi, 'dd-MM-yyyy', new Date()));
  const [panValidateData, setPanValidateData] = useState({icon: false})
  const [gstValidateData, setGstValidateData] = useState({icon: false})
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setGstDetails(data?.gst_verified ? JSON.parse(data?.gst_details) || {} : {})
  },[])
  const handleEdit = () => {
    setReadOnly(!readOnly);
  };
  const handleClick = () => {
    setChecked(!checked);
  };
  const handleClose = () => {
    callback();
  };
  const handleDateChange = (e) => {
    setSelectedDate(e);
  };
  const handleValidate = (action, id) => {
    action === 'pan' ? setPanValidateData({icon:true, loading: true}) : setGstValidateData({icon:true, loading: true})
    validateId(action, id)
      .then((res) => {
        action === 'pan' ?
          setPanValidateData({icon: true, loading: false, idType: 'PAN', details: res?.details || {}}) :
          setGstValidateData({icon: true, loading: false, idType: 'GST', details: res?.details || {}})
        !values?.name && setFieldValue('name', res?.details?.tradeNam)
        setFieldValue('address', res?.details?.pradr?.adr)
        !values?.business_type && setFieldValue('business_type', res?.details?.ctb)
      })
      .catch(e => {
        console.log(e);
        action === 'pan' ?
          setPanValidateData({icon: true, idType: 'PAN'}) :
          setGstValidateData({icon: true, idType: 'GST'})
      })
  }

  const onDocDelete = (data) => {
    deleteTransportProfileDoc(data, values.transporter_id)
      .then(res => {
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
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

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    setFieldValue,
  } = useFormik({
    initialValues: {
      ...data,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      // id: Yup.number().required('Please enter transporter code'),
      name: Yup.string().required('Please enter transporter name').nullable('Enter transporter name').matches(/^[aA-zZ.,&/-\s]+$/, 'Only alphabets are allowed for this field '),
      mobile: Yup.number()
        .nullable('Enter your mobile number')
        .min(10, 'Enter valid mobile number')
        .required('please Enter your mobile number'),
      omc: Yup.string().required('Please Choose OMC').nullable('Choose OMC'),
      business_type: Yup.string().required('Please choose bussiness type').nullable('Choose business type'),
      region: Yup.string().required('Please choose region').nullable('Choose region'),
      address: Yup.string().required('Please enter address').nullable('Enter address'),
      state: Yup.string().required('Please choose state').nullable('Choose state'),
      district: Yup.string().required('Please enter district').nullable('Enter district'),
      pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
      pan: Yup.string()
        .nullable('Enter PAN')
        .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
        .required('Enter PAN')
        .uppercase(),
      gst: Yup.string().nullable('Enter GST').matches(/^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/, 'Invalid GST').required('Enter GST').uppercase(),
    }),
    onSubmit: (values) => {
      if(isAdd === 'Add'){
        handleValidate('pan', values?.pan)
        handleValidate('gst', values?.gst)
      }
      setLoading(true);
      values.name = values.name.toUpperCase();
      const doi = selectedDate ? format(selectedDate, 'dd-MM-yyyy') : values?.doi
      const data_values = { ...values, doi: doi, t_owner_id: id, pan: values.pan?.toUpperCase(), gst: values.gst?.toUpperCase(), omc: omcs.find(item => {return item.name === values.omc})?.id };

      let obj = {};
      if (values.transporter_id) {
        obj = compareObject(data, data_values)
      }
      else {
        obj = { ...data_values }
      }

      const formData = new FormData();
      Object.keys(obj).forEach((key) => {
        if (key === 'pan') {
          let pan = values?.pan ? cryptoEncrypt(values.pan) : values?.pan;
          formData.append(key, pan)
        }
        else
          formData.append(key, obj[key]);
      });
      if (isAdd === 'Add') {
        fetch(`${URL.base}${URL.vehicleInfo}`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        })
          .then((res) => {
            return res.json();
          })

          .then((res) => {
            setLoading(false);
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((error) => {
            setLoading(false);
            enqueueSnackbar(error.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          });
      } else {
        fetch(`${URL.base}${URL.vehicleInfo}/${data.transporter_id}`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
            enqueueSnackbar(error.profile_status, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          });
      }
    },
  });
  useMount(() => {
    getOmcList()
      .then((data) => {
        setOmcs(data);
      })
      .catch((e) => {
        console.log(e);
      });
    getBusinessTypes()
      .then((data) => {
        setBusinessType(data);
      })
      .catch((e) => {
        console.log(e);
      });
    getStates()
      .then((d) => {
        setStates([{ id: '', name: 'Choose State' }, ...d]);
        return d;
      })
      .then(d => {
        let res = d.find(({ id }) => id === parseInt(values?.state));
        fetchRegions(parseInt(res.id));
      })
      .catch((e) => {
        console.log(e);
      });

  });

  useEffect(() => {
    if (values.state) {
      fetchRegions(parseInt(values.state));
    }
  }, [values.state]);
  const onCloseUploader = () => {
    setShowUpload(false);
  };
  const handleSave = (value) => {
    fileType === 'PAN'
      ? setFieldValue('pan_file_url', value[0])
      : setFieldValue('gst_file_url', value[0]);
    onCloseUploader();
  };
  const docUpload = (val) => {
    setShowUpload(true);
    setFileType(val);
  };
  const fetchRegions = (res) => {
    getRegionById(res)
      .then((res) => {
        setRegionList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  };
  const ValidateProps = (valid) => {
    return({
      endAdornment: <div style={{marginRight: 6, marginTop: 4, cursor: 'pointer'}}>
        {
        valid?.icon ?
        valid?.loading ? <CircularProgress size={15}/> :
        valid?.details ? <Tooltip title={`Valid ${valid.idType}`} ><CheckCircleOutlineOutlinedIcon fontSize='small' style={{color:'#4caf50'}} /></Tooltip> :
        <Tooltip title={`Invalid ${valid.idType}`} ><CancelOutlinedIcon fontSize='small' color='error' /></Tooltip> : null
        }
      </div>
    })
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
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>{title ? title : 'Add New Transport Form'}</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {readOnly ? (
            <>
              <Grid container spacing={2} className={classes.readOnlyWrapper}>
                <Grid item md={6}>
                  <Box className={classes.box}>
                    <ViewData
                      title='Transport Code'
                      value={values.transporter_id}
                    />
                    <ViewData title='Mobile' value={values.mobile} />
                    <ViewData title='OMC' value={values?.omc_value || omcs.find(item => {return item.name === values.omc})?.name} />
                    <ViewData title='Date of Incoporation' value={values?.doi} />
                    <ViewData title='Region' value={(regionList.find(function (region) {
                      if (region.id == values.region)
                        return true;
                    }))?.name} />
                    <ViewData title='District' value={values.district} />
                    <ViewData title='GST' value={values.gst} endIcon={<CustomToken variant={values?.gst_verified ? 'success': 'error'} label={values?.gst_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.gst_verified ? 'tick' : 'cross'}/>} />
                    {values?.gst_verified ? <ViewData title='Legal Trade Name' value={gstDetails?.tradeNam} /> : null}
                    {values?.gst_verified ? <ViewData title='GSTIN Status' value={gstDetails?.sts} /> : null}

                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Box className={classes.box}>
                    <ViewData title='Transport Name' value={values.name} />
                    <ViewData title='Address' value={values.address} />
                    <ViewData title='Business Type' value={businessType.find(item => {return item.name === values?.business_type})?.name} />
                    <ViewData title='State' value={(states.find(function (state) {
                      if (state.id == values.state)
                        return true;
                    }))?.name} />
                    <ViewData title='Pincode' value={values.pincode} />
                    <ViewData title='PAN' value={values.pan} endIcon={<CustomToken variant={values?.pan_verified ? 'success': 'error'} label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.pan_verified ? 'tick' : 'cross'}/>} />
                    {values?.gst_verified ? <ViewData title='Legal Business Name' value={gstDetails?.mbr} /> : null}
                    {values?.gst_verified ? <ViewData title='Effective Date of registration' value={gstDetails?.rgdt}/> : null}
                    {values?.gst_verified ? <ViewData title='Taxpayer Type' value={gstDetails?.dty} /> : null}

                  </Box>
                </Grid>
              </Grid>
              <Divider />
              {values?.gst_file_url ||
                values?.pan_file_url ? (
                  <div className={classes.readOnlyWrapper}>
                    <Typography variant='h4'>Attachments</Typography>
                    <div style={{ display: 'flex', marginTop: 16 }}>
                      {values.pan_file_url && <DocAttachment tooltip='View PAN' imgUrl={values?.pan_file_url} docName='PAN' style={{marginRight: 20}} />}
                      {values.gst_file_url && <DocAttachment tooltip='View GST' imgUrl={values?.gst_file_url} docName='GST' style={{marginRight: 20}} />}
                    </div>
                  </div>
                ) : (
                  <div className={classes.readOnlyWrapper}>
                    <Typography variant='h4'>Attachments</Typography>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                      }}
                    >
                      <Typography variant='h7'>No Attachments Found</Typography>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <Box>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    {
                      <Typography component='div'>
                        <Grid
                          component='label'
                          container
                          alignItems='center'
                          spacing={2}
                        >
                          <Grid item>Transporter Code</Grid>
                          <Grid item>No</Grid>
                          <Grid item>
                            <AntSwitch
                              checked={checked}
                              onChange={handleClick}
                              name='checked'
                            />
                          </Grid>
                          <Grid item>Yes</Grid>
                        </Grid>
                      </Typography>
                    }
                    {checked && (
                      <TextInput
                        {...inputProps}
                        // labelText="Transporter Code"
                        placeholder='Enter transporter code here'
                        name='transporter_id'
                        value={values.id}
                        readOnly={readOnly}
                        error={errors.id}
                        helperText={errors.id}
                      ></TextInput>
                    )}
                  </Grid>
                  <Grid item md={12}>
                    <TextInput
                      {...inputProps}
                      name='name'
                      labelText='Transport Name'
                      value={values.name?.toUpperCase()}
                      readOnly={readOnly}
                      error={errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      name='gst'
                      labelText='GST'
                      value={values.gst?.toUpperCase()}
                      readOnly={readOnly || gstValidateData?.loading}
                      disabled={readOnly || values?.gst_verified}
                      error={errors.gst}
                      helperText={errors.gst}
                      InputProps={ValidateProps(gstValidateData)}
                    />
                    {
                      !values?.gst_verified || values?.gst !== data?.gst?
                        <Typography variant="caption" style={{color: 'blue', cursor: 'pointer'}} onClick={()=> values?.gst && handleValidate('gst', values?.gst)}>Validate GST</Typography> : null
                    }
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      name='pan'
                      labelText='PAN'
                      value={values.pan?.toUpperCase()}
                      readOnly={readOnly}
                      disabled={readOnly || panValidateData?.loading || values?.pan_verified}
                      error={errors.pan}
                      helperText={errors.pan}
                      InputProps={ValidateProps(panValidateData)}
                    />
                    {
                      !values?.pan_verified || values?.pan !== data?.pan ?
                        <Typography variant="caption" style={{color: 'blue', cursor: 'pointer'}} onClick={()=> values?.pan && handleValidate('pan', values?.pan)}>Validate PAN</Typography> : null
                    }
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      name='mobile'
                      labelText='Mobile'
                      value={values?.mobile}
                      readOnly={readOnly}
                      error={errors.mobile}
                      helperText={errors.mobile}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      name='address'
                      labelText='Address'
                      multiline
                      value={values?.address}
                      readOnly={readOnly}
                      disabled={readOnly}
                      error={errors.address}
                      helperText={errors.address}
                    />
                  </Grid>
                  <Grid item md={6}>
                    {
                      <TextInput
                        {...inputProps}
                        select
                        labelText="OMC"
                        name="omc"
                        value={values?.omc || omcs.find(item => {return item.name === values.omc})?.name}
                        readOnly={readOnly}
                        disabled={readOnly}
                        error={errors.omc}
                        helperText={errors.omc}
                      >
                        <option value="">Choose OMC</option>
                        {
                          omcs?.map((item, i) => (<option key={i} value={item.name}>{item.name}</option>))
                        }
                      </TextInput>
                    }
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      select
                      name='business_type'
                      labelText='Business Type'
                      readOnly={readOnly}
                      value={values?.business_type}
                      disabled={readOnly}
                      error={errors.business_type}
                    >
                      <option value="">Choose Business Type</option>
                      {businessType.map((type) => (<option key={type.id} value={type.name}>{type.name}</option>))}
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <label>Date of Incoporation</label>
                      <KeyboardDatePicker
                        variant='inline'
                        inputVariant='outlined'
                        format='dd-MM-yyyy'
                        fullWidth
                        disableFuture={true}
                        animateYearScrolling={true}
                        invalidDateMessage='Invalid Date Format'
                        error={errors.dob}
                        helperText={errors.dob}
                        readOnly={readOnly}
                        disabled={readOnly}
                        margin='normal'
                        id='date-picker'
                        autoOk={true}
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }}
                        keyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        PopoverProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                          },
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      select
                      name='state'
                      labelText='State'
                      readOnly={readOnly}
                      disabled={readOnly}
                      value={values?.state}
                      error={errors.state}
                    >
                      {states.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))}
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      select
                      name='region'
                      labelText='Region'
                      readOnly={readOnly}
                      disabled={readOnly}
                      value={values?.region}
                      error={errors.region}
                    >
                      {regionList.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))}
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      number
                      {...inputProps}
                      name='pincode'
                      labelText='Pincode'
                      value={values?.pincode}
                      disabled={readOnly}
                      readOnly={readOnly}
                      error={errors.pincode}
                      helperText={errors.pincode}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      // select
                      name='district'
                      labelText='District'
                      readOnly={readOnly}
                      disabled={readOnly}
                      value={values.district}
                      error={errors.district}
                    >
                      {getDistricts(values.state).map((item) => (<option key={item} value={item}>{item}</option>))}
                    </TextInput>
                  </Grid>
                  {
                    gstDetails?.gstin || gstValidateData?.details ?
                      <>
                        <Grid item md={3}>
                          <ViewData title='Effective Date of registration' value={gstDetails?.rgdt || gstValidateData?.details?.rgdt}/>
                        </Grid>
                        <Grid item md={3}>
                          <ViewData title='Taxpayer Type' value={gstDetails?.dty || gstValidateData?.details?.dty} />
                        </Grid>
                        <Grid item md={3}>
                          <ViewData title='Legal Business Name' value={gstDetails?.mbr || gstValidateData?.details?.mbr} />
                        </Grid>
                        <Grid item md={3}>
                          <ViewData title='GSTIN Status' value={gstDetails?.sts || gstValidateData?.details?.sts} />
                        </Grid>
                        <Grid item md={3}>
                          <ViewData title='Legal Trade Name' value={gstDetails?.tradeNam || gstValidateData?.details?.tradeNam} />
                        </Grid>
                      </> : null
                  }
                  <Grid md={12} item>
                    <Typography variant='subtitle1' component='subtitle1'>
                      Attachments
                    </Typography>
                  </Grid>
                  <div className={classes.attachmentContainer}>
                    <DocAttachment action={true} imgUrl={values?.pan_file_url} docName='PAN Card' onUpload={() => docUpload('PAN')} onDelete={() => onDocDelete({pan_file_url:''})} disabled={!values?.pan_file_url} style={{marginRight: 25}} />
                    <DocAttachment action={true} imgUrl={values?.gst_file_url} docName='GST' onUpload={() => docUpload('GST')} onDelete={() => onDocDelete({gst_file_url:''})} disabled={!values?.gst_file_url} style={{marginRight: 25}} />
                  </div>
                </Grid>
              </form>
            </Box>
          )}
        </div>

        {showUpload && (
          <FileUpload
            handleSave={(value) => handleSave(value)}
            id={id}
            title='Upload Transport Documents'
            open={showUpload}
            onCloseUploader={onCloseUploader}
          />
        )}
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant='outlined'
              startIcon={<NavigateBeforeRoundedIcon />}
              // disabled={loading}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          {!readOnly ? (
            !loading ? (
              <>
                <Button
                  variant='contained'
                  type='submit'
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={
                    !readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />
                  }
                  // disabled={loading}
                  onClick={loading ? () => null : handleSubmit}
                >
                  Save
                </Button>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '90%',
                  margin: '0 auto',
                }}
              >
                <CircularProgress size={30} />
              </div>
            )
          ) : (
            !permissionCheck(currentUser.role_name, rulesList.transporter_view) ? (
              <div>
                <Button
                  variant='contained'
                  type='submit'
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={
                    !readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />
                  }
                  // disabled={loading}
                  onClick={loading ? () => null : handleEdit}
                >
                  Edit
                </Button>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewTransportsForm;
