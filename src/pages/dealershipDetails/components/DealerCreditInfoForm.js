import { Button, CircularProgress, Collapse, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import {Alert, AlertTitle} from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { getCibilReport, updatePanApplicant } from '../../../services/creditreport.service';

const useStyles = makeStyles({
  row: {
    paddingRight: 12,
    paddingBottom: 14
  }
});

const DealerCreditInfoForm = ({ values, errors, onChange, editMode, dealerData, currentUser, setFieldValue, cibilEditMode }) => {
  let pan = dealerData?.pan
  let userType = dealerData?.userType
  let dealership_id = dealerData?.dealership_id
  let id = dealerData?.id
  const queryClient = useQueryClient()
  const [panId, setPanId] = useState({})
  const [panLoading, setPanLoading] = useState({icon: false})
  const [cibilLoading, setCibilLoading] = useState({icon: false})
  const [cibilData, setCibilData] = useState()
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState({})
  const formData = new FormData()
  const [collapseOpen, setCollapseOpen] = useState(false)
  const classes = useStyles();
  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };

  const CIBILReport = () => {
    if(pan || panId?.pan){
      setCibilLoading({icon:true, loading:true})
      getCibilReport(dealership_id, id, pan || panId?.pan, userType?.replace(/[^a-zA-Z ]/g,'')?.toLowerCase())
        .then(data => {
          setCibilLoading({icon:true, loading:false, success:true})
          setCibilData(data)
          setFieldValue('cibil_score', data?.cibil_score)
          setFieldValue('loans_count', data?.loans_count)
          setFieldValue('closed_loans_count', data?.closed_loans_count)
          setFieldValue('od_accounts_count', data?.od_accounts_count)
          setFieldValue('od_amount', data?.od_amount)
          setFieldValue('current_os_amount', data?.current_os_amount)
          setFieldValue('no_of_enquiries', data?.no_of_enquiries)
          setFieldValue('cibil_vintage', data?.cibil_vintage)
          setFieldValue('is_loan_in_bureau', data?.is_loan_in_bureau)
          setFieldValue('is_cc_in_cibil', data?.is_cc_in_cibil)
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
          setCibilLoading({icon:true, loading:false, success:false,error:true})
        })
    } else {
      setCollapseOpen(true)
    }
  }
  const handleChange = (event) => {
    setPanId({pan: event.target.value?.toUpperCase()})
  }
  const handlePANSubmit = () => {
    if(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(panId?.pan)){
      formData.append('pan', panId?.pan)
      formData.append('user_id', currentUser?.id)
      setPanLoading({icon: true, loading: true})
      updatePanApplicant(userType, dealership_id, currentUser, formData, id)
        .then(res => {
          setPanLoading({icon: true, loading: false, success: true})
          setCollapseOpen(false)
          CIBILReport()
        })
        .catch(e => {
          console.log(e)
          setPanLoading({icon:true, loading:false, success:false, error:true})
        })
    } else {
      setErrorMsg({pan: 'Invalid PAN Number'})
    }
  }

  const ValidateProps = (valid) => {
    return(
      <div>
        {
          valid?.icon ?
          valid?.loading ? <CircularProgress size={20}/> :
          valid?.success ? <CheckCircleOutlineOutlinedIcon fontSize='medium' style={{color:'#4caf50'}} /> :
          <CancelOutlinedIcon fontSize='medium' color='error' /> : null
        }
      </div>
    )
  }

  return (
    <>
      <Grid container style={{marginLeft: 6}}>
        <Grid item md={12} style={{marginBottom: 12}}>
          <div style={{display: 'flex', justifyContent: 'space-between', margin: 0, alignItems: 'center', paddingRight: 10}}>
            <ViewData title='Name' value={dealerData?.first_name+' '+dealerData?.last_name} style={{marginBottom: 0}} />
            <Typography variant='body2' style={{color: 'rgb(0,0,0,0.4)'}}>{dealerData?.userType}</Typography>
          </div>
        </Grid>
        {
          // !values?.cibil_score &&
          <>
            <Grid {...gridItem} md={4}>
              {<Button variant='outlined' color='primary' style={{marginTop: 10}} onClick={CIBILReport}>Check CIBIL Score</Button>}
            </Grid>
            <Grid {...gridItem} md={2}style={{marginTop:15}}>
              {ValidateProps(cibilLoading)}
            </Grid>
          </>
        }
        <Collapse in={collapseOpen} style={{width: '100%'}}>
          <Grid {...gridItem} md={12}>
            <Alert severity='warning'>
              <AlertTitle>No Pan details Found for this User, Please Enter PAN to check CIBIL Score!</AlertTitle>
              <Grid container>
                <Grid {...gridItem} md={6}>
                  <label>PAN Number</label>
                  <TextInput
                    name="pan"
                    error={errorMsg.pan}
                    helperText={errorMsg.pan}
                    onChange={handleChange}
                    InputProps={ValidateProps(panLoading)}
                  >
                  </TextInput>
                </Grid>
                <Grid {...gridItem} md={2}>
                  <Button variant='contained' style={{backgroundColor: '#4caf50', color: 'white', marginTop: 18}} onClick={() => panId?.pan && handlePANSubmit()}>Submit</Button>
                </Grid>
              </Grid>
            </Alert>
          </Grid>
        </Collapse>
        <Grid container>
          <Grid item md={6}>
            <ViewData title='CIBIL Score' value={cibilData?.cibil_score || values?.cibil_score} />
          </Grid>
          <Grid item md={6}>
            <ViewData title='Updated on' value={cibilData?.modified_date || values?.modified_date} />
          </Grid>
          {
            cibilEditMode ? 
              <>
                <Grid {...gridItem} md={6}>
                  <label>Total no.of loans</label>
                  <TextInput
                    name='loans_count'
                    value={cibilData?.loans_count || values?.loans_count}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>No of closed loans</label>
                  <TextInput
                    name='closed_loans_count'
                    value={cibilData?.closed_loans_count || values?.closed_loans_count}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>No of overdue accounts</label>
                  <TextInput
                    name='od_accounts_count'
                    value={cibilData?.od_accounts_count || values?.od_accounts_count}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Overdue Amount</label>
                  <TextInput
                    name='od_amount'
                    value={cibilData?.od_amount || values?.od_amount}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Current O/S Amount</label>
                  <TextInput
                    name='current_os_amount'
                    value={cibilData?.current_os_amount || values?.current_os_amount}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Vintage with CIBIL bureau</label>
                  <TextInput
                    name='cibil_vintage'
                    value={cibilData?.cibil_vintage || values?.cibil_vintage}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>No of enquiries last 6 months</label>
                  <TextInput
                    name='no_of_enquiries'
                    value={cibilData?.no_of_enquiries || values?.no_of_enquiries}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  />
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Loans in Bureau Report</label>
                  <TextInput
                    select
                    name='is_loan_in_bureau'
                    value={cibilData?.is_loan_in_bureau || values?.is_loan_in_bureau}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </TextInput>
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Credit Card in Bureau Report</label>
                  <TextInput
                    select
                    name='is_cc_in_cibil'
                    value={cibilData?.is_cc_in_cibil || values?.is_cc_in_cibil}
                    onChange={onChange}
                  // disabled={cibilEdit}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </TextInput>
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>No of times of highest DPD</label>
                  <TextInput
                    select
                    name="highest_dpd"
                    value={values?.highest_dpd || ''}
                    error={errors.highest_dpd}
                    helperText={errors.highest_dpd}
                    onChange={onChange}
                    // disabled={cibilEdit}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="NA">0</option>
                    <option value="1">1 time</option>
                    <option value="2">2 times</option>
                    <option value="3">3 times</option>
                    <option value="4">&gt;3 times</option>
                  </TextInput>
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Highest DPD bracket</label>
                  <TextInput
                    select
                    name="highest_dpd_bracket"
                    value={values?.highest_dpd_bracket || ''}
                    error={errors.highest_dpd_bracket}
                    helperText={errors.highest_dpd_bracket}
                    onChange={onChange}
                    // disabled={cibilEdit}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="0">0</option>
                    <option value="01-29">01 - 29</option>
                    <option value="30-59">30 - 59</option>
                    <option value="60-89">60 - 89</option>
                    <option value="STD">STD</option>
                    <option value="SUB">SUB</option>
                    <option value="SMA">SMA</option>
                    <option value="90+">90+</option>
                  </TextInput>
                </Grid>
                <Grid {...gridItem} md={6}>
                  <label>Status - For Loans &amp; Credit Cards</label>
                  <TextInput
                    select
                    name="status"
                    value={values?.status || ''}
                    error={errors.status}
                    helperText={errors.status}
                    onChange={onChange}
                    // disabled={cibilEdit}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="NA">Select</option>
                    <option value="Clean Track">Clean Track</option>
                    <option value="Written-off">Written-off</option>
                    <option value="Suit Filed">Suit Filed</option>
                    <option value="Wilful Default Post [WO] Settled">Wilful Default Post [WO] Settled</option>
                    <option value="Settled">Settled</option>
                    <option value="Restructured loan">Restructured loan</option>
                  </TextInput>
                </Grid>
              </> :
              <>
                <Grid item md={6}>
                  <ViewData title='Total no.of loans' value={cibilData?.loans_count || values?.loans_count} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No of closed loans' value={cibilData?.closed_loans_count || values?.closed_loans_count} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No of overdue accounts' value={cibilData?.od_accounts_count || values?.od_accounts_count} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Overdue Amount' value={cibilData?.od_amount || values?.od_amount} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Current O/S amount' value={cibilData?.current_os_amount || values?.current_os_amount} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Vintage with CIBIL bureau' value={cibilData?.cibil_vintage || values?.cibil_vintage} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No of enquiries last 6 months' value={cibilData?.no_of_enquiries || values?.no_of_enquiries} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Loans in Bureau Report' value={cibilData?.is_loan_in_bureau || values?.is_loan_in_bureau} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No of times of highest DPD' value={cibilData?.highest_dpd} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Highest DPD bracket' value={cibilData?.highest_dpd_bracket} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Credit Card in Bureau Report' value={cibilData?.is_cc_in_cibil === 1 ? 'Yes' : 'No'} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Status - For Loans &amp; Credit Cards' value={cibilData?.status} />
                </Grid>
              </>
          }
        </Grid>
      </Grid>
    </>
  )
}

export default DealerCreditInfoForm;
