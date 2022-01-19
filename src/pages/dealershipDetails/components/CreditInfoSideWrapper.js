import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import * as Yup from 'yup';
import DealerCreditInfoForm from './DealerCreditInfoForm';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { getCreditInfo, updateCreditInfo } from '../../../services/dealers.service';



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
    overflow: 'auto',
    padding: 9
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  stepTitle: {
    '& .MuiStepLabel-label.MuiStepLabel-active': {
      fontSize: 14,
      fontWeight: 600
    }
  },
  btnBack: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.blueGreyLight,
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
  const [editMode, setEditMode] = useState();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    getCreditInfo(dealershipId)
      .then(res => {
        setApiData(res?.find(item => item?.dealer_id === data?.id));
        setEditMode(res?.find(item => item?.dealer_id === data?.id)?.cibil_score ? false : true);
        // setValues(res?.find(item => item?.dealer_id === data?.id))
      })
      .catch(e => null)
  }, []);

  const handleEdit = () => {
    setValues(apiData)
    setEditMode(!editMode)
  }

  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      cibil_score: Yup.number().nullable().required('Please Enter CIBIL Score'),
      loans_count: Yup.number().nullable().required('Please Enter Total Loans'),
      closed_loans_count: Yup.number().nullable().required('Please Enter Total Closed Loans'),
      od_accounts_count: Yup.number().nullable().required('Please Enter CIBIL Score'),
      od_amount: Yup.number().nullable().required('Please Enter No of OD Accounts'),
      current_os_amount: Yup.number().nullable().required('Please Enter OD Amount'),
      cibil_vintage: Yup.number().nullable().required('Please Enter CIBIL Vintage'),
      no_of_enquiries: Yup.number().nullable().required('Please Enter No of Enquiries'),
    }),
    onSubmit: values => {
      setLoading(true);
      setApiStatus({});

      const body = {
        ...values,
        id: apiData?.id || undefined,
        user_id: currentUser?.id,
        dealer_id: data?.id
      }
      
      updateCreditInfo(body, dealershipId)
        .then(res => {
          setLoading(false)
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          onClose()
        })
        .catch(e => {
          console.log(e);
          setLoading(false)
        })
    }
  });

  return (
    <div className={classes.sidePanelFormWrapper}>
      <div className={classes.sidePanelTitle}>
        <Typography  variant="h4">Credit Information</Typography>
        <CloseRoundedIcon onClick={onClose} />
      </div>
      <div className={classes.sidePanelFormContentWrapper}>
        {
          !editMode ? 
            <div style={{margin: 10}}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <ViewData title='Name' value={data?.first_name +' '+ data?.last_name} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Mobile' value={data?.mobile} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='User Type' value={data?.userType} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='CIBIL Score' value={apiData?.cibil_score} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No. of Loans' value={apiData?.loans_count} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Closed Loans' value={apiData?.closed_loans_count} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Overdue Count' value={apiData?.od_accounts_count} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Overdue Amount' value={apiData?.od_amount} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Current O/S amount' value={apiData?.current_os_amount} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Vintage with CIBIL bureau' value={apiData?.cibil_vintage} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No of enquiries last 6 months' value={apiData?.no_of_enquiries} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Loans in Bureau Report' value={apiData?.is_loan_in_bureau === 1 ? 'Yes' : 'No'} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No of times of highest DPD' value={apiData?.highest_dpd === 4 ? '>3 times' : apiData?.highest_dpd === 1 ? `${apiData?.highest_dpd} time` : `${apiData?.highest_dpd} times`} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Highest DPD bracket' value={apiData?.highest_dpd_bracket} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Credit Card in Bureau Report' value={apiData?.is_cc_in_cibil === 1 ? 'Yes' : 'No'} style={{marginBottom: 0}} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Status - For Loans &amp; Credit Cards' value={apiData?.status} style={{marginBottom: 0}} />
                </Grid>
              </Grid>
            </div>
            :
            <DealerCreditInfoForm values={values} errors={errors} onChange={handleChange} dealerData={data} />
        }
      </div>

      <div className={classes.actionFooter}>
        <Divider />
        <Snackbar open={apiStatus.show} autoHideDuration={2000} onClose={() => setApiStatus({ show: false })}>
          <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
        </Snackbar>
        <div className={classes.actionButtonsWrapper}>
          {
            !loading ? (
              <>
                <Button
                  variant="contained"
                  className={clsx(classes.btn, classes.btnSuccess)}
                  startIcon={<NavigateBeforeRoundedIcon />}
                  disabled={loading}
                  onClick={editMode === true ? handleSubmit : handleEdit}>{editMode === true ? 'Save' : 'Edit'}</Button>
              </>
            ) : (
              <div style={{display: 'flex', justifyContent: 'flex-start', width: '90%', margin: '0 auto'}}>
                <CircularProgress size={30}/>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
};

export default CreditInfoSideWrapper;