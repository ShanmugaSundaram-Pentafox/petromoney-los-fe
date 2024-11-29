import { Box, Card, Flex, Grid, LoadingOverlay, Space, Text, Title } from '@mantine/core';
import { Tooltip, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Sync } from '@material-ui/icons';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
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
import { deleteDocsImage, getDealershipCheckList, getDealershipLoansById, validateId } from '../../../services/dealerships.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';

const DealershipInfo = ({ viewOnly = true, setViewOnly = () => { }, data, currentUser, isLoading }) => {
  const queryClient = useQueryClient()
  const [readOnly, setReadOnly] = useState(viewOnly);
  const [loading, setLoading] = useState();
  const [showUpload, setShowUpload] = useState({ modal: false });
  const [udyamQuery, setUdyamQuery] = useState({ isLoading: false, data: {} });
  const [panValidateData, setPanValidateData] = useState({ icon: false })
  const [gstValidateData, setGstValidateData] = useState({ icon: false })
  const [dataJSON, setDataJSON] = useState({ gst: {}, udyam: {} })
  const [omcs, setOmcs] = useState([])
  const [crimeData, setCrimeData] = useState();
  const businessTypes = useQuery('business-types', getBusinessTypes, { cacheTime: 300000 })
  const states = useQuery('state_id', getActiveStates, { cacheTime: 300000 })
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

  const { data: checkListData = [], isLoading: checklistLoading } = useQuery(
    ['doc-checklist-kyc', data?.id],
    () => getDealershipCheckList(data?.id),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        // const allowedFile = {
        //   gst: data?.find(i => (i?.kyc_file_name === 'gst_file_url' && i?.document_category === 'dealership_kyc')),
        //   udyam: data?.find(i => (i?.kyc_file_name === 'udyam_file_url' && i?.document_category === 'dealership_kyc')),
        //   pan: data?.find(i => (i?.kyc_file_name === 'dealership_pan_file_url' && i?.document_category === 'dealership_kyc')),
        // }
        // return allowedFile;
        return data?.filter(i => i?.document_category === 'dealership_kyc');
      }
    }
  )

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

  useEffect(() => {
    setValues(data)
    setDataJSON({ gst: data?.gst_verified ? JSON.parse(data?.gst_details) || {} : {}, udyam: data?.udyam_verified ? JSON.parse(data?.udyam_details) || {} : {} })
  }, [data])
  const { values, errors, handleChange: onChange, handleSubmit, setFieldValue, setValues, validateField } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable('Please enter dealership name').required('Please enter dealership name').max(200),
      address: Yup.string()
        .nullable('Please enter address')
        .required('Please enter address')
        .test('Invalid characters', 'Please don\'t use _ # $ % ^ & * @ ( ) < > ! ~ { } = : ; " ? ', value => !/[_#$%^&*@()<>!~{}=:;"?]/.test(value)),
      state_id: Yup.string().nullable('Please choose state').required('Please choose state'),
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
        }
        else if (key === 'state_id'){
          formData.append('state', values?.state_id)
          formData.append('state_id', values?.state_id)
        }
        else if (key === 'region_id'){
          formData.append('region', values?.region_id)
          formData.append('region_id', values?.region_id)
        }
        else if (key === 'business_type_id'){
          formData.append('business_type', values?.business_type_id)
          formData.append('business_type_id', values?.business_type_id)
        }
        else {
          console.log('KEY : ', key)
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
            displayNotification({
              message: message,
              variant: 'success'
            })
            setTimeout(() => {
              window.location.reload()
            }, 1500);
            setReadOnly(true);
            setViewOnly(true);
            setLoading(false);
          }
          else {
            displayNotification({
              message: message,
              variant: 'error'
            })
            setLoading(false);
            setReadOnly(true);
            setViewOnly(true);
          }
        })
        .catch(e => {
          displayNotification({
            message: e.message,
            variant: 'error'
          })
          setLoading(false);
          setReadOnly(true);
          setViewOnly(true);
          logger(e);
        })
    }
  });
  const getRegion = useQuery(['region_id', values?.state_id], () => getRegionById(parseInt(values?.state_id || 1)))

  const getUDYAMDetails = () => {
    if (values?.udyam_no) {
      setUdyamQuery({ isLoading: true, data: {}, icon: true });
      getUdyamVerified({ body: { udyam_no: values?.udyam_no, dealership_id: data?.id } })
        .then((res) => {
          setUdyamQuery({ isLoading: false, data: res?.[0]?.details, isVerified: res?.[0]?.is_verified });
        })
        .catch((err) => {
          displayNotification({
            message: err,
            variant: 'error'
          })
          setUdyamQuery({ isLoading: false, data: {} });
        });
    }
  }

  const docUpload = (data) => {
    setShowUpload({ modal: true, value: data });
  };
  const onCloseUploader = () => {
    setShowUpload({ modal: false });
  };
  const handleSave = (value) => {
    const formData = new FormData();
    const dealerShipId = data?.id;
    const docID = showUpload?.value;
    value.map(file => {
      const fileName = file.name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('id', docID);
    });

    fetch(`${URL.base}${URL.checklist}/${dealerShipId}/doc/${docID}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    }).then(res => res?.json())
      .then(data => {
        if (data?.status?.toLowerCase() === 'error') {
          displayNotification({
            message: data?.message,
            variant: 'error'
          })
        } else {
          displayNotification({
            message: 'Document Uploaded Successfully',
            variant: 'success'
          })
        }
        onCloseUploader();
      })
      .catch(() => {
        displayNotification({
          message: 'File Upload Failed',
          variant: 'error'
        })
      })
      .finally(() => {
        queryClient.invalidateQueries(['doc-checklist-kyc', data?.id])
        queryClient.invalidateQueries(['doc-checklist', data?.id])
      })

    onCloseUploader();
  };
  const onDocDelete = ({ docId, fileId }) => {
    deleteDocsImage({ id: [fileId], doc_id: docId }, data?.id)
      .then(() => {
        displayNotification({
          message: 'Document Deleted Successfully',
          variant: 'success'
        })
      })
      .catch((E) => {
        displayNotification({
          message: E,
          variant: 'error'
        })
      })
      .finally(() => {
        queryClient.invalidateQueries(['doc-checklist-kyc', data?.id])
        queryClient.invalidateQueries(['doc-checklist', data?.id])
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
                value={(states?.data?.find(function (state_id) {
                  if (state_id.id == values?.state_id)
                    return true;
                }))?.name}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <ViewData
                loading={isLoading}
                title='Business type'
                value={businessTypes.data?.find(function (type, index) {
                  if (type.id == values?.business_type_id)
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
          {(checkListData?.filter((i) => i?.file_data?.[0]?.file_url)?.length) ? (
            <Box mt="sm">
              <Title order={3} mb="md">Attachments</Title>
              <Flex gap="xs">
                {checkListData?.filter((i) => i?.file_data?.[0]?.file_url)?.map((item, index) => (
                  <DocAttachment
                    key={`${item?.doc_name}-${index}`}
                    tooltip={`View ${item?.description?.replace(/_/g, ' ')}`}
                    imgUrl={item?.file_data?.[0]?.file_url}
                    docName={item?.description?.replace(/_/g, ' ')}
                  />
                ))}
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
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} style={{position: 'fixed'}}/>
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
                name="business_type_id"
                readOnly={readOnly}
                disabled={readOnly}
                defaultValue={values?.business_type_id}
                error={errors.business_type_id}
                helperText={errors.business_type_id}
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
                name="state_id"
                readOnly={readOnly}
                disabled={readOnly}
                value={values?.state_id}
                error={errors.state_id}
                helperText={errors.state_id}
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
                  name="region_id"
                  value={values?.region_id}
                  readOnly={readOnly}
                  disabled={readOnly}
                  error={errors.region_id}
                  helperText={errors.region_id}
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
            {checkListData?.map((item, index) => (
              <DocAttachment
                key={`${item?.doc_name}-${index}`}
                action={true}
                imgUrl={item?.file_data?.[0]?.file_url}
                docName={item?.doc_name}
                tooltip={item?.doc_name}
                onUpload={() => docUpload(item?.doc_id)}
                onDelete={() => onDocDelete({ docId: item?.doc_id, fileId: item?.file_data?.[0]?.file_id })}
                disabled={!item?.file_data?.[0]?.file_url}
                style={{ marginRight: 15 }}
              />
            ))}
          </Flex>
        </>
      )}


      {showUpload?.modal && (
        <FileUpload
          handleSave={(value) => handleSave(value)}
          id={values.id}
          title='Upload Dealership Documents'
          open={showUpload?.modal}
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
          >
            Save
          </Button>
        </Flex>
      ) : (
        <Flex gap="sm" mt="xl">
          <CheckAllowed currentUser={currentUser} resource={resources_id?.dealership} action={action_id?.dealership?.edit}>
            <Button
              variant="outline"
              color="gray"
              onClick={() => { setReadOnly(false); setViewOnly(false); }}
            >
              Edit Details
            </Button>
          </CheckAllowed>

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
