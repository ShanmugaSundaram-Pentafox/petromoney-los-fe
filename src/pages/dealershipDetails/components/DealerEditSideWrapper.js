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

const useStyles = makeStyles(theme => ({
  sidePanelTitle: {
    textAlign: 'center',
    padding: '12px 16px',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  actionFooter: {
    // justifyContent: 'flex-end',
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  actionButtons: {
    // paddingTop: 8
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  stepTitle: {
    '& .MuiStepLabel-label.MuiStepLabel-active': {
      fontSize: 15,
      fontWeight: 600
    }
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  }
}));

const DealerEditSideWrapper = ({ isAdd, dealershipId, getDealerApiCall, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] =  useState({});

  const handleEdit = () => {
    setReadOnly(!readOnly)
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().min(2).required("Enter first name"),
    last_name: Yup.string().min(2).required("Enter last name"),
    gender: Yup.string().required("Enter gender"),
    dob: Yup.string().required("Choose date of birth"),
    address: Yup.string().min(6).required("Enter valid address"),
    residing_since: Yup.number().required(),
    marital_status: Yup.string(),
    mobile: Yup.string().matches(/^\d{10}$/).required("Enter valid mobile number"),
    pan: Yup.string().matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, "Invalid PAN").required("Enter PAN").uppercase(),
    aadhar: Yup.string().matches(/^(\d{12})$|^(\d{16})$/, "Invalid aadhar").required("Enter valid aadhar"),
  })

  const deleteFile = (type) => {
    const allTypes = {
      PAN: "pan_file_url",
      AADHAR_FRONT: "aadhar_f_file_url",
      AADHAR_BACK: "aadhar_b_file_url"
    }
    const urlType = allTypes[type];
    let file = '';
    let fileData = data[urlType];
    if (typeof fileData === "string") {
      file = fileData;
    }
    let url = `dealers/${data.dealership_id}`;
    if (data.id) {
      url += `/${data.id}`;
    }
    API.delete(url, { type, file })
      .then(res => {
        onClose();
        getDealerApiCall(dealershipId)
      })
      .catch(err => {
        setReadOnly(true);
        logger(err);
      })
  };

  const { values, errors, handleSubmit,handleChange, handleReset, setValues } = useFormik({
    initialValues: {
      ...data
    },
    onReset: (values, e) => {
      setReadOnly(true)
    },
    validationSchema,
    onSubmit: values => {
      setLoading(true);
      
      const data = new FormData();
      Object.keys(values).forEach(key => {
        data.append(key, values[key]);
      })

      let url = `dealers/${dealershipId}`;
      if (values.id) {
        url += `/${values.id}`;
      }
      API.post(url, data)
        .then(res => {
          setLoading(false);
          onClose();
          getDealerApiCall(dealershipId)
        })
        .catch(err => {
          setReadOnly(true);
          logger(err);
        })
    }
  });

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">Dealer Edit Form</Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperRoot}>
          <Step key={data.id}>
            <StepContent>
              <DealerEditForm deleteFile={deleteFile} readOnlyProps={readOnly} data={data} values={values} errors={errors} onChange={handleChange} />
            </StepContent>
          </Step>
        </Stepper>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="contained"
              startIcon={<NavigateBeforeRoundedIcon />}
              disabled={loading}
              onClick={onClose}>Back</Button>
          </div>
          <div>
            <Button
              variant="contained"
              className={clsx(classes.btn, classes.editButton)}
              startIcon={!readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />}
              disabled={loading}
              onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}>{loading ? <CircularProgress size={20} /> : readOnly ? `Edit` :
                'Save'}</Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default DealerEditSideWrapper;