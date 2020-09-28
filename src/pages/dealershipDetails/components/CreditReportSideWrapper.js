import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
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
import CreditReportForm from './CreditReportForm';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';

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
    height: '100vh',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: 24
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

const CreditReportSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: {},
    onSubmit: values => {
      // console.log('Form Values >> ', values);
      setLoading(true);
      setApiStatus({});
      // dealership/<int:dealership_id>/credit/info
      // return null;
      API.post(`${URL.dealership}/${dealershipId}/credit/report`, { ...values, user_id: currentUser.id })
        .then(({ status, message }) => {
          if(status == 'success') {
            setApiStatus({ type: 'success', message: message || 'Unable to save the details. Please try again later' })
            setLoading(false);
            handleReset();
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

  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_credit_edit)

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">Credit Report: Dealership</Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <CreditReportForm
          editable={editable}
          id={dealershipId}
          data={data}
          values={values}
          errors={errors}
          onChange={handleChange}
          setValues={setValues}
          currentUser={currentUser}
        />
        {/* <Alert severity={'success'}>Thanks for submitting credit report</Alert> */}
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
            {
              editable && (
                <Button
                  variant="contained"
                  className={clsx(classes.btn, classes.btnSuccess)}
                  startIcon={<NavigateNextRoundedIcon />}
                  disabled={loading}
                  onClick={loading ? () => null : handleSubmit}>{loading ? <CircularProgress size={20} /> :`Save`}</Button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default CreditReportSideWrapper;