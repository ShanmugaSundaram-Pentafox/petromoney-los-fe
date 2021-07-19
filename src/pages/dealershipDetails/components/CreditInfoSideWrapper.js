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
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { API } from '../../../config/api';
import { URL } from '../../../config/serverUrls';
import { logger } from '../../../config/logger';
import apiCall from '../../../utils/api.util';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';



const useStyles = makeStyles(theme => ({
  sidePanelTitle: {
    textAlign: 'center',
    padding: '12px 16px',
    display:'flex',
    justifyContent:'space-between',
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
  btnBack: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.blueGreyLight,
      // color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.blueGreyLight
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
  const [apiData, setApiData] = useState([]);

  const getCreditInfo = () => {
    return new Promise((resolve, reject) => {
      apiCall(`${URL.dealership}/${dealershipId}/credit/info`)
        .then(({ status, data, message }) => {
          if (status === "SUCCESS") {
            resolve(data);
          } else {
            reject(message);
          }
        })
        .catch(e => {
          reject(e.message);
        })
    });
  }

  React.useEffect(() => {
    getCreditInfo()
      .then(res => {
        setApiData(res);
      })
      .catch(e => null)
  }, []);

  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: {},
    onSubmit: values => {
      // console.log('Form Values >> ', values);
      setLoading(true);
      setApiStatus({});
      // setActiveStep(activeStep+1);
      // dealership/<int:dealership_id>/credit/info
      // return null;
      const resData = apiData.find(n => n.dealer_id === data[activeStep].id) || {};

      apiCall(`${URL.dealership}/${dealershipId}/credit/info`, {
        method: 'POST',
        body: {
          ...values,
          id: resData.id || undefined,
          user_id:
            currentUser.id,
          dealer_id: data[activeStep].id
        },
      })
        .then(({ status, data, message }) => {
          // console.log(data, data.status, data.status == 'SUCCESS')
          if (status == 'SUCCESS') {
            // setApiStatus({ type: 'success', message: message || `Credit Info updated for ${data[activeStep].id}` })
            setLoading(false);
            handleReset();
            setActiveStep(activeStep + 1);
          }
          else {
            setApiStatus({ show: true, type: 'error', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
          }
        })
        .catch(e => {
          setApiStatus({ show: true, type: 'error', message: 'Unable to save the details. Please contact admin.' })
          setLoading(false);
          setReadOnly(true);
          logger(e);
        })
    }
  });

  return (
    <div className={classes.sidePanelFormWrapper}>
      <div className={classes.sidePanelTitle}>
        <Typography  variant="h4">Credit Information: All Applicants</Typography>
        <CloseRoundedIcon onClick={onClose} />
      </div>

      <div className={classes.sidePanelFormContentWrapper}>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperRoot}>
          {
            Array.isArray(data) && data.map((item, i) => {
              const resData = apiData.find(n => n.dealer_id === item.id);
              // console.log('REs >> ', apiData, item);
              const dealerData = { ...(resData || {}), ...values };
              return (
                <Step key={item.id}>
                  <StepLabel className={classes.stepTitle} onClick={() => setActiveStep(i)}>{item.first_name}  {dealerData.cibil_score ? <b>({dealerData.cibil_score})</b> : null}</StepLabel>
                  <StepContent>
                    <DealerCreditInfoForm data={item} values={dealerData} errors={errors} onChange={handleChange} />
                  </StepContent>
                </Step>
              );
            })
          }
        </Stepper>
        {/* {
          Array.isArray(data) && activeStep+1 === data.length ? (
            <Alert severity={'success'}>Thanks for submitting credit info for dealers</Alert>
          ) : null
        } */}
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <Snackbar open={apiStatus.show} autoHideDuration={2000} onClose={() => setApiStatus({ show: false })}>
          <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
        </Snackbar>
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<NavigateBeforeRoundedIcon />}
              disabled={loading}
              onClick={onClose}>Close</Button>
          </div>
          <div>
            <Button
              variant="contained"
              className={clsx(classes.btn, classes.btnSuccess)}
              // startIcon={<NavigateNextRoundedIcon />}
              disabled={loading}
              onClick={loading ? () => null : handleSubmit}>{loading ? <CircularProgress size={20} /> : `Save`}</Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CreditInfoSideWrapper;