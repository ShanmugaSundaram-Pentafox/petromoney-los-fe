import DateFnsUtils from '@date-io/date-fns';
import { Box, Divider, Flex, Grid, Switch, Text, Title } from '@mantine/core';
import { CircularProgress, Tooltip } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import {
  ViewData,
} from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import { Button } from '../../../components/Mantine/Button/Button';
import { TextInput as MantineTextInput } from '../../../components/Mantine/TextInput/TextInput';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { URL } from '../../../config/serverUrls';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { getPincodeDetails } from '../../../services/dealers.service';
import { validateId } from '../../../services/dealerships.service';
import { deleteTransportOwnerProfileDoc } from '../../../services/transports.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

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
  const [panValidateData, setPanValidateData] = useState({ icon: false })
  const [aadharValidateData, setAadharValidateData] = useState({ icon: false })
  const [fileType, setFileType] = useState('');
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const [selectedDate, setSelectedDate] = useState(rowData?.dob && parse(rowData?.dob, 'dd-MM-yyyy', new Date()));
  const handleValidate = (action, id, data) => {
    if (action === 'pan' ? id : id && values?.first_name) {
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
            !values?.address && setFieldValue('address', `${res?.details?.address?.buildingName}, ${res?.details?.address?.streetName}, ${res?.details?.address?.city}, ${res?.details?.address?.state} - ${res?.details?.address?.pinCode}`)
          } else {
            setAadharValidateData({ icon: true, loading: false, idType: 'AADHAR', details: res?.details || {}, is_verified: res?.is_verified })
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
          action === 'pan' && setPanValidateData({ icon: true, idType: 'PAN' })
          action === 'aadhar' && setAadharValidateData({ icon: true, idType: 'AADHAR' })
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
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date();
  const queryClient = useQueryClient()
  const currentYear = date.getFullYear();
  const currentYearDiff = date.getFullYear() - 1970;

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
      address: Yup.string()
        .required('Please enter address')
        .nullable('Please enter address')
        .test('Invalid characters', 'Invalid characters', value => !/[_#$%^&*@()<>!~{}=:;"'?]/.test(value)),
      pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
      pan: Yup.string().nullable('Enter PAN').matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN').required('Enter PAN').uppercase(),
      city: Yup.string().nullable('Enter City').required('Enter City'),
      state: Yup.string().nullable('Enter State').required('Enter State'),
      aadhar: Yup.string().nullable('Enter GST').matches(/^(\d{12})$|^(\d{16})$/, 'Invalid aadhar').required('Enter valid aadhar'),
    }),
    onSubmit: (values) => {
      if (isAdd === 'Add') {
        handleValidate('pan', values?.pan)
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
        if (key === 'pan') {
          let pan = obj?.pan ? cryptoEncrypt(obj.pan) : obj?.pan;
          data.append(key, pan);
        }
        else if (key === 'aadhar') {
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
    if (/^[1-9][0-9]{5}$/.test(values?.pincode)) {
      getPincodeDetails(values?.pincode)
        .then(res => {
          setCity(res)
          setFieldValue('city', res[0]?.city_code)
          setFieldValue('state', res[0]?.state_code)
        })
        .catch(e => {
          console.log(e);
        })
    }
  }, [values?.pincode])

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
    <>
      {/* Drawer content */}
      <div className="grow p-4 overflow-auto">
        <>
          {readOnly ? (
            <>
              <Title order={4} mb="lg">Personal Details</Title>
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Owner ID' value={values.t_owner_id} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Date of Birth' value={values.dob} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Address' value={values.address} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='City' value={values.city_name} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Marital Status' value={values.marital_status} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Mobile' value={values.mobile} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Name' value={values.first_name} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Gender' value={values.gender} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Pincode' value={values.pincode} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='State' value={values.state_name} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Residing since' value={values.residing_since} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData title='Email' value={values.email} />
                </Grid.Col>
              </Grid>

              <Divider my="lg" />

              <Title order={4} mb="lg">KYC Details</Title>
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData
                    title='PAN'
                    value={values.pan}
                    endIcon={
                      <CustomToken variant={values?.pan_verified ? 'success' : 'error'}
                        label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'}
                        icon={values?.pan_verified ? 'tick' : 'cross'}
                      />
                    }
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <ViewData
                    title='Aadhar'
                    value={values.aadhar}
                    endIcon={
                      <CustomToken
                        variant={values?.aadhar_verified ? 'success' : 'error'}
                        label={values?.aadhar_verified ? 'VERIFIED' : 'UNVERIFIED'}
                        icon={values?.aadhar_verified ? 'tick' : 'cross'}
                      />
                    }
                  />
                </Grid.Col>
              </Grid>

              <Divider my="lg" />

              {values?.profile_image_url ||
                values?.pan_file_url ||
                values?.aadhar_f_file_url ||
                values?.aadhar_b_file_url ? (
                  <>
                    <Title order={4} mb="lg">Attachments</Title>
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
                      {values.aadhar_f_file_url && (
                        <DocAttachment
                          tooltip='View Aadhar Front'
                          imgUrl={values?.aadhar_f_file_url}
                          docName='Aadhar front'
                        />
                      )}
                      {values.aadhar_b_file_url && (
                        <DocAttachment
                          tooltip='View Aadhar Back'
                          imgUrl={values?.aadhar_b_file_url}
                          docName='Aadhar back'
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
            <form onSubmit={handleSubmit}>
              <Title order={4} mb="lg">KYC Details</Title>

              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label='PAN'
                    name='pan'
                    value={values.pan?.toUpperCase()}
                    disabled={panValidateData?.loading || values?.pan_verified}
                    error={errors.pan}
                    readOnly={readOnly}
                    onChange={handleChange}
                  // InputProps={ValidateProps(panValidateData)}
                  />

                  {!values?.pan_verified || values?.pan !== rowData?.pan ? (
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
                    label='Aadhar'
                    name='aadhar'
                    value={values.aadhar}
                    disabled={aadharValidateData?.loading || values?.aadhar_verified}
                    readOnly={readOnly}
                    error={errors.aadhar}
                    onChange={handleChange}
                  // InputProps={ValidateProps(aadharValidateData)}
                  />

                  {!values?.aadhar_verified || values?.aadhar !== rowData?.aadhar ? (
                    <Box
                      component="span"
                      className="cursor-pointer"
                      onClick={() => handleValidate('aadhar', values?.aadhar, values?.first_name)}
                    >
                      <Text fz="xs" fw="600" c="indigo.5" span>Validate Aadhar</Text>
                    </Box>
                  ) : null}

                </Grid.Col>
              </Grid>

              <Title order={4} my="lg">Personal Details</Title>
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label='First name'
                    name='first_name'
                    value={values.first_name?.toUpperCase()}
                    error={errors.first_name}
                    readOnly={readOnly}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label='Last name'
                    name='last_name'
                    readOnly={readOnly}
                    error={errors.last_name}
                    value={values.last_name?.toUpperCase()}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
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
                      value={selectedDate ? selectedDate : null}
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
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
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
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label='Address'
                    name='address'
                    readOnly={readOnly}
                    value={values.address?.toUpperCase()}
                    error={errors.address}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label="Pin code"
                    name="pincode"
                    readOnly={readOnly}
                    value={values.pincode}
                    error={errors.pincode}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
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
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label='Email'
                    name='email'
                    readOnly={readOnly}
                    error={errors.email}
                    defaultValue={values.email}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput
                    label='Mobile'
                    name='mobile'
                    value={values.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    readOnly={readOnly}
                    type='number'
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Flex h="48" align="center" justify="space-between">
                    <Text fz="xs">Mobile number on Whatsapp?</Text>
                    <Switch
                      color="indigo"
                      size="md"
                      name='checkedA'
                      checked={state.checkedA}
                      onChange={handleStateChange}
                      onLabel="Yes"
                      offLabel="No"
                    />
                  </Flex>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Flex h="48" align="center" justify="space-between">
                    <Text fz="xs">Mobile number linked with Aadhaar?</Text>
                    <Switch
                      color="indigo"
                      size="md"
                      name='checkedB'
                      checked={state.checkedB}
                      onChange={handleStateChange}
                      onLabel="Yes"
                      offLabel="No"
                    />
                  </Flex>
                </Grid.Col>
              </Grid>

              <Title order={4} my="lg">Attachments</Title>
              <Flex gap="xs" mb="lg">
                <DocAttachment
                  action={true}
                  imgUrl={values?.profile_image_url}
                  docName='Profile'
                  onUpload={() => docUpload('Profile')}
                  onDelete={() => onDocDelete({ profile_image_url: '' })}
                  disabled={!values?.profile_image_url}
                />
                <DocAttachment
                  action={true}
                  imgUrl={values?.pan_file_url}
                  docName='PAN Card'
                  onUpload={() => docUpload('PAN')}
                  onDelete={() => onDocDelete({ pan_file_url: '' })}
                  disabled={!values?.pan_file_url}
                />
                <DocAttachment
                  action={true}
                  imgUrl={values?.aadhar_f_file_url}
                  docName='Aadhar Front'
                  onUpload={() => docUpload('Front')}
                  onDelete={() => onDocDelete({ aadhar_f_file_url: '' })}
                  disabled={!values?.aadhar_f_file_url}
                />
                <DocAttachment
                  action={true}
                  imgUrl={values?.aadhar_b_file_url}
                  docName='Aadhar Back'
                  onUpload={() => docUpload('Back')}
                  onDelete={() => onDocDelete({ aadhar_b_file_url: '' })}
                  disabled={!values?.aadhar_b_file_url}
                />
              </Flex>
            </form>
          )}

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
        </>
      </div>

      {/* Sticky footer */}
      <Flex
        h="64"
        align="center"
        justify="end"
        className="bg-white shrink-0 px-4 z-[9]"
        style={{
          borderTop: '1px solid #eaeaea',
        }}
      >
        <Flex gap="sm">
          <Button
            colorScheme="secondary"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={loading}
          >
            Go back
          </Button>

          {!readOnly ? (
            <Button
              colorScheme="green"
              variant="filled"
              size="md"
              onClick={loading ? () => null : handleSubmit}
              loading={loading}
            >
              Save
            </Button>
          ) : (
            <CheckAllowed currentUser={currentUser} resource={resources_id?.transporters} action={action_id?.transporters?.editOwner}>
              <Button
                variant="filled"
                size="md"
                onClick={loading ? () => null : handleEdit}
                loading={loading}
              >
                Edit
              </Button>
            </CheckAllowed>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default AddNewTransportsOwnerForm;
