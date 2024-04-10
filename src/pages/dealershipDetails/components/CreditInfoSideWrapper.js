import Typography from '@material-ui/core/Typography';
import RotateLeftOutlinedIcon from '@material-ui/icons/RotateLeftOutlined';
import DownloadOutlined from '@material-ui/icons/SystemUpdateAltRounded';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import DealerCreditInfoForm from './DealerCreditInfoForm';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getSignedUrl } from '../../../services/common.service';
import { getCibilReport } from '../../../services/creditreport.service';
import { getCreditInfo, updateCreditInfo } from '../../../services/dealers.service';
import { Flex, Grid } from '@mantine/core';
import { Button } from '../../../components/Mantine/Button/Button';

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

const CreditInfoSideWrapper = ({ dealershipId, data, currentUser, onClose }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [editMode, setEditMode] = useState(true);
  const [cibilEditMode, setCibilEditMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);
  const queryClient = useQueryClient();
  const creditData = useQuery('credit', () => getCreditInfo(dealershipId), {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      setApiData(res?.find(item => item?.dealer_id === data?.id));
      setEditMode(res?.find(item => item?.dealer_id === data?.id)?.cibil_score ? false : true);
    },
    onError: (res) => null
  })

  const CIBILReport = () => {
    getCibilReport(dealershipId, data?.id, data?.pan, data?.category?.toLowerCase())
      .then(data => {
        queryClient.invalidateQueries('credit')
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

  const handleDownload = () => {
    if (apiData?.cibil_file_url) {
      getSignedUrl(apiData?.cibil_file_url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
  }

  return (
    <>
      {/* Drawer content */}
      <div className="grow p-4 overflow-auto">
        {!editMode ? (
          <>
            <Grid gutter="sm">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Name' value={data?.first_name + ' ' + data?.last_name} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Mobile' value={data?.mobile} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='User Type' value={data?.category} style={{ marginBottom: 0 }} />
              </Grid.Col>
            </Grid>

            <Grid gutter="sm">
              <Grid span={{ base: 12, sm: 6 }} my={20} ml={12}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='h6'>CIBIL Extract</Typography>
                  <UserCan
                    role={currentUser.role_name}
                    perform={rulesList.credit_refresh}
                    yes={() => (
                      <Button variant='text' color='primary' mr={10} size={'xs'} startIcon={<RotateLeftOutlinedIcon />} style={{ marginLeft: 8 }} onClick={CIBILReport}>Refresh CIBIL Report</Button>
                    )}
                    no={() => (
                      <Alert severity='info'>
                        Only Credit team can check/refresh CIBIL. Kindly contact Credit team.
                      </Alert>
                    )}
                  />
                </div>

                {apiData?.cibil_file_url && (
                  <div>
                    <Button
                      size={'xs'}
                      variant='outlined'
                      color='primary'
                      onClick={handleDownload}
                      startIcon={<DownloadOutlined />}
                    >
                      Download Report
                    </Button>
                  </div>
                )}
              </Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='CIBIL Score' value={apiData?.cibil_score} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Updated on' value={apiData?.modified_date} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Total no.of loans' value={apiData?.loans_count} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='No of closed loans' value={apiData?.closed_loans_count} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='No of overdue accounts' value={apiData?.od_accounts_count} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Overdue amount' value={apiData?.od_amount} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Current O/S amount' value={apiData?.current_os_amount} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Vintage with CIBIL bureau' value={apiData?.cibil_vintage} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='No of enquiries last 6 months' value={apiData?.no_of_enquiries} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Loans in Bureau Report' value={apiData?.is_loan_in_bureau === 1 ? 'Yes' : 'No'} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='No of times of highest DPD' value={apiData?.highest_dpd === 4 ? '>3 times' : apiData?.highest_dpd === 1 ? `${apiData?.highest_dpd} time` : `${apiData?.highest_dpd} times`} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Highest DPD bracket' value={apiData?.highest_dpd_bracket} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Credit Card in Bureau Report' value={apiData?.is_cc_in_cibil === 1 ? 'Yes' : 'No'} style={{ marginBottom: 0 }} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <ViewData title='Status - For Loans &amp; Credit Cards' value={apiData?.status} style={{ marginBottom: 0 }} />
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <DealerCreditInfoForm
            values={values}
            errors={errors}
            onChange={handleChange}
            dealerData={data}
            cibilEditMode={cibilEditMode}
            currentUser={currentUser}
            setFieldValue={setFieldValue}
            editable={editable}
          />
        )}

        {/* <div className={classes.actionFooter}>
          <Divider />
          <Snackbar open={apiStatus.show} autoHideDuration={2000} onClose={() => setApiStatus({ show: false })}>
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          </Snackbar>
          
          {!editable && (
            <div className={classes.actionButtonsWrapper}>
              {apiData?.cibil_score && (
                <Button
                  className={clsx(classes.btn, classes.btnSuccess)}
                  variant="contained"
                  startIcon={cibilEditMode ? <NavigateNextRounded /> : <EditIcon />}
                  onClick={cibilEditMode ? handleSubmit : handleEdit}
                >
                  {cibilEditMode === true ? 'Save' : 'Edit'}
                </Button>
              )}
            </div>
          )}
        </div> */}
      </div>

      {/* Sticky footer */}
      {!editable && apiData?.cibil_score && (
        <Flex
          h="64"
          align="center"
          justify="end"
          className="bg-white shrink-0 px-4 z-[9]"
          style={{
            borderTop: '1px solid #eaeaea',
          }}
        >
          <Flex gap="sm">
            <Button
              colorScheme={'green'}
              size="md"
              // startIcon={cibilEditMode ? <NavigateNextRounded /> : <EditIcon />}
              onClick={cibilEditMode ? handleSubmit : handleEdit}
            >
              {cibilEditMode === true ? 'Save' : 'Edit'}
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  )
};

export default CreditInfoSideWrapper;