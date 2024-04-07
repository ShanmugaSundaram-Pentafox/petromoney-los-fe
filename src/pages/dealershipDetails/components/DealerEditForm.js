import DateFnsUtils from '@date-io/date-fns';
import { CircularProgress, Divider, Popover, Tooltip } from '@material-ui/core';
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
import { useQuery, useQueryClient } from 'react-query';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import FileUpload, { FILE_FORMAT_IMG, FILE_FORMAT_PDF } from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { logger } from '../../../config/logger';
import { getRelationshipList } from '../../../services/common.service';
import { deleteProfileDoc, getPincodeDetails } from '../../../services/dealers.service';
import { validateId } from '../../../services/dealerships.service';
import { Box, Flex, Grid, Space, Switch, Text, Title } from '@mantine/core';
import { TextInput as MantineTextInput } from '../../../components/Mantine/TextInput/TextInput';


const useStyles = makeStyles({
  row: {
    paddingRight: 12,
    paddingBottom: 14
  },
  readOnlyWrapper: {
    margin: '2px 4px',
    maxWidth: '98%',
  },
  title: {
    fontSize: 11,
  },
  attachmentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '39vw',
    paddingRight: 12,
    flexWrap: 'wrap'
  },
});

const DealerEditForm = ({ modelType, data, dealersList, handleDate, deleteFile, editableValues, readOnlyProps, values, errors, onChange, handleState, handleSave, setFieldValue, setPanValidateData, panValidateData, validateField, setAadharValidateData, aadharValidateData, currentUser, id, onClose }) => {
  const readOnly = readOnlyProps;
  const queryClient = useQueryClient();
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { data: relationShipOptions = [] } = useQuery(['relationships'], () => getRelationshipList())
  const handleDateChange = (date) => {
    setSelectedDate(date)
    handleDate(date)
  }
  useEffect(() => {
    handleState(state)
  })

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        onClose()
        queryClient.invalidateQueries(['dealership-applicants', id])
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
     * If action is aadhaar, id and name is required else aadhaar validateField and name validateField will be called.
     */
    if ((action === 'pan' && id) || (action === 'aadhar' && id && values?.first_name)) {
      action === 'pan' && setPanValidateData({ icon: true, loading: true })
      action === 'aadhar' && setAadharValidateData({ icon: true, loading: true })
      validateId(action, id, data)
        .then((res) => {
          if (action === 'pan') {
            setPanValidateData({ icon: true, loading: false, idType: 'PAN', details: res?.details || {}, is_verified: res?.is_verified })
            !values?.first_name && setFieldValue('first_name', res?.details?.firstName)
            !values?.last_name && setFieldValue('last_name', res?.details?.lastName)
            res?.details?.dob && setSelectedDate(parse(res?.details?.dob, 'yyyy-MM-dd', new Date()))
            !values?.gender && setFieldValue('gender', res?.details?.gender?.toUpperCase())
            !values?.pincode && setFieldValue('pincode', res?.details?.address?.pinCode)
            action === 'pan' && !values?.address && setFieldValue('address', `${res?.details?.address?.buildingName}, ${res?.details?.address?.streetName}, ${res?.details?.address?.city}, ${res?.details?.address?.state} - ${res?.details?.address?.pinCode}`)
          } else { setAadharValidateData({ icon: true, loading: false, idType: 'AADHAR', details: res?.details || {}, is_verified: res?.is_verified }) }
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          action === 'pan' && setPanValidateData({ icon: true, idType: 'PAN' })
          action === 'aadhar' && setAadharValidateData({ icon: true, idType: 'AADHAR' })
        })
    } else {
      validateField(action)
      action === 'aadhar' && validateField('first_name')
    }
  }

  useEffect(() => {
    if (/^[1-9][0-9]{5}$/.test(values?.pincode)) {
      getPincodeDetails(values?.pincode)
        .then(res => {
          setCity(res)
          setFieldValue('city', res[0]?.city_code)
          setFieldValue('state', res[0]?.state_code)
        })
        .catch(e => {
          logger(e)
        })
    }
  }, [values?.pincode])

  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };

  const ValidateProps = (valid) => {
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
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentYearDiff = date.getFullYear() - 1970;

  return (
    <>
      {
        readOnly ? (
          <>
            <Title order={4} mb="lg">KYC Details</Title>
            <Grid gutter="sm" mb="lg">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Tooltip title={values?.pan_verified ? 'Click to view PAN details' : 'Verify your PAN to get the details'}>
                  <Box onClick={(event) => values?.pan_verified == 1 ? setAnchorEl(event.currentTarget) : null}>
                    <ViewData title='PAN' value={values.pan} endIcon={<CustomToken variant={values?.pan_verified ? 'success' : 'error'} label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.pan_verified ? 'tick' : 'cross'} />} />
                  </Box>
                </Tooltip>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData 
                  title='Aadhaar' 
                  value={values.aadhar} 
                  endIcon={<CustomToken variant={values?.aadhar_verified ? 'success' : 'error'} label={values?.aadhar_verified ? 'VERIFIED' : 'UNVERIFIED'} icon={values?.aadhar_verified ? 'tick' : 'cross'} />} 
                />
              </Grid.Col>
            </Grid>

            <Divider my="lg" />
            <Title order={4} my="lg">Personal Details</Title>
            <Grid gutter="sm" mb="lg">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='ID' value={values.id} />
              </Grid.Col>  
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Date of Birth' value={values.dob} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Address' value={values.address} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='State' value={values.state_name} />
              </Grid.Col>  
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Marital Status' value={values.marital_status} />
              </Grid.Col>  
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Mobile' value={values.mobile} />
              </Grid.Col>  
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Email' value={values.email} />
              </Grid.Col> 

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Name' value={`${values.first_name} ${values.last_name}`} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>  
                <ViewData title={'Father\'s Name'} value={values.father_name} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>  
                <ViewData title='Gender' value={values.gender} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='City' value={values.city_name} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Pincode' value={values.pincode} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Residing since' value={values.residing_since} />
              </Grid.Col>
            </Grid>
            

            <Divider my="lg" />

            {values?.profile_image_url || values?.pan_file_url || values?.aadhar_file_url ? (
              <>
                <Title order={4} my="lg">Attachments</Title>
                <Flex gap="xs" mb="lg">
                  {values.profile_image_url && (
                    <DocAttachment 
                      tooltip='View Profile' 
                      imgUrl={values?.profile_image_url} 
                      docName='Profile' 
                    />
                  )}
                  {values.pan_file_url && (
                    <DocAttachment 
                      tooltip='View PAN' 
                      imgUrl={values?.pan_file_url} 
                      docName='PAN' 
                    />
                  )}
                  {values.aadhar_file_url && (
                    <DocAttachment 
                      tooltip='View Aadhaar' 
                      imgUrl={values?.aadhar_file_url} 
                      docName='Aadhaar' 
                    />
                  )}
                </Flex>
              </>
            ) : (
              <>
                <Title order={4} mb="lg">Attachments</Title>
                <Flex h="40" align="center" justify="center" mb="lg">
                  <Text>No Attachments Found</Text>
                </Flex>
              </>
            )}
          </>
        ) : (
          <>
            <Title order={4} mb="lg">KYC Details</Title>
            <Grid gutter="sm" mb="lg">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <MantineTextInput
                  label="PAN Number"
                  name="pan"
                  value={values.pan?.toUpperCase()}
                  error={errors.pan}
                  disabled={(currentUser.role_id !== 1) && (panValidateData?.loading || values?.pan_verified)}
                  readOnly={readOnly}
                  onChange={onChange}
                  // InputProps={ValidateProps(panValidateData)}
                />
                
                {!values?.pan_verified || values?.pan !== data?.pan ? (
                  <Box 
                    component="span" 
                    className="cursor-pointer"
                    onClick={() => handleValidate('pan', values?.pan)}
                  >
                    <Text fz="xs" fw="600" c="indigo.5" span>Validate PAN</Text>
                  </Box>
                ) : null}
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <MantineTextInput
                  number
                  label="Aadhaar"
                  name="aadhar"
                  value={values.aadhar}
                  disabled={aadharValidateData?.loading || values?.aadhar_verified}
                  readOnly={readOnly}
                  error={errors.aadhar}
                  onChange={onChange}
                  // InputProps={ValidateProps(aadharValidateData)}
                />
                {!values?.aadhar_verified || values?.aadhar !== data?.aadhar ? (
                  <Box 
                    component="span" 
                    className="cursor-pointer"
                    onClick={() => handleValidate('aadhar', values?.aadhar, values?.first_name)}
                  >
                    <Text fz="xs" fw="600" c="indigo.5" span>Validate Aadhaar</Text>
                  </Box>
                ) : null}
              </Grid.Col>
            </Grid> 

            <Divider my="lg" />
            <Title order={4} my="lg">Personal Details</Title>
            <Grid gutter="sm" mb="lg">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <MantineTextInput
                  label="First Name"
                  name="first_name"
                  error={errors.first_name}
                  readOnly={readOnly}
                  value={values.first_name?.toUpperCase()}
                  onChange={onChange}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <MantineTextInput
                  label="Last Name"
                  name="last_name"
                  readOnly={readOnly}
                  error={errors.last_name}
                  value={values.last_name?.toUpperCase()}
                  onChange={onChange}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Father's Name"
                  name="father_name"
                  readOnly={readOnly}
                  error={errors.father_name}
                  helperText={errors.father_name}
                  value={values.father_name?.toUpperCase()}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Address"
                  name="address"
                  readOnly={readOnly}
                  value={values.address}
                  error={errors.address}
                  helperText={errors.address}
                  onChange={onChange}
                  rows={3}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
                      return (
                        <option key={i} value={item?.city_code}>{item?.city}</option>
                      )
                    })
                  }
                </TextInput>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
                    city?.map((item, i) => {
                      return (
                        <option key={i} value={item?.state_code}>{item?.state}</option>
                      )
                    })
                  }
                </TextInput>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <MantineTextInput
                  type="number"
                  label="Mobile"
                  name="mobile"
                  readOnly={readOnly}
                  value={values.mobile}
                  onChange={onChange}
                  error={errors.mobile}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <MantineTextInput
                  label="Email"
                  name="email"
                  readOnly={readOnly}
                  error={errors.email}
                  defaultValue={values.email}
                  onChange={onChange}
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              </Grid.Col>
              {modelType === 'COAPPLICANT' || modelType === 'GUARANTOR' ? (
                <>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      select
                      label="Relation To"
                      name="relation_to"
                      error={errors.relation_to}
                      helperText={errors.relation_to}
                      readOnly={readOnly}
                      value={values.relation_to}
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
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
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
                            <option key={i} value={item?.value}>{item.label}</option>
                          )
                        })
                      }
                    </TextInput>
                  </Grid.Col>
                </> 
              ) : null}
            </Grid>  

            <Grid gutter="sm" mb="lg">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Space h="24" />
                <Flex h="36" align="center" justify="space-between">
                  <Text fs="xs">Mobile number on Whatsapp?</Text>
                  <Switch
                    // color="indigo"
                    // size="sm"
                    checked={state.checkedA}
                    onChange={(event) => setState({...state,checkedA:event.currentTarget.checked})}
                    // onLabel="Yes" 
                    // offLabel="No"
                  />
                </Flex>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Space h="24" />
                <Flex h="36" align="center" justify="space-between">
                  <Text fs="xs">Mobile number linked with Aadhaar?</Text>
                  <Switch
                    // color="indigo"
                    // size="sm"
                    checked={state.checkedB}
                    onChange={(event) => setState({...state,checkedB:event.currentTarget.checked})}
                    // onLabel="Yes" 
                    // offLabel="No"
                  />
                </Flex>
              </Grid.Col>
            </Grid>

            <Divider my="lg" />
            <Title order={4} my="lg">Attachments</Title>

            <Flex gap="xs" mb="lg">
              <DocAttachment 
                action={true} 
                imgUrl={values?.profile_image_url} 
                docName='Profile' 
                onUpload={() => docUpload('Profile')} 
                onDelete={() => onDocDelete('profile')} 
                disabled={!values?.profile_image_url} 
              />
              <DocAttachment 
                action={true} 
                imgUrl={values?.pan_file_url} 
                docName='PAN Card'
                onUpload={() => docUpload('PAN')} 
                onDelete={() => onDocDelete('pan')} 
                disabled={!values?.pan_file_url} 
              />
              <DocAttachment 
                action={true} 
                imgUrl={values?.aadhar_file_url} 
                docName='Aadhaar' 
                onUpload={() => docUpload('AADHAR')} 
                onDelete={() => onDocDelete('aadhar')} 
                disabled={!values?.aadhar_file_url} 
              />
            </Flex>
            
            {showUpload && (
              <FileUpload
                handleSave={(value) => {
                  handleSave(value, fileType)
                  showUpload && setShowUpload(false);
                }}
                FILE_FORMAT={[...FILE_FORMAT_IMG, ...FILE_FORMAT_PDF]}
                title='Upload Documents'
                open={showUpload}
                onCloseUploader={() => { setShowUpload(false) }}
              />
            )}
          </>
        )
      }

      {/* This popup is to show the actual pan details returned from the external API */}
      <Popover
        id={anchorEl ? 'simple-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div style={{ minHeight: 150, width: 380, padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <Typography align="center" variant='h4' mb={20} className={classes.titlename}>Actual PAN Details</Typography>
            <div className={classes.title}>
              <ViewData title='Name' value={data?.pan_details?.name} />
              <ViewData title='First name' value={data?.pan_details?.firstName} />
              <ViewData title='Middle name' value={data?.pan_details?.middleName} />
              <ViewData title='last name' value={data?.pan_details?.lastName} />
              <ViewData title='DOB' value={data?.pan_details?.dob} />
              <ViewData title='Address' value={`${data?.pan_details?.address?.buildingName} ${data?.pan_details?.address?.streetName}, ${data?.pan_details?.address?.city}, ${data?.pan_details?.address?.state}, ${data?.pan_details?.address?.pinCode} `} />
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default DealerEditForm;