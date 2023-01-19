import DateFnsUtils from '@date-io/date-fns';
import { Box, CircularProgress, Divider, Grid, Switch, Tooltip, Typography,IconButton } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import Button from '../../../components/CommonComponents/Button/Button';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import {
  ViewData,
} from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { URL } from '../../../config/serverUrls';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { getPincodeDetails } from '../../../services/dealers.service';
import { validateId } from '../../../services/dealerships.service';
import { deleteTransportOwnerProfileDoc } from '../../../services/transports.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
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
    overflowX: 'hidden',
  },
  title: {
    marginBottom: 4,
    fontSize: 11,
  },
  actionButtons: {
    // paddingTop: 8
  },
  tableRow: {
    cursor: 'pointer',
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  fileStyle: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  fileAttachement: {
    display: 'flex',
    // justifyContent:'center',
    marginTop: 6,
  },
  icon: {
    marginRight: 4,
    marginTop: 6,
  },
  typography: {
    marginTop: 8,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  details: {
    // padding: 6,
    borderColor: 'grey',
    minWidth: 80,
    height: 50,
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'left',
  },
  text: {
    fontSize: 12,
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
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
    backgroundColor: '#eeeeee',
    color: '#43a047',
  },
  attachmentContainer: {
    display: 'flex', justifyContent: 'space-between', width: '39vw', paddingRight: 12, flexWrap: 'wrap', marginLeft: 8
  },
}));

const AddNewTransportsOwnerForm = ({
  handleNext,
  currentUser,
  dealer_id,
  isAdd,
  rowData,
  form_data,
  id,
  callback,
  editable
}) => {
  const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [panValidateData, setPanValidateData] = useState({icon: false})
  const [aadharValidateData, setAadharValidateData] = useState({icon: false})
  const [fileType, setFileType] = useState('');
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const [selectedDate, setSelectedDate] = useState(rowData?.dob && parse(rowData?.dob, 'dd-MM-yyyy', new Date()));
  const handleValidate = (action, id, data) => {
    if(action === 'pan' ? id : id && values?.first_name){
      action === 'pan' && setPanValidateData({icon:true, loading: true})
      action === 'aadhar' && setAadharValidateData({icon:true, loading: true})
      validateId(action, id, data)
        .then((res) => {
          if(action === 'pan') {
            setPanValidateData({icon: true, loading: false, idType: 'PAN', details: res?.details || {}, is_verified: res?.is_verified})
            !values?.first_name && setFieldValue('first_name', res?.details?.firstName)
            !values?.last_name && setFieldValue('last_name', res?.details?.lastName)
            res?.details?.dob && setSelectedDate(parse(res?.details?.dob, 'yyyy-MM-dd', new Date()))
            !values?.gender && setFieldValue('gender', res?.details?.gender?.toUpperCase())
            !values?.pincode && setFieldValue('pincode', res?.details?.address?.pinCode)
            !values?.address && setFieldValue('address', `${res?.details?.address?.buildingName}, ${res?.details?.address?.streetName}, ${res?.details?.address?.city}, ${res?.details?.address?.state} - ${res?.details?.address?.pinCode}`)
          } else {
            setAadharValidateData({icon: true, loading: false, idType: 'AADHAR', details: res?.details || {}, is_verified: res?.is_verified})
          }
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          action === 'pan' && setPanValidateData({icon: true, idType: 'PAN'})
          action === 'aadhar' && setAadharValidateData({icon: true, idType: 'AADHAR'})
        })
    } else {
      validateField(action)
      action === 'aadhar' && validateField('first_name')
    }
  }
  const handleDateChange = (e) => {
    setSelectedDate(e);
  };
  const handleStateChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleEdit = () => {
    setReadOnly(!readOnly);
  };
  const handleClose = () => {
    callback();
  };
  const ValidateProps = (valid) => {
    return({
      endAdornment: <div style={{marginRight: 6, marginTop: 4, cursor: 'pointer'}}>
        {
        valid?.icon ?
        valid?.loading ? <CircularProgress size={15}/> :
        valid?.is_verified ? <Tooltip title={`Valid ${valid.idType}`} ><CheckCircleOutlineOutlinedIcon fontSize='small' style={{color:'#4caf50'}} /></Tooltip> :
        <Tooltip title={`Invalid ${valid.idType}`} ><CancelOutlinedIcon fontSize='small' color='error' /></Tooltip> : null
        }
      </div>
    })
  }
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const queryClient = useQueryClient()
  const currentYear = date.getFullYear();
  const currentYearDiff = date.getFullYear() - 1970;
  const classes = useStyles();
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    setSubmitting,
    validateField
  } = useFormik({
    initialValues: {
      ...rowData, state: rowData?.state_code, state_name: rowData?.state, city_name: rowData?.city, city: rowData?.city_name,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      first_name: Yup.string().required('Please enter transporter name').nullable('Please enter transporter name'),
      last_name: Yup.string().required('Please enter transporter name').nullable('Please enter transporter name'),
      email: Yup.string().email('Enter valid mail id').nullable('Enter valid mail id'),
      mobile: Yup.number().required('Enter mobile number').nullable('Enter mobile number').test('maxDigits', 'Mobile Number mush have 10 digits', (number) => String(number).length === 10),
      address: Yup.string().required('Please enter address').nullable('Please enter address'),
      pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
      pan: Yup.string().nullable('Enter PAN').matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN').required('Enter PAN').uppercase(),
      city: Yup.string().nullable('Enter City').required('Enter City'),
      state: Yup.string().nullable('Enter State').required('Enter State'),
      aadhar: Yup.string().nullable('Enter GST').matches(/^(\d{12})$|^(\d{16})$/, 'Invalid aadhar').required('Enter valid aadhar'),
    }),
    onSubmit: (values) => {
      if(isAdd === 'Add'){
        handleValidate('pan',values?.pan)
      }
      values.first_name = values.first_name.toUpperCase();
      values.last_name = values.last_name.toUpperCase();
      const dob = selectedDate ? format(new Date(selectedDate), 'dd-MM-yyyy') : values?.dob
      const date_values = {
        ...values,
        dob: dob,
        is_whatsapp: state.checkedA === true ? 1 : 0,
        is_aadhar_linked: state.checkedB === true ? 1 : 0,
      };

      let obj = {};
      if (values.t_owner_id) {
        obj = compareObject(rowData, date_values)
      }
      else {
        obj = { ...date_values }
      }

      const data = new FormData();
      Object.keys(obj).forEach((key) => {
        if( key === 'pan' ){
          let pan = obj?.pan ? cryptoEncrypt(obj.pan) : obj?.pan;
          data.append(key, pan);
        }
        else if( key === 'aadhar' ){
          let aadhar = obj?.aadhar ? cryptoEncrypt(obj.aadhar) : obj?.aadhar;
          data.append(key, aadhar);
        } else {
          data.append(key, obj[key]);
        }
      });

      if (isAdd === 'Edit') {
        setLoading(true);
        fetch(`${URL.base}transport/owner/${rowData.t_owner_id} `, {
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${currentUser.token} `,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.status === 'SUCCESS') {
              setLoading(false);
              enqueueSnackbar(res.profile_status, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'success',
              });
              queryClient.invalidateQueries(['owner-info', dealer_id])
              callback();
            } else {
              setLoading(false);
              enqueueSnackbar(res.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'error',
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          });
      } else {
        setLoading(true);
        data.append('dealership_id', dealer_id);
        fetch(`${URL.base}transport/owner`, {
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${currentUser.token} `,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            setLoading(false)
            if (res.status === 'SUCCESS') {
              setLoading(false);
              enqueueSnackbar(res.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'success',
              });
              queryClient.invalidateQueries(['owner-info', dealer_id])
              callback();
            } else {
              setLoading(false)
              enqueueSnackbar(res.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'error',
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
            enqueueSnackbar('Something went wrong, Please try Again!', {
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

  useEffect(() => {
    if(/^[1-9][0-9]{5}$/.test(values?.pincode)) {
      getPincodeDetails(values?.pincode)
        .then(res =>{
          setCity(res)
          setFieldValue('city', res[0]?.city_code)
          setFieldValue('state', res[0]?.state_code)
        })
        .catch(e => {
          console.log(e);
        })
    }
  },[values?.pincode])

  const onCloseUploader = () => {
    setShowUpload(false);
  };
  const handleSave = (value) => {
    if (fileType === 'PAN') {
      setFieldValue('pan_file_url', value[0]);
    } else if (fileType === 'Front') {
      setFieldValue('aadhar_f_file_url', value[0]);
    } else if (fileType === 'Back') {
      setFieldValue('aadhar_b_file_url', value[0]);
    } else {
      setFieldValue('profile_image_url', value[0]);
    }
    onCloseUploader();
  };
  const docUpload = (val) => {
    setShowUpload(true);
    setFileType(val);
  };
  const onDocDelete = (data) => {
    deleteTransportOwnerProfileDoc(data, values.t_owner_id)
      .then(res => {
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        queryClient.invalidateQueries(['owner-info', dealer_id])
        callback();
      })
      .catch(err => {
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })

  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Owner Information</div>
        <IconButton onClick={handleClose}  size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {readOnly ? (
            <>
              <Typography variant="h6" style={{marginTop: 8}}>Personal Details</Typography>
              <Grid container spacing={2} className={classes.readOnlyWrapper}>
                <Grid item md={6}>
                  <Box className={classes.box}>
                    <ViewData title='Owner ID' value={values.t_owner_id} />
                    <ViewData title='Date of Birth' value={values.dob} />
                    <ViewData title='Address' value={values.address} />
                    <ViewData title='City' value={values.city_name} />
                    <ViewData title='Marital Status' value={values.marital_status} />
                    <ViewData title='Mobile' value={values.mobile} />
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Box className={classes.box}>
                    <ViewData title='Name' value={values.first_name} />
                    <ViewData title='Gender' value={values.gender} />
                    <ViewData title='Pincode' value={values.pincode} />
                    <ViewData title='State' value={values.state_name} />
                    <ViewData title='Residing since' value={values.residing_since} />
                    <ViewData title='Email' value={values.email} />
                  </Box>
                </Grid>
              </Grid>
              <Divider />
              <Typography variant="h6" style={{marginTop: 8}}>KYC Details</Typography>
              <Grid container spacing={2} className={classes.readOnlyWrapper}>
                <Grid item md={6}>
                  <ViewData title='PAN' value={values.pan} endIcon={<CustomToken variant={values?.pan_verified ? 'success': 'error'} label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.pan_verified ? 'tick' : 'cross'}/>}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Aadhar' value={values.aadhar} endIcon={<CustomToken variant={values?.aadhar_verified ? 'success': 'error'} label={values?.aadhar_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.aadhar_verified ? 'tick' : 'cross'}/>} />
                </Grid>
              </Grid>
              <Divider />
              {values?.profile_image_url ||
                values?.pan_file_url ||
                values?.aadhar_f_file_url ||
                values?.aadhar_b_file_url ? (
                  <div className={classes.readOnlyWrapper}>
                    <Typography variant='h4'>Attachments</Typography>
                    <div
                      style={{
                        display: 'flex',
                        marginTop: 16,
                      }}
                    >
                      {values.profile_image_url && <DocAttachment tooltip='View Profile' imgUrl={values?.profile_image_url} docName='Profile' style={{marginRight: 20}} />}
                      {values.pan_file_url && <DocAttachment tooltip='View PAN' imgUrl={values?.pan_file_url} docName='PAN' style={{marginRight: 20}} />}
                      {values.aadhar_f_file_url && <DocAttachment tooltip='View Aadhar Front' imgUrl={values?.aadhar_f_file_url} docName='Aadhar front' style={{marginRight: 20}} />}
                      {values.aadhar_b_file_url && <DocAttachment tooltip='View Aadhar Back' imgUrl={values?.aadhar_b_file_url} docName='Aadhar back' style={{marginRight: 20}} />}
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
                  <Grid item md={12} >
                    <Typography variant="title"><strong>KYC Details</strong></Typography>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='PAN'
                      name='pan'
                      value={values.pan?.toUpperCase()}
                      disabled={panValidateData?.loading || values?.pan_verified}
                      error={errors.pan}
                      readOnly={readOnly}
                      helperText={errors.pan}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={ValidateProps(panValidateData)}
                    />
                    {
                      !values?.pan_verified || values?.pan !== rowData?.pan ?
                        <Typography variant="caption" style={{color: 'blue', cursor: 'pointer'}} onClick={() => handleValidate('pan', values?.pan)}>Validate PAN</Typography> : null
                    }
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='Aadhar'
                      name='aadhar'
                      value={values.aadhar}
                      disabled={aadharValidateData?.loading || values?.aadhar_verified}
                      helperText={errors.aadhar}
                      readOnly={readOnly}
                      error={errors.aadhar}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={ValidateProps(aadharValidateData)}
                    />
                    {
                      !values?.aadhar_verified || values?.aadhar !== rowData?.aadhar ?
                        <Typography variant="caption" style={{color: 'blue', cursor: 'pointer'}} onClick={() => handleValidate('aadhar', values?.aadhar, values?.first_name)}>Validate Aadhar</Typography> : null
                    }
                  </Grid>
                  <Grid item md={12} >
                    <Typography variant="title"><strong>Personal Details</strong></Typography>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='First Name'
                      name='first_name'
                      value={values.first_name?.toUpperCase()}
                      error={errors.first_name}
                      readOnly={readOnly}
                      helperText={errors.first_name}
                      InputLabelProps={{ shrink: true }}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='Last Name'
                      name='last_name'
                      readOnly={readOnly}
                      error={errors.last_name}
                      helperText={errors.last_name}
                      value={values.last_name?.toUpperCase()}
                      InputLabelProps={{ shrink: true }}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        variant='inline'
                        fullWidth
                        inputVariant='outlined'
                        name='dob'
                        label='Date of Birth'
                        format='dd-MM-yyyy'
                        animateYearScrolling={true}
                        disableFuture={true}
                        invalidDateMessage='Invalid Date Format'
                        error={errors.dob}
                        helperText={errors.dob}
                        readOnly={readOnly}
                        disabled={readOnly}
                        margin='normal'
                        id='date-picker'
                        autoOk={true}
                        value={selectedDate? selectedDate : null}
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
                      select
                      label='Gender'
                      name='gender'
                      error={errors.gender}
                      helperText={errors.gender}
                      value={values.gender}
                      readOnly={readOnly}
                      disabled={readOnly}
                      onChange={handleChange}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value='null'>Select Gender</option>
                      <option value={'MALE'}>Male</option>
                      <option value={'FEMALE'}>Female</option>
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='Address'
                      name='address'
                      readOnly={readOnly}
                      value={values.address?.toUpperCase()}
                      error={errors.address}
                      helperText={errors.address}
                      onChange={handleChange}
                      rows={3}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      number
                      label="Pincode"
                      name="pincode"
                      readOnly={readOnly}
                      value={values.pincode}
                      error={errors.pincode}
                      helperText={errors.pincode}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      select
                      label="City"
                      name="city"
                      readOnly={readOnly}
                      value={values.city}
                      error={errors.city}
                      helperText={errors.city}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    >
                      {
                        city?.length ?
                          <option value="" disabled>Choose City...</option> :
                          <option value="" disabled>Enter Pincode to select City</option>
                      }
                      {
                        city?.map((item, i) => {
                          return(
                            <option key={i} value={item?.city_code}>{item?.city}</option>
                          )
                        })
                      }
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      select
                      name='state'
                      label='State'
                      readOnly={readOnly}
                      value={values.state}
                      error={errors.state}
                      helperText={errors.state}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    >
                      {
                        city?.length ?
                          <option value="" disabled>Choose State...</option> :
                          <option value="" disabled>Enter Pincode to select State</option>
                      }
                      {
                        city?.map((item, i)=> {
                          return(
                            <option key={i} value={item?.state_code}>{item?.state}</option>
                          )
                        })
                      }
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      select
                      label='Residing Since'
                      name='residing_since'
                      value={values.residing_since}
                      error={errors.residing_since}
                      onChange={handleChange}
                      readOnly={readOnly}
                      disabled={readOnly}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      {
                        <>
                          <option value='null'>Residing Since</option>
                          {[...Array(currentYearDiff)].map((_, i) => {
                            return (
                              <option key={i} value={currentYear - i}>
                                {currentYear - i}
                              </option>
                            );
                          })}
                        </>
                      }
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      select
                      label='Marital Status'
                      name='marital_status'
                      error={errors.marital_status}
                      helperText={errors.marital_status}
                      value={values.marital_status}
                      onChange={handleChange}
                      readOnly={readOnly}
                      disabled={readOnly}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value='null'>Choose Marital Status</option>
                      <option value='Single'>Single</option>
                      <option value='Married'>Married</option>
                      <option value='Divorced'>Divorced</option>
                      <option value='Widowed'>Widowed</option>
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='Email'
                      name='email'
                      readOnly={readOnly}
                      error={errors.email}
                      helperText={errors.email}
                      defaultValue={values.email}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      label='Mobile'
                      name='mobile'
                      value={values.mobile}
                      onChange={handleChange}
                      error={errors.mobile}
                      readOnly={readOnly}
                      helperText={errors.mobile}
                      type='number'
                      InputLabelProps={{ shrink: true }}
                    ></TextInput>
                  </Grid>
                  <Grid item md={12}>
                    <Grid container>
                      <Grid item md={6}>
                        <Typography component='div'>
                          <Grid
                            component='label'
                            container
                            alignItems='center'
                            style={{ marginBottom: '10px', marginTop: '6px' }}
                            spacing={2}
                          >
                            <Grid
                              md={12}
                              style={{ paddingLeft: '8px', fontSize: '13px' }}
                            >
                              Mobile number on Whatsapp?
                            </Grid>
                            <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                            <Grid>
                              <Switch
                                checked={state.checkedA}
                                onChange={handleStateChange}
                                name='checkedA'
                                color='primary'
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                              />
                            </Grid>
                            <Grid>Yes</Grid>
                          </Grid>
                        </Typography>
                      </Grid>
                      <Grid item md={6}>
                        <Typography component='div'>
                          <Grid
                            component='label'
                            container
                            style={{ marginBottom: '8px', marginTop: '6px' }}
                            alignItems='center'
                            spacing={2}
                          >
                            <Grid
                              md={12}
                              style={{ paddingLeft: '8px', fontSize: '13px' }}
                            >
                              Mobile number linked with AADHAR?
                            </Grid>
                            <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                            <Grid>
                              <Switch
                                checked={state.checkedB}
                                onChange={handleStateChange}
                                color='primary'
                                name='checkedB'
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                              />
                            </Grid>
                            <Grid>Yes</Grid>
                          </Grid>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid md={12} item>
                    <Typography variant='subtitle1' component='subtitle1'>
                      Attachments
                    </Typography>
                  </Grid>
                  <div className={classes.attachmentContainer}>
                    <DocAttachment action={true} imgUrl={values?.profile_image_url} docName='Profile' onUpload={() => docUpload('Profile')} onDelete={() => onDocDelete({profile_image_url:''})} disabled={!values?.profile_image_url}/>
                    <DocAttachment action={true} imgUrl={values?.pan_file_url} docName='PAN Card' onUpload={() => docUpload('PAN')} onDelete={() => onDocDelete({pan_file_url:''})} disabled={!values?.pan_file_url} />
                    <DocAttachment action={true} imgUrl={values?.aadhar_f_file_url} docName='Aadhar Front' onUpload={() => docUpload('Front')} onDelete={() => onDocDelete({aadhar_f_file_url:''})} disabled={!values?.aadhar_f_file_url} />
                    <DocAttachment action={true} imgUrl={values?.aadhar_b_file_url} docName='Aadhar Back' onUpload={() => docUpload('Back')} onDelete={() => onDocDelete({aadhar_b_file_url:''})} disabled={!values?.aadhar_b_file_url} />
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
            data={rowData}
            title='Upload Transport Owner Documents'
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
              disabled={loading}
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
                  startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                  disabled={loading}
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
            <CheckAllowed currentUser={currentUser} resource={resources_id?.transporters} action={action_id?.transporters?.editOwner}>
              <Button
                variant='contained'
                type='submit'
                className={clsx(classes.btn, classes.editButton)}
                startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                disabled={loading}
                onClick={loading ? () => null : handleEdit}
              >
                Edit
              </Button>
            </CheckAllowed>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewTransportsOwnerForm;
