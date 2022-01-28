import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import DealerEditForm from './DealerEditForm';
import { API } from '../../../config/api';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { compareObject } from '../../../utils/compareObject.util';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  stepperRoot: {
    padding: 16,
    paddingRight: 0,
    paddingTop: 8,
  },
  stepTitle: {
    '& .MuiStepLabel-label.MuiStepLabel-active': {
      fontSize: 15,
      fontWeight: 600,
    },
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
}));

const DealerEditSideWrapper = ({
  modelType,
  dealersList,
  isAdd,
  dealershipId,
  getDealerApiCall,
  data,
  currentUser,
  onClose,
  id,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apicallStatus, setApicallStatus] = useState(null);
  const [apiCallMessage, setApiCallMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState();
  const [selectedState, setSelectedState] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = () => {
    setReadOnly(!readOnly);
  };

  let coApplicantFields = {};
  if (modelType === 'COAPPLICANT') {
    coApplicantFields = {
      dealer_id: Yup.number().nullable('Enter Relation').required('Enter Relation'),
      relationship: Yup.string().min(2).nullable('Enter Relationship type').required('Enter Relationship Type'),
    };
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().nullable('Enter first name').required('Enter first name'),
    last_name: Yup.string().nullable('Enter last name').required('Enter last name'),
    gender: Yup.string().nullable('Choose gender').required('Enter gender'),
    email: Yup.string().nullable('Enter email').email('Invalid email').required('Enter email'),
    address: Yup.string()
      .nullable('Enter address')
      .min(6, 'address must be atleast 6 characters')
      .required('Enter address'),
    mobile: Yup.string()
      .nullable('Enter mobile number')
      .matches(/^\d{10}$/, 'Invalid mobile number')
      .required('Enter valid mobile number'),
    // dob: Yup.number().required("Choose date of birth"),
    residing_since: Yup.number().nullable('Enter the year').required('Enter the year'),
    marital_status: Yup.string('Enter your Marital status'),
    pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
    pan: Yup.string()
      .nullable('Enter PAN')
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
      .required('Enter PAN')
      .uppercase(),
    aadhar: Yup.string()
      .nullable('Enter GST')
      .matches(/^(\d{12})$|^(\d{16})$/, 'Invalid aadhar')
      .required('Enter valid aadhar'),
    ...coApplicantFields,
  });

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
    } else if (fileType === 'Front') {
      setFieldValue('aadhar_f_file_url', value[0]);
    } else if (fileType === 'Back') {
      setFieldValue('aadhar_b_file_url', value[0]);
    } else {
      setFieldValue('profile_image_url', value[0]);
    }
  };
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleReset,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      ...data,
    },

    onReset: (values, e) => {
      setReadOnly(true);
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      values.first_name = values.first_name.toUpperCase();
      values.last_name = values.last_name.toUpperCase();
      setLoading(true);
      const dob = selectedDate ? format(new Date(selectedDate), 'dd-MM-yyyy') : values.dob ? values.dob : null
      const date_values = { ...values, dob: dob, pan: values.pan.toUpperCase(), is_whatsapp: selectedState.checkedA === true ? 1 : 0, is_aadhar_linked: selectedState.checkedB === true ? 1 : 0 };
      let obj = {};
      if (values.id) {
        obj = compareObject(data, date_values)
      }
      else {
        obj = { ...date_values }
      }
      const formData = new FormData();
      Object.keys(obj).forEach((key) => {
        if (key === 'pan') {
          let pan = values?.pan ? cryptoEncrypt(values.pan) : values?.pan;
          formData.append(key, pan)
        } else if (key === 'aadhar') {
          let aadhar = values?.aadhar ? cryptoEncrypt(values.aadhar) : values?.aadhar;
          formData.append(key, aadhar)
        } else {
          formData.append(key, obj[key]);
        }
      });
      const apiURL =
        modelType === 'DEALER'
          ? URL.dealers
          : modelType === 'GUARANTOR'
            ? URL.guarantor
            : URL.coApplicants;
      let url = `${apiURL}/${dealershipId}`;
      if (values.id) {
        url += `/${values.id}`;
      }
      if (modelType !== 'GUARANTOR') {
        formData.append('user_id', currentUser.id);
      }
      fetch(`${URL.base}${url}`, {
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
          setApicallStatus('success');
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          onClose();
          modelType === 'DEALER' &&
          queryClient.invalidateQueries(['dealers-coapplicant', id])

          modelType === 'COAPPLICANT' ?
            queryClient.invalidateQueries(['co-applicants', id]) : queryClient.invalidateQueries(['guarantors', id])
        })
        .catch((err) => {
          setReadOnly(false);
          setLoading(false);
          enqueueSnackbar(err.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          logger(err);
        });
    },
  });
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleStateChange = (state) => {
    setSelectedState(state);
  };
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>
          {modelType === 'DEALER'
            ? 'Dealer Edit Form'
            : modelType === 'GUARANTOR'
              ? 'Guarantor Edit Form'
              : 'CoApplicant Edit Form'}
        </div>
        <CloseIcon onClick={onClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <Stepper
          activeStep={activeStep}
          orientation='vertical'
          className={classes.stepperRoot}
        >
          <Step key={data.id}>
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
            />
          </Step>
        </Stepper>
        {apicallStatus ? (
          <Alert severity={apicallStatus}>{apiCallMessage}</Alert>
        ) : null}
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          {!readOnly ? (
            !loading ? (
              <>
                <Button
                  variant='contained'
                  startIcon={<NavigateBeforeRoundedIcon />}
                  disabled={loading}
                  onClick={onClose}
                >
                  Back
                </Button>

                <Button
                  variant='contained'
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={
                    !readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />
                  }
                  disabled={loading}
                  onClick={
                    loading ? () => null : readOnly ? handleEdit : handleSubmit
                  }
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
            <>
              <div>
                <Button
                  variant='contained'
                  startIcon={<NavigateBeforeRoundedIcon />}
                  disabled={loading}
                  onClick={onClose}
                >
                  Back
                </Button>
              </div>
              <div>
                <Button
                  variant='contained'
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={
                    !readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />
                  }
                  disabled={loading}
                  onClick={
                    loading ? () => null : readOnly ? handleEdit : handleSubmit
                  }
                >
                  Edit
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerEditSideWrapper;
