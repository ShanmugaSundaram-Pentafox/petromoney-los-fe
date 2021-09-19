import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import * as Yup from 'yup';
import DealerCreditInfoForm from './DealerCreditInfoForm';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import EditIcon from '@material-ui/icons/Edit';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { API } from '../../../config/api';
import { URL } from '../../../config/serverUrls';
import { logger } from '../../../config/logger';
import DealerEditForm from './DealerEditForm';
import apiCall from '../../../utils/api.util';
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import { format, parse } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
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
  actionFooter: {
    // justifyContent: 'flex-end',
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  actionButtons: {
    // paddingTop: 8
  },
  stepperRoot: {
    // padding: 16,
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
  getCoApplicantApiCall,
  data,
  currentUser,
  onClose,
}) => {
  const classes = useStyles();
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
      dealer_id: Yup.number().required('Enter Dealer ID'),
      relationship: Yup.string().min(2).required('Enter Relationship Type'),
    };
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Enter first name'),
    last_name: Yup.string().required('Enter last name'),
    gender: Yup.string().required('Enter gender'),
    email: Yup.string().email('Invalid email').required('Enter email'),
    address: Yup.string()
      .min(6, 'address must be atleast 6 characters')
      .required('Enter address'),
    mobile: Yup.string()
      .matches(/^\d{10}$/, 'Invalid mobile number')
      .required('Enter valid mobile number'),
    // dob: Yup.number().required("Choose date of birth"),
    residing_since: Yup.number().required('Enter the year'),
    marital_status: Yup.string('Enter your Marital status'),
    pan: Yup.string()
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
      .required('Enter PAN')
      .uppercase(),
    aadhar: Yup.string()
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
        getDealerApiCall(dealershipId);
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
    handleSubmit(values);
    // onCloseUploader();
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
      const d = selectedDate ? format(parse(selectedDate, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd') : format(parse(values.dob, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd')
      const date_values = { ...values, dob: d, is_whatsapp: selectedState.checkedA === true ? 1 : 0, is_aadhar_linked: selectedState.checkedB === true ? 1 : 0 };
      const data = new FormData();
      Object.keys(date_values).forEach((key) => {
        data.append(key, date_values[key]);
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
        data.append('user_id', currentUser.id);
      }
      fetch(`${URL.base}${url}`, {
        method: 'POST',
        body: data,
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
          enqueueSnackbar(res.profile_status, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setApiCallMessage(isAdd ? 'Dealer Added' : 'Dealer Updated');
          onClose();
          modelType === 'DEALER'
            ? getDealerApiCall(dealershipId)
            : getCoApplicantApiCall(dealershipId);
        })
        .catch((err) => {
          setReadOnly(false);
          setLoading(false);
          enqueueSnackbar(err.profile_status, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          setApicallStatus('error');
          setApiCallMessage('Sorry! Unable to add or Update. Try again later.');
          logger(err);
        });
    },
  });
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleStateChange = (state) => {
    setSelectedState(state);
  }
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
            {/* <StepContent> */}
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
            {/* </StepContent> */}
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
