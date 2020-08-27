import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import DealerCreditInfoForm from './DealerCreditInfoForm';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { API } from '../../../config/api';
import { URL } from '../../../config/serverUrls';
import { logger } from '../../../config/logger';

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
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
}));

const CreditInfoSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [readOnly, setReadOnly] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: {},
    onSubmit: values => {
      // console.log('Form Values >> ', values);
      setLoading(true);
      setApiStatus({});
      // setActiveStep(activeStep+1);
      // dealership/<int:dealership_id>/credit/info
      // return null;
      API.post(`${URL.dealership}/${dealershipId}/credit/info`, { ...values, user_id: currentUser.id, dealer_id: data[activeStep].id }, {
        withCredentials: true,
        credentials: 'include'
      })
        .then(({ status, message, data }) => {
          if(status == 'success') {
            setApiStatus({ type: 'success', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
            handleReset();
            setActiveStep(activeStep+1);
          }
          else {
            setApiStatus({ type: 'error', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
          }
        })
        .catch(e => {
          setApiStatus({ type: 'error', message: 'Unable to save the details. Please try again later' })
          setLoading(false);
          setReadOnly(true);
          logger(e);
        })
    }
  });

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">Credit Information: All Applicants</Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperRoot}>
          {
            Array.isArray(data) && data.map((item, i) => {
              return (
                <Step key={item.id}>
                  <StepLabel className={classes.stepTitle}>{item.first_name}  { values.cibil_score ? <b>({values.cibil_score})</b> : null }</StepLabel>
                  <StepContent>
                    <DealerCreditInfoForm data={item} values={values} errors={errors} onChange={handleChange} />
                  </StepContent>
                </Step>
              );
            })
          }
        </Stepper>
        {
          Array.isArray(data) && activeStep+1 === data.length ? (
            <Alert severity={'success'}>Thanks for submitting credit info for dealers</Alert>
          ) : null
        }
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        {
          apiStatus.type && (
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          )
        }
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
              className={clsx(classes.btn, classes.btnSuccess)}
              startIcon={<NavigateNextRoundedIcon />}
              disabled={loading}
              onClick={loading ? () => null : handleSubmit}>{loading ? <CircularProgress size={20} /> :`Save`}</Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CreditInfoSideWrapper;