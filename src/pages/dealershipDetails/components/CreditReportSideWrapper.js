import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import isEqual from 'lodash/isEqual';
import React, { useState, useEffect } from 'react';
// import DealerCreditInfoForm from './DealerCreditInfoForm';
// import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import CreditReportForm from './CreditReportForm';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { rulesList } from '../../../config/userRules';
import apiCall from '../../../utils/api.util';
import { useQuery } from 'react-query';
import { getCreditReport } from '../../../services/dealerships.service';

const useStyles = makeStyles(theme => ({
  sidePanelTitle: {
    textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
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
    justifyContent: 'flex-end',
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
  title: {
    marginTop: 15,
    marginBottom: 10
  }
}));

const initObject = {
  business_vintage: '',
  vintage_with_banker: 0,
  inward_returns: 0,
  other_services_count: 0,
  social_score: 0,
  pd_officer_remarks: '',
  gross_income_fuel: 0,
  total_income: 0,
  gross_income_considered: 0,
  total_expense: 0,
  current_loans_emi: 0,
  interest: 0,
  total_obligations: 0,
  foir: 0,
  is_loan: false,
  max_loan_interest: 0,
  max_loan_foir: 0,
  annual_turnover: 0,
  max_loan_turnover: 0,
  max_loan_possible: 0,
  score: 0,
  score_impact: 0,
  max_loan_exposure: 0,
  pm_exposure: 0,
  final_loan_value: 0,
  approved_loan_amount: 0,
  final_loan_amount: 0,
  annual_interest: 0,
  foir_percentage: 0,
  applicable_interest: 18,
  loan_percentage: 1,
  max_loan_cap: 3000000,
};

const CreditReportSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [apiData, setApiData] = useState({});
  const [apiStatus, setApiStatus] = useState({});
  const { data: apiData, refetch: getReport } = useQuery(['credit-report', dealershipId], () => getCreditReport(dealershipId))

  // const getCreditReport = () => {
  //   apiCall(`${URL.dealership}/${dealershipId}/credit/report`)
  //     .then(({ status, data }) => {
  //       if (status === "SUCCESS") {
  //         setApiData(data[0] || {});
  //         setValues(data[0] || {})
  //       } else {
  //         // reject(data.message);
  //       }
  //     })
  //     .catch(e => {
  //       // reject(e.message);
  //     })
  // }

  // useEffect(() => {
  //   getCreditReport();
  // }, [])

  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: { ...apiData },
    onSubmit: values => {
      // console.log('Form Values >> ', values);
      if (isEqual(values, apiData)) {
        setApiStatus({ type: 'info', message: 'No changes made! Kindly make any change before submitting.' })
        setTimeout(() => {
          setApiStatus({})
        }, 4000)
        return null;
      }
      setLoading(true);
      setApiStatus({});
      // dealership/<int:dealership_id>/credit/info
      // return null;
      const id = apiData.id || undefined;
      let reqData = {};
      if (id) {
        reqData = apiData;
      }
      apiCall(`${URL.dealership}/${dealershipId}/credit/report`, {
        method: 'POST',
        body: { ...reqData, ...values, id, user_id: currentUser.id }
      })
        .then(({ status, message }) => {
          if (status == 'SUCCESS') {
            // getCreditReport();
            getReport();
            setApiStatus({ type: 'success', message: message || 'Report details updated' })
            setLoading(false);
            // handleReset();
          }
          else {
            setApiStatus({ type: 'error', message: data.message || 'Unable to save the details. Please try again later' })
            setLoading(false);
          }
        })
        .catch(e => {
          setApiStatus({ type: 'error', message: 'Unable to save the details. Please contact admin' })
          setLoading(false);
          setReadOnly(true);
          logger(e);
        })
    }
  });

  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_credit_edit)

  return (
    <div className={classes.sidePanelFormWrapper}>
      <div className={classes.title}>
        <Typography variant="h4">Dealership credit report</Typography>
        {/* <CloseRoundedIcon onClick={onClose} /> */}
      </div>

      <div className={classes.sidePanelFormContentWrapper}>
        <CreditReportForm
          editable={editable}
          id={dealershipId}
          data={data}
          values={{ ...apiData, ...values }}
          errors={errors}
          onChange={handleChange}
          setValues={setValues}
          currentUser={currentUser}
          onSubmit={handleSubmit}
          loading={loading}
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
        {/* <div className={classes.actionButtonsWrapper}>
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
                  onClick={loading ? () => null : handleSubmit}>{loading ? <CircularProgress size={20} /> : `Save`}</Button>
              )
            }
          </div>
        </div> */}
      </div>
    </div>
  )
};

export default CreditReportSideWrapper;