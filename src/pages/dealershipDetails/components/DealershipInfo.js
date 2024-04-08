import { Box, Card, Flex, Grid, Space, Text, Title } from '@mantine/core';
import { Tooltip, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Sync } from '@material-ui/icons';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import CrimeInfoSideWrapper from './CrimeInfoSideWrapper';
import { DocAttachment } from '../../../components/Attachment/DocAttachment';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import { Button } from '../../../components/Mantine/Button/Button';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import TextInput from '../../../components/TextInput/TextInput';
import TextInputMask from '../../../components/TextInput/TextInputMask';
import { action_id, resources_id } from '../../../config/accessControl';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { getBusinessTypes, getRegionById, getActiveStates, getOmcList, getUdyamVerified } from '../../../services/common.service';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { deleteDealershipDocument, getDealershipLoansById, validateId } from '../../../services/dealerships.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

const DealershipInfo = ({ viewOnly = true, setViewOnly = () => { }, data, currentUser, isLoading }) => {
  const [readOnly, setReadOnly] = useState(viewOnly);
  const [loading, setLoading] = useState();
  const [showUpload, setShowUpload] = useState(false);
  const [udyamQuery, setUdyamQuery] = useState({ isLoading: false, data: {} });
  const [panValidateData, setPanValidateData] = useState({ icon: false })
  const [gstValidateData, setGstValidateData] = useState({ icon: false })
  const [dataJSON, setDataJSON] = useState({ gst: {}, udyam: {} })
  const [omcs, setOmcs] = useState([])
  const [fileType, setFileType] = useState('');
  const [crimeData, setCrimeData] = useState();
  const businessTypes = useQuery('business-types', getBusinessTypes, { cacheTime: 300000 })
  const states = useQuery('state', getActiveStates, { cacheTime: 300000 })
  const { data: loanData = [], isLoading: loanDataLoading } = useQuery(
    ['dealership-loans', data?.id],
    () => getDealershipLoansById(data?.id),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(data?.id),
      select: (data) => {
        return data?.[0] || {}
      }
    }
  );
  const { enqueueSnackbar } = useSnackbar();

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
    if (viewOnly !== readOnly) {
      setReadOnly(viewOnly);
    }
  }, [viewOnly])
  console.log(readOnly);
  console.log(viewOnly);
  useEffect(() => {
    setValues(data)
    setDataJSON({ gst: data?.gst_verified ? JSON.parse(data?.gst_details) || {} : {}, udyam: data?.udyam_verified ? JSON.parse(data?.udyam_details) || {} : {} })
  }, [data])
  const { values, errors, handleChange: onChange, handleSubmit, setFieldValue, setValues, validateField } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable('Please enter dealership name').required('Please enter Dealership name').matches(/^[aA-zZ.,&/-\s]+$/, 'Only alphabets are allowed for this field ').max(50),
      address: Yup.string()
        .nullable('Please enter address')
        .required('Please enter address')
        .test('Invalid characters', 'Please don\'t use _ # $ % ^ & * @ ( ) < > ! ~ { } = : ; " ? ', value => !/[_#$%^&*@()<>!~{}=:;"?]/.test(value)),
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
      values.name = values?.name?.toUpperCase();
      values.gst = values?.gst?.toUpperCase();
      values.pan = values?.pan?.toUpperCase();
      values.udyam_no = values?.udyam_no?.toUpperCase();
      const date_values = {
        ...values,
        name: values?.name?.toUpperCase(),
        gst: values?.gst?.toUpperCase(),
        pan: values?.pan?.toUpperCase(),
        udyam_no: values?.udyam_no?.toUpperCase(),
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
            setReadOnly(true);
            setViewOnly(true);
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
            setViewOnly(true);
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
          setViewOnly(true);
          logger(e);
        })
    }
  });
  const getRegion = useQuery(['region', values?.state], () => getRegionById(parseInt(values?.state || 1)))

  const getUDYAMDetails = () => {
    if (values?.udyam_no) {
      setUdyamQuery({ isLoading: true, data: {}, icon: true });
      getUdyamVerified({ udyam_no: values?.udyam_no })
        .then((res) => {
          setUdyamQuery({ isLoading: false, data: res?.[0]?.details, isVerified: res?.[0]?.is_verified });
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
          setUdyamQuery({ isLoading: false, data: {} });
        });
    }
  }

  const docUpload = (val) => {
    setShowUpload(true);
    setFileType(val);
  };
  const onCloseUploader = () => {
    setShowUpload(false);
  };
  const handleSave = (value) => {
    setFieldValue(fileType === 'PAN' ? 'pan_file_url' : fileType === 'GST' ? 'gst_file_url' : 'udyam_file_url', value[0])
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

  const ValidateUdyamProps = (valid, verified) => {
    if (verified && !valid?.isLoading) {
      return ({
        endAdornment: <div style={{ marginRight: 6, marginTop: 4, cursor: 'pointer' }}>
          <Tooltip title={'Click to refetch the details'}>
            <Sync onClick={getUDYAMDetails} fontSize='small' style={{ color: 'gray' }} />
          </Tooltip>
        </div>
      })
    }
    return ({
      endAdornment: <div style={{ marginRight: 6, marginTop: 4, cursor: 'pointer' }}>
        {
          valid?.icon
            ? valid?.isLoading
              ? <CircularProgress size={15} />
              : valid?.data?.is_verified
                ? <Tooltip title={`Valid ${valid.idType}`} ><CheckCircleOutlineOutlinedIcon fontSize='small' style={{ color: '#4caf50' }} /></Tooltip>
                : <Tooltip title={`Invalid ${valid.idType}`} ><CancelOutlinedIcon fontSize='small' color='error' /></Tooltip> : null
        }
      </div>
    })
  }
  return (
    <>
      {readOnly ? (
        <>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                title='Name'
                value={values?.name}
                loading={isLoading}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='State'
                value={(states?.data?.find(function (state) {
                  if (state.id == values?.state)
                    return true;
                }))?.name}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='Business type'
                value={businessTypes.data?.find(function (type, index) {
                  if (type.id == values?.business_type)
                    return true;
                })?.name}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='Address'
                value={values?.address ? values.address + '' : '' + (values?.pincode ? values?.pincode : '')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='Region'
                value={values?.region_name}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='OMC'
                value={omcs?.find(item => { return item?.id === values?.omc })?.name}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='PAN'
                value={values?.pan}
                endIcon={
                  <CustomToken
                    variant={values?.pan_verified ? 'success' : 'error'}
                    label={values?.pan_verified ? 'VERIFIED' : 'UNVERIFIED'}
                    icon={values?.pan_verified ? 'tick' : 'cross'}
                  />
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='GST'
                value={values?.gst}
                endIcon={<CustomToken variant={values?.gst_verified ? 'success' : 'error'}
                  label={values?.gst_verified ? 'VERIFIED' : 'UNVERIFIED'}
                  icon={values?.gst_verified ? 'tick' : 'cross'} />}
              />
            </Grid.Col>

            {values?.gst_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Legal Business Name'
                  value={dataJSON?.gst?.lgnm}
                />
              </Grid.Col>
            ) : null}

            {values?.gst_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Taxpayer Type'
                  value={dataJSON?.gst?.dty}
                />
              </Grid.Col>
            ) : null}

            {values?.gst_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='GSTIN Status'
                  value={dataJSON?.gst?.sts}
                />
              </Grid.Col>
            ) : null}

            {values?.gst_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Effective Date of registration'
                  value={dataJSON?.gst?.rgdt}
                />
              </Grid.Col>
            ) : null}

            {values?.gst_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Legal Trade Name'
                  value={dataJSON?.gst?.tradeNam}
                />
              </Grid.Col>
            ) : null}

            {data?.renewal_fee_payment_status ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Renewal Fee Status'
                  value={data?.renewal_fee_payment_status?.toUpperCase()}
                />
              </Grid.Col>
            ) : null}

            <Grid.Col>
              <Title order={3}>Udyam Details</Title>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              {values?.udyam_verified ? <ViewData
                loading={isLoading}
                title='UDYAM No.'
                value={dataJSON?.udyam?.udyamRegistrationNo}
              /> : '-'}
            </Grid.Col>

            {values?.udyam_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Name of Enterprise'
                  value={dataJSON?.udyam?.profile?.name}
                />
              </Grid.Col>
            ) : null}

            {values?.udyam_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Organization Type'
                  value={dataJSON?.udyam?.profile?.organizationType}
                />
              </Grid.Col>
            ) : null}

            {values?.udyam_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Gender'
                  value={dataJSON?.udyam?.profile?.gender}
                />
              </Grid.Col>
            ) : null}

            {values?.udyam_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Date of Incorporation'
                  value={dataJSON?.udyam?.profile?.dateOfIncorporation}
                />
              </Grid.Col>
            ) : null}

            {values?.udyam_verified ? (
              <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
                <ViewData
                  loading={isLoading}
                  title='Classification Year'
                  value={dataJSON?.udyam?.enterpriseType?.[0]?.classificationYear}
                />
              </Grid.Col>
            ) : null}
          </Grid>

          {values?.pan_file_url || values?.gst_file_url ? (
            <Box mt="sm">
              <Title order={3} mb="md">Attachments</Title>

              <Flex gap="xs">
                {values.pan_file_url && (
                  <DocAttachment
                    tooltip='View PAN'
                    imgUrl={values?.pan_file_url}
                    docName='PAN Card'
                  />
                )}
                {values.gst_file_url && (
                  <DocAttachment
                    tooltip='View GST'
                    imgUrl={values?.gst_file_url}
                    docName='GST'
                  />
                )}
                {values.udyam_file_url && (
                  <DocAttachment
                    tooltip='View UDYAM'
                    imgUrl={values?.udyam_file_url}
                    docName='UDYAM'
                  />
                )}
              </Flex>
            </Box>
          ) : (
            <Box mt="sm">
              <Title order={3} mb="xs">Attachments</Title>
              <Text fz="xs" c="gray.6">No Attachments Found!</Text>
            </Box>
          )}
        </>
      ) : (
        <>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                labelText="Name"
                name="name"
                readOnly={readOnly}
                value={values?.name?.toUpperCase()}
                error={errors.name}
                helperText={errors.name}
                {...fieldProps}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                labelText="GST"
                name="gst"
                readOnly={readOnly}
                disabled={gstValidateData?.loading || (values?.gst_verified && (currentUser.role_id !== 1))}
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                labelText="PAN"
                name="pan"
                readOnly={readOnly}
                disabled={panValidateData?.loading || (values?.pan_verified && (currentUser.role_id !== 1))}
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInput
                labelText="Address"
                name="address"
                readOnly={readOnly}
                disabled={readOnly}
                value={values?.address}
                error={errors.address}
                helperText={errors.address}
                {...fieldProps}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
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

            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <TextInputMask
                mask={'UDYAM-aa-99-9999999'}
                maskChar={' '}
                labelText="UDYAM / UAM No."
                name="udyam_no"
                readOnly={readOnly}
                disabled={udyamQuery?.isLoading || values?.udyam_verified}
                value={values?.udyam_no?.toUpperCase()}
                error={errors.udyam_no}
                helperText={errors.udyam_no}
                InputProps={ValidateUdyamProps(udyamQuery, values?.udyam_verified)}
                {...fieldProps}
              />
              {
                !values?.udyam_verified || values?.udyam_no !== data?.udyam_no ?
                  <Typography variant="caption" style={{ color: 'blue', cursor: 'pointer' }} onClick={() => { !udyamQuery?.isLoading && getUDYAMDetails() }}>Validate Udyam</Typography> : null
              }
            </Grid.Col>
          </Grid>

          <Space h="xl" />

          {dataJSON?.gst?.gstin || gstValidateData?.details ? (
            <Card padding="lg" radius="md" withBorder mb="xl">
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={600}>GST Details</Text>
              </Card.Section>

              <Grid mt="lg" gutter="lg">
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Effective Date of registration' value={dataJSON?.gst?.rgdt || gstValidateData?.details?.rgdt} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Taxpayer Type' value={dataJSON?.gst?.dty || gstValidateData?.details?.dty} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Legal Business Name' value={dataJSON?.gst?.lgnm || gstValidateData?.details?.lgnm} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='GSTIN Status' value={dataJSON?.gst?.sts || gstValidateData?.details?.sts} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Legal Trade Name' value={dataJSON?.gst?.tradeNam || gstValidateData?.details?.tradeNam} />
                </Grid.Col>
              </Grid>
            </Card>
          ) : null}

          {dataJSON?.udyam?.profile || udyamQuery?.data?.profile ? (
            <Card padding="lg" radius="md" withBorder mb="xl">
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={600}>UDYAM Details</Text>
              </Card.Section>

              <Grid mt="lg" gutter="lg">
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Name of Enterprise' value={udyamQuery?.data?.profile?.name || dataJSON?.udyam?.profile?.name} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Organization Type' value={udyamQuery?.data?.profile?.organizationType || dataJSON?.udyam?.profile?.organizationType} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Gender' value={udyamQuery?.data?.profile?.gender || dataJSON?.udyam?.profile?.gender} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Date Of Incorporation' value={udyamQuery?.data?.profile?.dateOfIncorporation || dataJSON?.udyam?.profile?.dateOfIncorporation} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='Major Activity' value={udyamQuery?.data?.profile?.majorActivity || dataJSON?.udyam?.profile?.majorActivity} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <ViewData title='classification Year' value={udyamQuery?.data?.enterpriseType?.[0]?.classificationYear || dataJSON?.udyam?.enterpriseType?.[0]?.classificationYear} />
                </Grid.Col>
              </Grid>
            </Card>
          ) : null}


          <Title order={3} mb="md">Attachments</Title>
          <Flex gap="sm">
            <DocAttachment
              action={true}
              imgUrl={values?.pan_file_url}
              docName='PAN Card'
              onUpload={() => docUpload('PAN')}
              onDelete={() => onDocDelete({ pan_file_url: '' })}
              disabled={!values?.pan_file_url}
              style={{ marginRight: 15 }}
            />

            <DocAttachment
              action={true}
              imgUrl={values?.gst_file_url}
              docName='GST'
              onUpload={() => docUpload('GST')}
              onDelete={() => onDocDelete({ gst_file_url: '' })}
              disabled={!values?.gst_file_url}
              style={{ marginRight: 15 }}
            />

            <DocAttachment
              action={true}
              imgUrl={values?.udyam_file_url}
              docName='UDYAM'
              onUpload={() => docUpload('UDYAM')}
              onDelete={() => onDocDelete({ udyam_file_url: '' })}
              disabled={!values?.udyam_file_url}
              style={{ marginRight: 15 }}
            />
          </Flex>
        </>
      )}


      {showUpload && (
        <FileUpload
          handleSave={(value) => handleSave(value)}
          id={values.id}
          title='Upload Dealership Documents'
          open={showUpload}
          onCloseUploader={onCloseUploader}
        />
      )}

      {!readOnly ? (
        <Flex gap="sm" mt="xl">
          <Button
            variant="outline"
            color="gray"
            onClick={() => { setReadOnly(true); setViewOnly(true); }}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            loading={isLoading}
          >
            Save
          </Button>
        </Flex>
      ) : (
        <Flex gap="sm" mt="xl">
          <Button
            variant="outline"
            color="gray"
            onClick={() => { setReadOnly(false); setViewOnly(false); }}
          >
            Edit Details
          </Button>

          <CheckAllowed currentUser={currentUser} resource={resources_id?.dealership} action={action_id?.dealership?.crimeCheck}>
            <Button onClick={() => setCrimeData({ ...crimeData, category: 'dealership', id: data?.id, first_name: data?.name })}>
              Crime check
            </Button>
          </CheckAllowed>
        </Flex>
      )}

      <RightSideDrawer
        opened={crimeData}
        onClose={() => setCrimeData()}
        title={`Credit Information (${data?.pan || '-'})`}
      >
        <CrimeInfoSideWrapper
          dealershipId={data?.id}
          data={crimeData}
          currentUser={currentUser}
          onClose={() => setCrimeData()}
        />
      </RightSideDrawer>
    </>
  );
};

export default DealershipInfo;
