import { Alert, Grid, Text } from '@mantine/core';
import { CircularProgress, Collapse } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { IconBrandSpeedtest, IconInfoCircle } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { Button } from '../../../components/Mantine/Button/Button';
import { TextInput as MantineTextInput } from '../../../components/Mantine/TextInput/TextInput';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getCibilReport, updatePanApplicant } from '../../../services/creditreport.service';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';

const DealerCreditInfoForm = ({ values, errors, onChange, editMode, dealerData, currentUser, setFieldValue, cibilEditMode, editable }) => {
  let pan = dealerData?.pan
  let userType = dealerData?.category
  let dealership_id = dealerData?.dealership_id
  let id = dealerData?.id
  const queryClient = useQueryClient()
  const [panId, setPanId] = useState({})
  const [panLoading, setPanLoading] = useState({icon: false})
  const [cibilLoading, setCibilLoading] = useState({ icon: false })
  const [cibilData, setCibilData] = useState()
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState({})
  const formData = new FormData()
  const [collapseOpen, setCollapseOpen] = useState(false)


  const CIBILReport = () => {
    if(pan || panId?.pan){
      setCibilLoading({icon:true, loading:true})
      getCibilReport(dealership_id, id, pan || panId?.pan, userType?.replace(/[- ]/g,'')?.toLowerCase())
        .then(data => {
          setCibilLoading({icon:true, loading:false, success:true})
          queryClient.invalidateQueries('credit')
          setCibilData(data)
        })
        .catch(e => {
          displayNotification({message: e, variant: 'error'});
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
          setPanLoading({icon:true, loading:false, success:false, error:true})
        })
    } else {
      setErrorMsg({pan: 'Invalid PAN Number'})
    }
  }

  const ValidateProps = (valid) => {
    return(
      <Grid.Col>
        {valid?.icon ? valid?.loading ? (
          <CircularProgress size={20}/>
        ) : (
          valid?.success ? (
            <CheckCircleOutlineOutlinedIcon fontSize='medium' style={{color:'#4caf50'}} /> 
          ) : null
        ) : null}
      </Grid.Col>
    )
  }

  const handleDownload = () => {
    if(cibilData?.cibil_file_url){
      window.open(cibilData?.cibil_file_url, '_blank')
    }
  }

  return (
    <>
      <Grid gutter="md">
        <Grid.Col>
          <ViewData 
            title='Name' 
            value={dealerData?.first_name+' '+dealerData?.last_name} 
          />
        </Grid.Col>

        {dealerData?.userType && (
          <Grid.Col>
            <Text>{dealerData?.userType}</Text>
          </Grid.Col>
        )}
        
        {!editable && (
          <Grid.Col>
            <UserCan
              role={currentUser.role_name}
              perform={rulesList.credit_refresh}
              yes={() => (
                <Button 
                  variant='outline' 
                  onClick={CIBILReport} 
                  leftSection={<IconBrandSpeedtest size={24} />}
                >
                  Check CIBIL Score
                </Button>
              )}
              no={() => (
                <Alert variant="light" color="yellow" radius="md" title="Info">
                  Only Credit team can check/refresh CIBIL. Kindly contact Credit team.
                </Alert>
              )} 
            />
          </Grid.Col>
        )}

        {ValidateProps(cibilLoading)}
        
        <Grid.Col>
          <Collapse in={collapseOpen} style={{width: '100%'}}>
            <Alert 
              variant="light" 
              color="orange" 
              radius="md" 
              title="No Pan details Found for this User, Please Enter PAN to check CIBIL Score!" 
              icon={<IconInfoCircle size={24} />}
              mb="md"
            >     
              <Grid gutter="sm" align="end">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <MantineTextInput 
                    label="PAN Number"
                    name="pan"
                    error={errorMsg.pan}
                    onChange={handleChange}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 2 }}>
                  <Button
                    // variant="outline"
                    color="orange"
                    onClick={() => panId?.pan && handlePANSubmit()}
                  >
                    Submit
                  </Button>
                </Grid.Col>
              </Grid>
            </Alert>
          </Collapse>
        </Grid.Col>
      </Grid>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ViewData title='CIBIL Score' value={cibilData?.cibil_score || values?.cibil_score} />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ViewData title='Updated on' value={cibilData?.modified_date || values?.modified_date} />
        </Grid.Col>

        {cibilEditMode ? (
          <>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Total no.of loans</label>
              <MantineTextInput
                name='loans_count'
                value={cibilData?.loans_count || values?.loans_count}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <MantineTextInput
                label="No of closed loans"
                name='closed_loans_count'
                value={cibilData?.closed_loans_count || values?.closed_loans_count}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <MantineTextInput
                label="No of overdue accounts"
                name='od_accounts_count'
                value={cibilData?.od_accounts_count || values?.od_accounts_count}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <MantineTextInput
                label="Overdue Amount"
                name='od_amount'
                value={cibilData?.od_amount || values?.od_amount}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <MantineTextInput
                label="Current O/S Amount"
                name='current_os_amount'
                value={cibilData?.current_os_amount || values?.current_os_amount}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <MantineTextInput
                label="Vintage with CIBIL bureau"
                name='cibil_vintage'
                value={cibilData?.cibil_vintage || values?.cibil_vintage}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <MantineTextInput
                label="No of enquiries last 6 months"
                name='no_of_enquiries'
                value={cibilData?.no_of_enquiries || values?.no_of_enquiries}
                onChange={onChange}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Loans in Bureau Report</label>
              <TextInput
                select
                name='is_loan_in_bureau'
                value={cibilData?.is_loan_in_bureau || values?.is_loan_in_bureau}
                onChange={onChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </TextInput>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Credit Card in Bureau Report</label>
              <TextInput
                select
                name='is_cc_in_cibil'
                value={cibilData?.is_cc_in_cibil || values?.is_cc_in_cibil}
                onChange={onChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </TextInput>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>No of times of highest DPD</label>
              <TextInput
                select
                name="highest_dpd"
                value={values?.highest_dpd || ''}
                error={errors.highest_dpd}
                helperText={errors.highest_dpd}
                onChange={onChange}
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Highest DPD bracket</label>
              <TextInput
                select
                name="highest_dpd_bracket"
                value={values?.highest_dpd_bracket || ''}
                error={errors.highest_dpd_bracket}
                helperText={errors.highest_dpd_bracket}
                onChange={onChange}
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Status - For Loans &amp; Credit Cards</label>
              <TextInput
                select
                name="status"
                value={values?.status || ''}
                error={errors.status}
                helperText={errors.status}
                onChange={onChange}
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
            </Grid.Col>
          </>
        ) : (
          <>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Total no.of loans' value={cibilData?.loans_count || values?.loans_count} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='No of closed loans' value={cibilData?.closed_loans_count || values?.closed_loans_count} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='No of overdue accounts' value={cibilData?.od_accounts_count || values?.od_accounts_count} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Overdue Amount' value={cibilData?.od_amount || values?.od_amount} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Current O/S amount' value={cibilData?.current_os_amount || values?.current_os_amount} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Vintage with CIBIL bureau' value={cibilData?.cibil_vintage || values?.cibil_vintage} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='No of enquiries last 6 months' value={cibilData?.no_of_enquiries || values?.no_of_enquiries} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Loans in Bureau Report' value={cibilData?.is_loan_in_bureau === 1 ? 'Yes' : 'No'} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='No of times of highest DPD' value={cibilData?.highest_dpd} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Highest DPD bracket' value={cibilData?.highest_dpd_bracket} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Credit Card in Bureau Report' value={cibilData?.is_cc_in_cibil === 1 ? 'Yes' : 'No'} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <ViewData title='Status - For Loans &amp; Credit Cards' value={cibilData?.status} />
            </Grid.Col>
          </>
        )}
      </Grid>
    </>
  )
}

export default DealerCreditInfoForm;
