import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import LeegalityAgreementTable from './components/LeegalityAgreementTable';
import LeegalityInvitees from './components/LeegalityInvitees';
import LeegalityPdfView from './components/LeegalityPdfView'
import SignedLayout from './components/SignedLayout';
import LeegalityLayout from './LeegalityLayout';
import CustomToken from '../../components/CommonComponents/CustomToken';
import { getCoApplicantByDealershipId, getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById } from '../../services/dealerships.service';
import { getAllGuarantor, getPdfContent } from '../../services/leegality.service';
import { getLoanDocumentHistoryById } from '../../services/loans.service';
import apiCall from '../../utils/api.util';


const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
    display: 'flex',
  },
  ifSigned: {
    width: '100px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  sendButton: {
    padding: '10px 20px',
  },
  content: {
    overflowY: 'auto',
  },
  info: {
    color: 'rgb(0,0,0,0.4)',
    marginTop:8
  }

}));

const SignRequestLayout = ({ onClose, title, type, dealershipId , loanId, callback, loanAmount, productId,currentUser }) => {
  const classes = useStyles();
  const [dealership, setDealership] = useState({})
  const [dealers, setDealers] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedDealers, setSelectedDealers] = useState([])
  const [selectedCoAppicants, setSelectedCoAppicants] = useState([])
  const [selectedGuarantors, setSelectedGuarantors] = useState([])
  const [status, setStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [loansData, setLoansData] = useState({});
  const [pdfUrl, setPdfUrl] = useState();
  const [signedLetterUrl, setSignedLetterUrl] = useState();
  const [guarantor, setGuarantor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideSend, setHideSend] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false)
  const [reinitiate, setReinitiate] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (loanId) {
      setLoading(true);
      getLoanDocumentHistoryById(loanId, type)
        .then(res => {
          setLoansData(res);
          setSignedLetterUrl(res.sanction_url)
          if (!res?.document_id || reinitiate) {
            handleDataWithOutDocID()
          }
          setLoading(false);
        })
        .catch(err => {
          console.log('getLoansData >> ', err)
          setLoansData();
        })
    }
  }, [reinitiate]);

  const handleDataWithOutDocID = () => {
    if (['sanction', 'application'].includes(type)) {
      setPdfLoading(true)
      getPdfContent(loanId, dealershipId, type)
        .then(res => {
          setPdfLoading(false)
          setPdfUrl(res);
        })
        .catch(err => {
          setPdfLoading(false)
          console.log('getPdfContent >> ', err);
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
    if(dealershipId && !loansData?.document_id || reinitiate) {
      getDealershipById(dealershipId)
        .then(setDealership)
        .catch(err => {
          console.log('getDealershipDetails >>', err);
        })
      getDealersByDealershipId(dealershipId)
        .then(res => {
          const result = res?.filter(d => d?.is_active == 1)
          setDealers(result);
        })
        .catch(err => {
          console.log('getDealersByDealershipId >> ', err);
        });
      getCoApplicantByDealershipId(dealershipId)
        .then(res => {
          const result = res?.filter(d => d?.is_active == 1)
          setApplicants(result);
        })
        .catch(err => {
          console.log('getCoApplicantByDealershipId >> ', err)
        })

      getAllGuarantor(dealershipId)
        .then(res => {
          const result = res?.filter(d => d?.is_active == 1)
          setGuarantor(result);
        })
        .catch(err => {
          console.log('getAllGuarantor >>', err)
        })
    }
  }

  const handleClose = () => {
    setPdfUrl();
    setLoansData();
    onClose();
  }

  const updateSelectedDealers = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      if(inviteeData?.signatures?.length === 2){
        let buffer = [...selectedDealers, inviteeData]
        const result = buffer.filter(d => d?.id !== inviteeData?.id)
        setSelectedDealers([...result, inviteeData]);
      } else {
        setSelectedDealers([...selectedDealers, inviteeData])
      }
    } else {
      const result = selectedDealers.filter(d => d.id !== inviteeData.id)
      setSelectedDealers(result)
    }
  }
  const updateSelectedCoAppicants = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      if(inviteeData?.signatures?.length === 2){
        let buffer = [...selectedCoAppicants, inviteeData]
        const result = buffer.filter(d=> d?.id !== inviteeData?.id)
        setSelectedCoAppicants([...result, inviteeData])
      } else {
        setSelectedCoAppicants([...selectedCoAppicants, inviteeData])
      }
    } else {
      const result = selectedCoAppicants.filter(d => d.id !== inviteeData.id)
      setSelectedCoAppicants(result)
    }
  }
  const updateSelectedGuarantors = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      if(inviteeData?.signatures?.length === 2){
        let buffer = [...selectedGuarantors, inviteeData]
        const result = buffer.filter(d=> d?.id !== inviteeData?.id)
        setSelectedGuarantors([...result, inviteeData])
      } else {
        setSelectedGuarantors([...selectedGuarantors, inviteeData])
      }
    } else {
      const result = selectedGuarantors.filter(d => d.id !== inviteeData.id)
      setSelectedGuarantors(result)
    }
  }
  const ReloadData = () => {
    getLoanDocumentHistoryById(loanId, type)
      .then(res => {
        setLoansData(res);
        setLoading(false);
      })
      .catch(err => {
        console.log('getLoansData >> ', err)
      })
  }

  const sendInvitees = () => {
    setHideSend(true);
    if (selectedDealers.length !== 0) {
      let apiUrl = 'document/sign'
      let qry = []
      if(reinitiate) { qry.push('reinitiate') }
      if(qry?.length) apiUrl += '?' + qry.join('&')

      apiCall(apiUrl, {
        body: {
          dealer: selectedDealers,
          coapplicants: selectedCoAppicants,
          guarantor: selectedGuarantors,
          dealership_id: dealershipId,
          type: type,
          loanId: loanId,
        },
        method: 'POST',
      })
        .then(res => {
          if (res.status === 'SUCCESS') {
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
            setTimeout(() => {
              ReloadData();
              onClose();
              setHideSend(false);
            }, 3000);
          } else {
            setHideSend(false)
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
            console.log('>> Document Details status error >> ', res)
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
    else {
      setHideSend(false);
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
      }, 2000)

    }
  }
  return (
    <>
      <DialogTitle disableTypography className={classes.dTitle}>
        {
          type === 'sanction' ? (<strong>Sanction Letter</strong>) : type === 'agreement' ? <strong>Loan Agreement</strong> : <strong>{title}</strong>
        }
        {loansData?.is_signed == '1' ? <div className={classes.ifSigned}><CustomToken label='Signed' variant='success' icon='tick' /></div> : null}
      </DialogTitle>
      <IconButton size="small" aria-label="close" className={classes.closeButton} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      {
        loansData?.is_signed && !reinitiate ?
          (
            <SignedLayout loansData={loansData}/>
          ) : (
            <DialogContent dividers className={classes.content}>
              {
                loading ? (
                  <CircularProgress className="circular-progress-color" variant="determinate" color="green" />
                ) : (loansData?.document_id && !reinitiate ? (
                  <LeegalityLayout docId={loansData?.document_id} dealershipId={dealershipId} currentUser={currentUser} />
                ) : (
                  <Grid container spacing={2}>
                    {
                      type === 'sanction' || type === 'application' ? (
                        <LeegalityPdfView pdfUrl={pdfUrl} loading={pdfLoading} />
                      ) : (
                        <LeegalityAgreementTable
                          loanAmount={loanAmount}
                          dealership={dealership}
                          dealers={dealers}
                          applicants={applicants}
                          guarantor={guarantor}
                          productId={productId}
                        />
                      )
                    }
                    <LeegalityInvitees dealers={dealers} applicants={applicants} guarantor={guarantor} updateSelectedDealers={updateSelectedDealers} updateSelectedCoAppicants={updateSelectedCoAppicants} updateSelectedGuarantors={updateSelectedGuarantors} />
                  </Grid>
                ))
              }
            </DialogContent>
          )
      }
      <DialogActions>
        <Box pl={2} pr={2} style={{ display: 'flex' }}>
          <div style={{ marginRight: '20px' }}>
            {
              status && (
                <Box pt={2} pl={3} color="error.main"  >
                  You must select Dealers &amp; CoApplicants...
                </Box>
              )
            }
            {
              successStatus && (
                <Box pt={2} pl={3} color="success.main"  >
                  {successStatus}
                </Box>
              )
            }
          </div>
          {
            !loading && loansData?.document_id && !reinitiate ? null : hideSend ? null : (
              <Button variant="contained" onClick={sendInvitees} color="primary">
                Send
              </Button>
            )
          }
          {
            loansData?.is_signed == '1' && !reinitiate &&
              <Button variant="contained" color='primary' onClick={() => setReinitiate(true)}>Re-Initiate</Button>
          }
        </Box>
      </DialogActions>
    </>
  )
}

export default SignRequestLayout;