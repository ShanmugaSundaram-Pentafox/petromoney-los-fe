import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import isEqual from 'lodash/isEqual';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import CreditReportForm from './CreditReportForm';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { rulesList } from '../../../config/userRules';
import { getCreditReport } from '../../../services/dealerships.service';
import apiCall from '../../../utils/api.util';

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
  const [apiStatus, setApiStatus] = useState({});
  const { data: apiData, refetch: getReport } = useQuery(['credit-report', dealershipId], () => getCreditReport(dealershipId))

  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: { ...apiData },
    onSubmit: values => {
      if (isEqual(values, apiData)) {
        setApiStatus({ type: 'info', message: 'No changes made! Kindly make any change before submitting.' })
        setTimeout(() => {
          setApiStatus({})
        }, 4000)
        return null;
      }
      setLoading(true);
      setApiStatus({});
      const id = apiData.id || undefined;
      let reqData = {};
      if (id) {
        reqData = apiData;
      }
      let payLoad = {...reqData, ...values, id, user_id: currentUser.id}
      Object.keys(payLoad).forEach(k => (payLoad[k] === '') && delete payLoad[k])

      apiCall(`${URL.dealership}/${dealershipId}/credit/report`, {
        method: 'POST',
        body: payLoad
      })
        .then(({ status, message }) => {
          if (status == 'SUCCESS') {
            getReport();
            setApiStatus({ type: 'success', message: message || 'Report details updated' })
            setLoading(false);
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
  const viewOnly = permissionCheck(currentUser.role_name, rulesList.external_view)

  return (
    <div className={classes.sidePanelFormWrapper}>
      <div className={classes.title}>
        <Typography variant="h4">Financial Report</Typography>
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
          viewOnly={viewOnly}
        />
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        {
          apiStatus.type && (
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          )
        }
      </div>
    </div>
  )
};

export default CreditReportSideWrapper;