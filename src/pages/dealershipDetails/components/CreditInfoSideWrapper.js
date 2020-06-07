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
import clsx from 'clsx';
import { useFormik } from 'formik';

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

const CreditInfoSideWrapper = ({ data, onClose }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: {},
    onSubmit: values => {
      console.log('Form Values >> ', values);
      handleReset();
      setActiveStep(activeStep+1);
    }
  });

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">Credit Information: All Applicants</Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperRoot}>
          {
            Array(4).fill(data[0]).map((item, i) => {
              return (
                <Step key={item.id}>
                  <StepLabel className={classes.stepTitle}>{item.first_name}</StepLabel>
                  <StepContent>
                    <DealerCreditInfoForm data={item} values={values} errors={errors} onChange={handleChange} />
                  </StepContent>
                </Step>
              );
            })
          }
        </Stepper>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="contained"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={onClose}>Back</Button>
          </div>
          <div>
            <Button
              variant="contained"
              className={clsx(classes.btn, classes.btnSuccess)}
              startIcon={<NavigateNextRoundedIcon />}
              onClick={handleSubmit}>Save &amp; Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CreditInfoSideWrapper;