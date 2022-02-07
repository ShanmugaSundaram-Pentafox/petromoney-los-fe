import DateFnsUtils from '@date-io/date-fns';
import { Divider } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { parse } from 'date-fns';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { deleteProfileDoc } from '../../../services/dealers.service';


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

const DealerEditForm = ({ modelType, data, dealersList, handleDate, deleteFile, editableValues, readOnlyProps, values, errors, onChange, handleState, handleSave }) => {
  const readOnly = readOnlyProps;
  const classes = useStyles();
  const [showUpload, setShowUpload] = useState(false);
  const [fileType, setFileType] = useState()
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(data?.dob && parse(data?.dob, 'dd-MM-yyyy', new Date()))
  const handleDateChange = (date) => {
    // const d = format(new Date(date), "dd-MM-yyyy")
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

  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };
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
            <Grid container spacing={2} className={classes.readOnlyWrapper}>
              <Grid item md={6}>
                <Box className={classes.box} >
                  <ViewData title='ID' value={values.id} />
                  <ViewData title='Date of Birth' value={values.dob} />
                  <ViewData title='Address' value={values.address} />
                  <ViewData title='Marital Status' value={values.marital_status} />
                  <ViewData title='Mobile' value={values.mobile} />
                  <ViewData title='Aadhar' value={values.aadhar} />
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box className={classes.box} >
                  <ViewData title='Name' value={`${values.first_name} ${values.last_name}`} />
                  <ViewData title='Gender' value={values.gender} />
                  <ViewData title='Pincode' value={values.pincode} />
                  <ViewData title='Residing since' value={values.residing_since} />
                  <ViewData title='Email' value={values.email} />
                  <ViewData title='PAN' value={values.pan} />
                </Box>
              </Grid>
            </Grid>
            <Divider />
            {
              values?.profile_image_url || values?.pan_file_url || values?.aadhar_f_file_url || values?.aadhar_b_file_url ? (
                <div className={classes.readOnlyWrapper}>
                  <Typography variant="h4">Attachments</Typography>
                  <div style={{ display: 'flex', marginTop: 16 }}>
                    {values.profile_image_url && <DocAttachment tooltip='View Profile' imgUrl={values?.profile_image_url} docName='Profile' style={{marginRight: 20}} />}
                    {values.pan_file_url && <DocAttachment tooltip='View PAN' imgUrl={values?.pan_file_url} docName='PAN' style={{marginRight: 20}} />}
                    {values.aadhar_f_file_url && <DocAttachment tooltip='View Aadhar Front' imgUrl={values?.aadhar_f_file_url} docName='Aadhar front' style={{marginRight: 20}} />}
                    {values.aadhar_b_file_url && <DocAttachment tooltip='View Aadhar Back' imgUrl={values?.aadhar_b_file_url} docName='Aadhar back' style={{marginRight: 20}} />}
                  </div>
                </div>
              ) : (
                <div className={classes.readOnlyWrapper}>
                  <Typography variant="h4">Attachments</Typography>
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
                    inputVariant='outlined'
                    label="Date of Birth"
                    format='dd-MM-yyyy'
                    animateYearScrolling={true}
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
                <Typography variant="h6">Documents</Typography>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  label="PAN Number"
                  name="pan"
                  value={values.pan?.toUpperCase()}
                  error={errors.pan}
                  helperText={errors.pan}
                  readOnly={readOnly}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}

                >
                </TextInput>
              </Grid>
              <Grid {...gridItem} md={6}>
                <TextInput
                  number
                  label="Aadhar"
                  name="aadhar"
                  value={values.aadhar}
                  helperText={errors.aadhar}
                  readOnly={readOnly}
                  error={errors.aadhar}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                >
                </TextInput>
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