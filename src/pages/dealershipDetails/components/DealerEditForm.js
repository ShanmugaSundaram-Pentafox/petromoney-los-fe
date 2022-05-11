import DateFnsUtils from '@date-io/date-fns';
import { CircularProgress, Divider, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { parse } from 'date-fns';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { logger } from '../../../config/logger';
import { deleteProfileDoc, getPincodeDetails } from '../../../services/dealers.service';
import { validateId } from '../../../services/dealerships.service';


const useStyles = makeStyles({
  row: {
    paddingRight: 12,
    paddingBottom: 14
  },
  input: {
    display: 'none'
  },
  details: {
    padding: 4,
    borderColor: 'grey',
    minWidth: 80,
    height: 50,
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'left'
  },
  readOnlyWrapper: {
    margin: '2px 4px',
    maxWidth: '98%',
  },

  fileStyle: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  fileAttachement: {
    display: 'flex',
    // justifyContent:'center',
    marginTop: 6
  },
  icon: {
    marginRight: 4,
    marginTop: 6,
  },
  typography: {
    marginTop: 8,
  },
  text: {
    marginBottom: 4,
    fontSize: 12,
  },
  title: {
    fontSize: 11,
  },
  attachmentContainer: {
    display: 'flex', justifyContent: 'space-between', width: '39vw', paddingRight: 12, flexWrap: 'wrap'
  },
});

const DealerEditForm = ({ modelType, data, dealersList, handleDate, deleteFile, editableValues, readOnlyProps, values, errors, onChange, handleState, handleSave, setFieldValue, setPanValidateData, panValidateData, validateField, setAadharValidateData, aadharValidateData }) => {
  const readOnly = readOnlyProps;
  const classes = useStyles();
  const [city, setCity] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [fileType, setFileType] = useState()
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(data?.dob && parse(data?.dob, 'dd-MM-yyyy', new Date()))
  const handleDateChange = (date) => {
    setSelectedDate(date)
    handleDate(date)
  }
  useEffect(() => {
    handleState(state)
  })
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked },);
  };
  const docUpload = (val) => {
    setShowUpload(true)
    setFileType(val)
  }
  const onDocDelete = (data) => {
    deleteProfileDoc(data, values.id, values.dealership_id, modelType)
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

  const handleValidate = (action, id, data) => {
    /*
     * If action is pan, only id is required else pan validateField will be called.
     * If action is aadhar, id and name is required else aadhar validateField and name validateField will be called.
     */
    if((action === 'pan' && id) || (action === 'aadhar' && id && values?.first_name)){
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
            action === 'pan' && !values?.address && setFieldValue('address', `${res?.details?.address?.buildingName}, ${res?.details?.address?.streetName}, ${res?.details?.address?.city}, ${res?.details?.address?.state} - ${res?.details?.address?.pinCode}`)
          } else { setAadharValidateData({icon: true, loading: false, idType: 'AADHAR', details: res?.details || {}, is_verified: res?.is_verified}) }
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

  useEffect(() => {
    if(/^[1-9][0-9]{5}$/.test(values?.pincode)) {
      getPincodeDetails(values?.pincode)
        .then(res =>{
          setCity(res)
          setFieldValue('city', res[0]?.city_code)
          setFieldValue('state', res[0]?.state_code)
        })
        .catch(e => {
          logger(e)
        })
    }
  },[values?.pincode])

  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
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
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentYearDiff = date.getFullYear() - 1970;
  const relationShipOptions = [
    { label: 'Choose Relationship', value: '' },
    { label: 'Father', value: 'FATHER' },
    { label: 'Mother', value: 'MOTHER' },
    { label: 'Spouse', value: 'SPOUSE' },
    { label: 'Uncle', value: 'UNCLE' },
    { label: 'Aunt', value: 'AUNT' },
    { label: 'Son', value: 'SON' },
    { label: 'Daughter', value: 'DAUGHTER' },
    { label: 'Grandfather', value: 'GRANDFATHER' },
    { label: 'Grandmother', value: 'GRANDMOTHER' },
    { label: 'Mother-in-law', value: 'MOTHER-IN-LAW' },
    { label: 'Father-in-law', value: 'FATHER-IN-LAW' },
    { label: 'Sister-in-law', value: 'SISTER-IN-LAW' },
    { label: 'Brother-in-law', value: 'BROTHER-IN-LAW' },
    { label: 'Brother', value: 'BROTHER' },
    { label: 'Newphew', value: 'NEPHEW' },
    { label: 'Partner', value: 'PARTNER' },
    { label: 'Friend', value: 'FRIEND' },
    { label: 'Shareholder', value: 'SHAREHOLDER' },
    { label: 'Buyer', value: 'BUYER' },
    { label: 'Supplier', value: 'SUPPLIER' },
    { label: 'Business Neighbour', value: 'BUSINESS NEIGHBOUR' },
    { label: 'Home Neighbour', value: 'HOME NEIGHBOUR' },
    { label: 'Director', value: 'DIRECTOR' },
    { label: 'Proprietor', value: 'PROPRIETOR' },
    { label: 'Debtors', value: 'DEBTORS' },
    { label: 'Creditors', value: 'CREDITORS' },
    { label: 'Principal', value: 'PRINCIPAL' },
    { label: 'Others', value: 'OTHERS' }
  ]
  return (
    <>
      {
        readOnly ? (
          <>
            <Typography variant="h6" style={{marginTop: 8}}>Personal Details</Typography>
            <Grid container spacing={2} className={classes.readOnlyWrapper}>
              <Grid item md={6}>
                <Box className={classes.box} >
                  <ViewData title='ID' value={values.id} />
                  <ViewData title='Date of Birth' value={values.dob} />
                  <ViewData title='Address' value={values.address} />
                  <ViewData title='State' value={values.state_name} />
                  <ViewData title='Marital Status' value={values.marital_status} />
                  <ViewData title='Mobile' value={values.mobile} />
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box className={classes.box} >
                  <ViewData title='Name' value={`${values.first_name} ${values.last_name}`} />
                  <ViewData title='Gender' value={values.gender} />
                  <ViewData title='City' value={values.city_name} />
                  <ViewData title='Pincode' value={values.pincode} />
                  <ViewData title='Residing since' value={values.residing_since} />
                  <ViewData title='Email' value={values.email} />
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Typography variant="h6" style={{marginTop: 8}}>KYC Details</Typography>
            <Grid container spacing={2} className={classes.readOnlyWrapper}>
              <Grid item md={6}>
                <ViewData title='PAN' value={values.pan} endIcon={<CustomToken variant={values?.pan_verified ? 'success': 'error'} label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.pan_verified ? 'tick' : 'cross'}/>} />
              </Grid>
              <Grid item md={6}>
                <ViewData title='Aadhar' value={values.aadhar} endIcon={<CustomToken variant={values?.aadhar_verified ? 'success': 'error'} label={values?.aadhar_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.aadhar_verified ? 'tick' : 'cross'}/>} />
              </Grid>
            </Grid>
            <Divider />
            {
              values?.profile_image_url || values?.pan_file_url || values?.aadhar_f_file_url || values?.aadhar_b_file_url ? (
                <div className={classes.readOnlyWrapper}>
                  <Typography variant="h6" style={{marginTop: 8}}>Attachments</Typography>
                  <div style={{ display: 'flex', marginTop: 16 }}>
                    {values.profile_image_url && <DocAttachment tooltip='View Profile' imgUrl={values?.profile_image_url} docName='Profile' style={{marginRight: 20}} />}
                    {values.pan_file_url && <DocAttachment tooltip='View PAN' imgUrl={values?.pan_file_url} docName='PAN' style={{marginRight: 20}} />}
                    {values.aadhar_f_file_url && <DocAttachment tooltip='View Aadhar Front' imgUrl={values?.aadhar_f_file_url} docName='Aadhar front' style={{marginRight: 20}} />}
                    {values.aadhar_b_file_url && <DocAttachment tooltip='View Aadhar Back' imgUrl={values?.aadhar_b_file_url} docName='Aadhar back' style={{marginRight: 20}} />}
                  </div>
                </div>
              ) : (
                <div className={classes.readOnlyWrapper}>
                  <Typography variant="h6">Attachments</Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Typography variant="h7">No Attachments Found</Typography>
                  </div>
                </div>
              )
            }
          </>
        ) : (
          <Grid container style={{marginTop: 10}}>
            <>
              <Grid {...gridItem} md={12} >
                <Typography variant="title"><strong>KYC Details</strong></Typography>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  label="PAN Number"
                  name="pan"
                  value={values.pan?.toUpperCase()}
                  disabled={panValidateData?.loading || values?.pan_verified}
                  error={errors.pan}
                  helperText={errors.pan}
                  readOnly={readOnly}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={ValidateProps(panValidateData)}
                />
                {
                  !values?.pan_verified || values?.pan !== data?.pan ?
                    <Typography variant="caption" style={{color: 'blue', cursor: 'pointer'}} onClick={() => handleValidate('pan', values?.pan)}>Validate PAN</Typography> : null
                }
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  number
                  label="Aadhar"
                  name="aadhar"
                  value={values.aadhar}
                  disabled={aadharValidateData?.loading || values?.aadhar_verified}
                  helperText={errors.aadhar}
                  readOnly={readOnly}
                  error={errors.aadhar}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={ValidateProps(aadharValidateData)}
                />
                {
                  !values?.aadhar_verified || values?.aadhar !== data?.aadhar ?
                    <Typography variant="caption" style={{color: 'blue', cursor: 'pointer'}} onClick={() => handleValidate('aadhar', values?.aadhar, values?.first_name)}>Validate Aadhar</Typography> : null
                }
              </Grid>
              <Grid {...gridItem} md={12} >
                <Typography variant="title"><strong>Personal Details</strong></Typography>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  label="First Name"
                  name="first_name"
                  error={errors.first_name}
                  readOnly={readOnly}
                  value={values.first_name?.toUpperCase()}
                  helperText={errors.first_name}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  label="Last Name"
                  name="last_name"
                  readOnly={readOnly}
                  error={errors.last_name}
                  helperText={errors.last_name}
                  value={values.last_name?.toUpperCase()}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid {...gridItem} md={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    variant='inline'
                    name='dob'
                    fullWidth
                    inputVariant='outlined'
                    label="Date of Birth"
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
                    value={selectedDate ? selectedDate : null}
                    onChange={handleDateChange}
                    keyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                    PopoverProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                      }
                    }}
                    InputLabelProps={{ shrink: true }}

                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  select
                  label="Gender"
                  name="gender"
                  error={errors.gender}
                  helperText={errors.gender}
                  value={values.gender}
                  disabled={readOnly}
                  onChange={onChange}
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="null">Select Gender</option>
                  <option value={'MALE'}>Male</option>
                  <option value={'FEMALE'}>Female</option>
                </TextInput>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  label="Address"
                  name="address"
                  readOnly={readOnly}
                  value={values.address}
                  error={errors.address}
                  helperText={errors.address}
                  onChange={onChange}
                  rows={3}
                  // multiline={true}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  number
                  label="Pincode"
                  name="pincode"
                  readOnly={readOnly}
                  value={values.pincode}
                  error={errors.pincode}
                  helperText={errors.pincode}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  select
                  label="City"
                  name="city"
                  readOnly={readOnly}
                  value={values.city}
                  error={errors.city}
                  helperText={errors.city}
                  onChange={onChange}
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
              <Grid {...gridItem} md={6}>
                <TextInput
                  select
                  name='state'
                  label='State'
                  readOnly={readOnly}
                  value={values.state}
                  error={errors.state}
                  helperText={errors.state}
                  onChange={onChange}
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
              <Grid {...gridItem} md={6}>
                <TextInput
                  select
                  label="Marital Status"
                  name="marital_status"
                  error={errors.marital_status}
                  helperText={errors.marital_status}
                  readOnly={readOnly}
                  value={values.marital_status}
                  onChange={onChange}
                  disabled={readOnly}
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="null">Choose Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </TextInput>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  select
                  label="Residing Since"
                  name="residing_since"
                  value={values.residing_since}
                  error={errors.residing_since}
                  onChange={onChange}
                  disabled={readOnly}
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                >
                  {
                    <>
                      <option value="null">Residing Since</option>
                      {[...Array(currentYearDiff)].map((_, i) => {
                        return (
                          <option key={i} value={currentYear - i}>{currentYear - i}</option>
                        )
                      })}
                    </>
                  }
                </TextInput>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  number
                  label="Mobile"
                  name="mobile"
                  readOnly={readOnly}
                  value={values.mobile}
                  onChange={onChange}
                  error={errors.mobile}
                  helperText={errors.mobile}
                  InputLabelProps={{ shrink: true }}
                ></TextInput>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  label="Email"
                  name="email"
                  readOnly={readOnly}
                  error={errors.email}
                  helperText={errors.email}
                  defaultValue={values.email}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {modelType === 'COAPPLICANT' || modelType === 'GUARANTOR' ?
                <>
                  <Grid {...gridItem} md={6}>
                    <TextInput
                      select
                      label="Relation To"
                      name="dealer_id"
                      error={errors.dealer_id}
                      helperText={errors.dealer_id}
                      readOnly={readOnly}
                      value={values.dealer_id}
                      onChange={onChange}
                      disabled={readOnly}
                      SelectProps={{
                        native: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    >
                      <option value="null">Choose Relative</option>
                      {
                        dealersList?.map((item, i) => {
                          return (
                            <option key={i} value={item.id}>{item.first_name} {item.last_name}</option>
                          )
                        })
                      }
                    </TextInput>
                  </Grid>
                  <Grid {...gridItem} md={6}>
                    <TextInput
                      select
                      label="Relationship type"
                      name="relationship"
                      error={errors.relationship}
                      helperText={errors.relationship}
                      readOnly={readOnly}
                      value={values.relationship}
                      onChange={onChange}
                      disabled={readOnly}
                      SelectProps={{
                        native: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    >
                      {
                        relationShipOptions.map((item, i) => {
                          return (
                            <option key={i} value={item.value}>{item.label}</option>
                          )
                        })
                      }
                    </TextInput>
                  </Grid>
                </> : null}
              <Grid {...gridItem}>
                <Grid container spacing={2}>
                  <Grid {...gridItem} md={6}>
                    <Typography component="div">
                      <Grid component="label" container alignItems="center" style={{ marginBottom: '10px', marginTop: '6px' }} spacing={2}>
                        <Grid md={12} style={{ paddingLeft: '8px' }}>Mobile number on Whatsapp?</Grid>
                        <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                        <Grid>
                          <Switch
                            checked={state.checkedA}
                            onChange={handleChange}
                            name="checkedA"
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid>Yes</Grid>
                      </Grid>
                    </Typography>
                  </Grid>
                  <Grid {...gridItem} md={6}>
                    <Typography component="div" >
                      <Grid component="label" container style={{ marginBottom: '8px', marginTop: '6px' }} alignItems="center" spacing={2}>
                        <Grid md={12} style={{ paddingLeft: 8, fontSize: 12 }}>Mobile number linked with AADHAR?</Grid>
                        <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                        <Grid>
                          <Switch
                            checked={state.checkedB}
                            onChange={handleChange}
                            color="primary"
                            name="checkedB"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </Grid>
                        <Grid>Yes</Grid>
                      </Grid>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid {...gridItem} md={12} >
                <Typography variant="title"><strong>Attachments</strong></Typography>
              </Grid>
              <div className={classes.attachmentContainer}>
                <DocAttachment action={true} imgUrl={values?.profile_image_url} docName='Profile' onUpload={() => docUpload('Profile')} onDelete={() => onDocDelete({profile_image_url:''})} disabled={!values?.profile_image_url}/>
                <DocAttachment action={true} imgUrl={values?.pan_file_url} docName='PAN Card' onUpload={() => docUpload('PAN')} onDelete={() => onDocDelete({pan_file_url:''})} disabled={!values?.pan_file_url} />
                <DocAttachment action={true} imgUrl={values?.aadhar_f_file_url} docName='Aadhar Front' onUpload={() => docUpload('Front')} onDelete={() => onDocDelete({aadhar_f_file_url:''})} disabled={!values?.aadhar_f_file_url} />
                <DocAttachment action={true} imgUrl={values?.aadhar_b_file_url} docName='Aadhar Back' onUpload={() => docUpload('Back')} onDelete={() => onDocDelete({aadhar_b_file_url:''})} disabled={!values?.aadhar_b_file_url} />
              </div>
              {
                showUpload && <FileUpload
                  handleSave={(value) => {
                    handleSave(value, fileType)
                    showUpload && setShowUpload(false);
                  }}
                  title='Upload Documents'
                  open={showUpload} onCloseUploader={() => { setShowUpload(false) }} />
              }
            </>
          </Grid>
        )
      }
    </>
  )
}

export default DealerEditForm;