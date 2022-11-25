import { IconButton, Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import EditIcon from '@material-ui/icons/Edit';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import RotateLeftOutlinedIcon from '@material-ui/icons/RotateLeftOutlined';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import DealerCrimeInfoForm from './DealerCrimeInfoForm';
import DocListPreview from './DocListPreview';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getCrimeInfo, getCrimeReport, updateCreditInfo } from '../../../services/dealers.service';

const useStyles = makeStyles(theme => ({
  sidePanelTitle: {
    textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'flex-end',
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

const CrimeInfoSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [editMode, setEditMode] = useState(true);
  const [cibilEditMode, setCibilEditMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);
  const queryClient = useQueryClient();
  const {data: crimeData} = useQuery('crime', () => getCrimeInfo(data?.id, data?.userType?.replace(/[- ]/g, '')?.toLowerCase()), {
    refetchOnWindowFocus: false,
  })

  const crimeReport = () => {
    getCrimeReport(dealershipId, data?.id, data?.userType?.replace(/[- ]/g, '')?.toLowerCase())
      .then(data => {
        queryClient.invalidateQueries('crime')
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }

  const handleEdit = () => {
    setValues(apiData)
    setEditMode(true)
    setCibilEditMode(true)
  }

  const { values, errors, handleChange, handleSubmit, handleReset, setValues, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      highest_dpd: Yup.string().nullable().required('Please Select highest DPD'),
      highest_dpd_bracket: Yup.string().nullable().required('Please Select highest DPD Bracket'),
      status: Yup.string().nullable().required('Please Select Status'),
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
        <Typography variant="h4">Credit Information ({data?.pan || '-'})</Typography>
        <IconButton onClick={onClose} size='small'>
          <CloseRoundedIcon />
        </IconButton>
      </div>
      <div className={classes.sidePanelFormContentWrapper}>
        {
          !editMode ?
            <div style={{ margin: 10 }}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <ViewData title='Name' value={data?.first_name} style={{ marginBottom: 0 }} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='User Type' value={data?.userType} style={{ marginBottom: 0 }} />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 10 }}>
                <Grid item md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant='text' color='primary' startIcon={<RotateLeftOutlinedIcon />} style={{ marginLeft: 8 }} onClick={crimeReport}>Refresh Crime Report</Button>
                  </div>
                </Grid>
              </Grid>
            </div>
            :
            <DealerCrimeInfoForm values={values} errors={errors} onChange={handleChange} dealerData={data} cibilEditMode={cibilEditMode} currentUser={currentUser} setFieldValue={setFieldValue} editable={editable} />
        }
        <Typography variant='h6'>Crime Reports</Typography>
        <div>
          {
            Array.isArray(crimeData) && crimeData.map((row, i) => (
              <DocListPreview crimeCheck file={row.file_data} docId={row?.request_id} key={i} id={i + 1} dealershipId={data?.id} editable={editable} />
            ))
          }
        </div>

      </div>

      <div className={classes.actionFooter}>
        <Divider />
        <Snackbar open={apiStatus.show} autoHideDuration={2000} onClose={() => setApiStatus({ show: false })}>
          <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
        </Snackbar>
        {
          !editable &&
            <div className={classes.actionButtonsWrapper}>
              {
              apiData?.cibil_score &&
                <Button
                  className={clsx(classes.btn, classes.btnSuccess)}
                  variant="contained"
                  startIcon={cibilEditMode ? <NavigateNextRounded /> : <EditIcon />}
                  onClick={cibilEditMode ? handleSubmit : handleEdit}>{cibilEditMode === true ? 'Save' : 'Edit'}</Button>
              }
            </div>
        }
      </div>
    </div>
  )
};

export default CrimeInfoSideWrapper;