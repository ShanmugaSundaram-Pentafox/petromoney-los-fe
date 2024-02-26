import { Box, Flex, Stack } from '@mantine/core';
import { green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import Alert from '@material-ui/lab/Alert';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import DealerEditForm from './DealerEditForm';
import { Button } from '../../../components/Mantine/Button/Button';
import { Modal } from '../../../components/Mantine/Modal/Modal';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { API } from '../../../config/api';
import { logger } from '../../../config/logger';
import { getKycAgents, getKycStatus, initiateKYC } from '../../../services/dealers.service';
import { validateId } from '../../../services/dealerships.service';
import { addApplicants } from '../../../services/fileUpload.service';
import { isAllowed } from '../../../utils/cerbos';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

const DealerEditSideWrapper = ({
  modelType,
  dealersList,
  isAdd,
  dealershipId,
  data,
  currentUser,
  onClose,
  id,
}) => {
  const queryClient = useQueryClient()
  const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedState, setSelectedState] = useState();
  const [panValidateData, setPanValidateData] = useState({ icon: false })
  const [aadharValidateData, setAadharValidateData] = useState({ icon: false })
  const [kycStatus, setKycStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState();
  const [agentIdList, setAgentIdList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  const handleEdit = () => {
    setReadOnly(!readOnly);
  };

  useEffect(() => {
    if (isAllowed(currentUser?.permissions, resources_id.dealer, action_id.dealer.Vkyc)) {
      getKycStatus(modelType.toLowerCase(), values.dealership_id, values.id)
        .then((data) => {
          if (data?.is_initiated === 1)
            setKycStatus(true);
        })
        .catch((e) => {
          console.log(e)
        })
      if (open) {
        getKycAgents()
          .then((data) => {
            setAgentIdList(data)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }, [modelType, data.dealership_id, data.id, open])


  let coApplicantFields = {};
  if (modelType === 'COAPPLICANT') {
    coApplicantFields = {
      relation_to: Yup.number().nullable('Enter Relation').required('Enter Relation'),
      relationship: Yup.number().nullable('Enter Relationship type').required('Enter Relationship Type'),
    };
  }

  let adminFields = {};
  if (currentUser?.role_id != 1) {
    adminFields = {
      pan: Yup.string()
        .required('Enter PAN')
        .nullable('Enter PAN')
        .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
        .uppercase(),
    }
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().nullable('Enter first name').required('Enter first name'),
    last_name: Yup.string().nullable('Enter last name').required('Enter last name'),
    father_name: Yup.string().nullable('Enter your father\'s name').required('Enter your father\'s name'),
    gender: Yup.string().nullable('Choose gender').required('Enter gender'),
    email: Yup.string().nullable('Enter email').email('Invalid email').required('Enter email'),
    city: Yup.string().nullable('Enter City').required('Enter City'),
    state: Yup.string().nullable('Enter State').required('Enter State'),
    address: Yup.string()
      .required('Enter address')
      .nullable('Enter address')
      .min(6, 'address must be atleast 6 characters')
      .test('Invalid characters', 'Please don\'t use _ # $ % ^ & * @ ( ) < > ! ~ { } = : ; " ? ', value => !/[_#$%^&*@()<>!~{}=:;"?]/.test(value)),
    mobile: Yup.string()
      .nullable('Enter mobile number')
      .matches(/^\d{10}$/, 'Invalid mobile number')
      .required('Enter valid mobile number'),
    residing_since: Yup.number().nullable('Enter the year').required('Enter the year'),
    marital_status: Yup.string().nullable('Enter your Marital status').required('Enter your Marital status'),
    pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
    aadhar: Yup.string()
      .nullable('Enter Aadhar')
      .matches(/^(\d{12})$|^(\d{16})$/, 'Invalid aadhar')
      .required('Enter valid aadhar'),
    pan: Yup.string()
      .nullable('Enter PAN')
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
      .uppercase(),
    ...coApplicantFields,
    ...adminFields,
  });

  const handleIdChange = (e) => {
    const { value } = e.target;
    setAgentId({ ...agentId, value: value })
  }

  const deleteFile = (type) => {
    const allTypes = {
      PAN: 'pan_file_url',
      AADHAR_FRONT: 'aadhar_f_file_url',
      AADHAR_BACK: 'aadhar_b_file_url',
    };
    const urlType = allTypes[type];
    let file = '';
    let fileData = data[urlType];
    if (typeof fileData === 'string') {
      file = fileData;
    }
    let url = `dealers/${data.dealership_id}`;
    if (data.id) {
      url += `/${data.id}`;
    }
    API.delete(url, { type, file })
      .then((res) => {
        onClose();
        queryClient.invalidateQueries(['dealers-coapplicant', id])
      })
      .catch((err) => {
        setReadOnly(true);
        logger(err);
      });
  };
  const handleSave = (value, fileType) => {
    if (fileType === 'PAN') {
      setFieldValue('pan_file_url', value[0]);
    } else if (fileType === 'AADHAR') {
      setFieldValue('aadhar_file_url', value[0]);
    } else {
      setFieldValue('profile_image_url', value[0]);
    }
  };

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    validateField
  } = useFormik({
    initialValues: {
      ...data, state: data?.state_code, state_name: data?.state, city_name: data?.city, city: data?.city_name
    },
    onReset: (values, e) => {
      setReadOnly(true);
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      setLoading(true);
      if (isAdd === 'Add') {
        validateId('pan', values?.pan)
          .then((res) => {
            setPanValidateData({ icon: true, loading: false, idType: 'PAN', details: res?.details || {} })
            !values?.first_name && setFieldValue('first_name', res?.details?.firstName)
            !values?.last_name && setFieldValue('last_name', res?.details?.lastName)
            res?.details?.dob && setSelectedDate(parse(res?.details?.dob, 'yyyy-MM-dd', new Date()))
            !values?.gender && setFieldValue('gender', res?.details?.gender?.toUpperCase())
            !values?.pincode && setFieldValue('pincode', res?.details?.address?.pinCode)
            !values?.address && setFieldValue('address', `${res?.details?.address?.buildingName}, ${res?.details?.address?.streetName}, ${res?.details?.address?.city}, ${res?.details?.address?.state} - ${res?.details?.address?.pinCode}`)
          })
          .catch(e => {
            console.log(e);
            setPanValidateData({ icon: true, idType: 'PAN' })
          })
      }
      const dob = selectedDate ? format(new Date(selectedDate), 'dd-MM-yyyy') : values.dob ? values.dob : null
      const date_values = { ...values, dob: dob, pan: values.pan.toUpperCase(), is_whatsapp: selectedState.checkedA === true ? 1 : 0, is_aadhar_linked: selectedState.checkedB === true ? 1 : 0, category: modelType };
      let commonObj = { category: modelType }
      if (date_values?.pan_file_url != data?.pan_file_url) {
        commonObj = { ...commonObj, pan: data?.pan }
      }
      if (date_values?.aadhar_file_url != data?.aadhar_file_url) {
        commonObj = { ...commonObj, aadhar: data?.aadhar }
      }
      if (date_values?.aadhar != data?.aadhar) {
        commonObj = { ...commonObj, aadhar_file_url: data?.aadhar_file_url }
      }
      if (date_values?.pan != data?.pan) {
        commonObj = { ...commonObj, pan_file_url: data?.pan_file_url }
      }
      const resultObj = data?.id ? compareObject(data, date_values, commonObj) : date_values
      let apiUrl = `applicant/${dealershipId}`;
      if (date_values?.id) {
        apiUrl += `/${date_values?.id}`;
      }
      addApplicants(resultObj, currentUser, apiUrl, data?.id)
        .then((message) => {
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          onClose()
          queryClient.invalidateQueries(['dealership-applicants', id])
        })
        .catch((err) => {
          setLoading(false);
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    },
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const handleClose = () => {
    setOpen(!open);
    setAgentId({})
  };

  const handleInitiateKYC = () => {
    if (agentId?.value) {
      initiateKYC(modelType.toLowerCase(), values.dealership_id, values.id, agentId?.value)
        .then((message) => {
          setKycStatus(true);
          handleClose();
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          logger(err);
        })
    }
    else {
      setAgentId({ ...agentId, error: 'Please choose agent to initiate VKYC' })
    }
  }

  return (
    <>
      {/* Drawer content */}
      <div className="grow p-4 overflow-auto">
        <DealerEditForm
          dealersList={dealersList}
          deleteFile={deleteFile}
          readOnlyProps={readOnly}
          modelType={modelType}
          data={data}
          handleDate={handleDateChange}
          handleState={handleStateChange}
          values={values}
          errors={errors}
          onChange={handleChange}
          handleSave={handleSave}
          setFieldValue={setFieldValue}
          setPanValidateData={setPanValidateData}
          panValidateData={panValidateData}
          setAadharValidateData={setAadharValidateData}
          aadharValidateData={aadharValidateData}
          validateField={validateField}
          currentUser={currentUser}
          id={id}
          onClose={onClose}
        />
      </div>  
      
      {/* Sticky footer */}
      <Flex
        h="64"
        align="center"
        justify="end"
        gap="sm"
        className="bg-white shrink-0 px-4 z-[9]"
        style={{
          borderTop: '1px solid #eaeaea',
        }}
      >
        {!readOnly ? (
          <>
            <Button
              colorScheme="secondary"
              variant="outline"
              size="md"
              // startIcon={<NavigateBeforeRoundedIcon />}
              disabled={loading}
              onClick={onClose}
            >
              Go back
            </Button>

            <Button
              colorScheme="primary"
              variant="filled"
              size="md"
              // startIcon={!readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />}
              onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
              disabled={loading}
              loading={loading}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              colorScheme="secondary"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Go back
            </Button>

            {kycStatus ? (
              <div style={{ display: 'flex', alignItems: 'center', marginRight: 12, backgroundColor: green[100], padding: 4, paddingRight: 12, borderRadius: 14 }}>
                <CheckRoundedIcon style={{ color: green[400], marginRight: 8 }} />
                <Typography style={{ color: green[800] }}>VKYC already initiated</Typography>
              </div>
            ) : (
              <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.Vkyc}>
                <Button
                  colorScheme="primary"
                  variant="filled"
                  size="md"
                  disabled={loading}
                  onClick={handleClose}
                >
                  Initiate VKYC
                </Button>
              </CheckAllowed>
            )}

            <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerEdit}>
              <Button
                colorScheme="primary"
                variant="filled"
                size="md"
                // startIcon={!readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />}
                onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
                disabled={loading}
              >
                Edit
              </Button>
            </CheckAllowed>
          </>
        )}
      </Flex>

      <Modal
        open={open}
        close={handleClose}
        title="Initiate VKYC"
        centered
      >
        <Stack mih="320" gap="md">
          <Box py="xs">
            <TextInput
              select
              label='Choose Agent'
              value={agentId?.value}
              onChange={handleIdChange}
              InputLabelProps={{ shrink: true }}
            >
              {<option value={' '}>choose agent</option>}
              {agentIdList.length && agentIdList?.map((item, i) => {
                return (
                  <option key={i} value={item?.id}>{item?.name}</option>
                )
              })}
            </TextInput>
          </Box>

          {agentId?.error && (
            <Alert 
              severity="error" 
              style={{ padding: '0px 16px', marginTop: 12 }}
            >
              {agentId?.error}
            </Alert>
          )}

          <Flex
            align="center"
            justify="end"
            gap="xs"
            mt="auto"
          >
            <Button 
              colorScheme="secondary"
              variant="outline"
              size="md"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button 
              colorScheme="primary"
              variant="filled"
              size="md"
              onClick={kycStatus ? () => null : handleInitiateKYC}
            >
              Initiate Video KYC
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};

export default DealerEditSideWrapper;
