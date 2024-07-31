import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import LeegalityAgreementTable from './components/LeegalityAgreementTable';
import LeegalityInvitees from './components/LeegalityInvitees';
import LeegalityPdfView from './components/LeegalityPdfView'
import SignedLayout from './components/SignedLayout';
import LeegalityLayout from './LeegalityLayout';
import CustomToken from '../../components/CommonComponents/CustomToken';
import { action_id, resources_id } from '../../config/accessControl';
import CheckAllowed from '../../pages/rbac/CheckAllowed';
import { getAllApplicantsByDealershipId } from '../../services/dealers.service';
import { deleteResignDocument, getDealershipById, getResignList, getTrancheStatusById } from '../../services/dealerships.service';
import { getPdfContent } from '../../services/leegality.service';
import { getLoanDocumentHistoryById } from '../../services/loans.service';
import apiCall from '../../utils/api.util';
import { Box, Button, Grid, Group, Loader, Modal, NumberInput, Text } from '@mantine/core';
import classes from './SignRequestLayout.module.css'
import { displayNotification } from '../CommonComponents/Notification/displayNotification';
import { format } from 'date-fns';

const SignRequestLayout = ({ onClose, opened = false, title, type, dealershipId, loanId, callback, loanAmount, productId, currentUser, getStatus = false }) => {
  const [dealership, setDealership] = useState({})
  const [applicants, setApplicants] = useState([])
  const [selectedDealers, setSelectedDealers] = useState([])
  const [selectedCoAppicants, setSelectedCoAppicants] = useState([])
  const [selectedGuarantors, setSelectedGuarantors] = useState([])
  const [activeState, setActiveState] = useState({});
  const [status, setStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [loansData, setLoansData] = useState({});
  const [pdfUrl, setPdfUrl] = useState();
  const [signedLetterUrl, setSignedLetterUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [hideSend, setHideSend] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false)
  const [reinitiate, setReinitiate] = useState(false)
  const [resign, setResign] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const queryClient = useQueryClient();
  const [dateValue, setDateValue] = useState(new Date());

  const getTrancheStatus = useQuery({
    queryKey: ['getTrancheStatus', dealershipId],
    queryFn: () => getTrancheStatusById(dealershipId),
    enabled: Boolean(getStatus && opened && dealershipId),
  })

  const handleResign = () => {
    deleteResignDocument({ dealershipId, docId: loansData?.document_id })
      .then((data) => {
        displayNotification({
          message: 'Document Override successfully',
          variant: 'success',
        });
        onClose()
      })
      .catch(err => {
        displayNotification({
          message: err?.message || 'Document Override successfully',
          variant: 'error',
        });
      })
  }
  // used to null the selected data after modal state changes
  useEffect(() => {
    setSelectedDealers([])
    setSelectedCoAppicants([])
    setSelectedGuarantors([])
  }, [opened])

  useEffect(() => {
    if (loanId) {
      setLoading(true);
      getLoanDocumentHistoryById(loanId, type, format(dateValue, 'yyyy-MM-dd'))
        .then(res => {
          setLoansData(res);
          setSignedLetterUrl(res.sanction_url)
          if (!res?.document_id || reinitiate) {
            handleDataWithOutDocID()
          }
          setLoading(false);
        })
        .catch(err => {
          setLoansData();
        })
    }
  }, [reinitiate, opened, dateValue]);

  useEffect(() => {
    if (loansData?.document_id) {
      getResignList({ dealershipId, documentId: loansData?.document_id })
        .then(res => {
          setResign(res?.[0]?.is_override == 1);
        })
        .catch(err => {
          displayNotification({
            message: err,
            variant: 'error',
          });
        });
    }
  }, [loansData]);

  const handleDataWithOutDocID = () => {
    if (['sanction', 'application'].includes(type)) {
      setPdfLoading(true)
      getPdfContent(loanId, dealershipId, type ,format(dateValue, 'yyyy-MM-dd'))
        .then(res => {
          setPdfLoading(false)
          setPdfUrl(res);
        })
        .catch(err => {
          setPdfLoading(false)
          displayNotification({
            message: err,
            variant: 'error',
          })
        })
    }
    if (dealershipId && !loansData?.document_id || reinitiate) {
      getDealershipById(dealershipId)
        .then(setDealership)
        .catch(err => {
          console.log('getDealershipDetails >>', err);
        })
      getAllApplicantsByDealershipId(dealershipId)
        .then(res => {
          const result = res?.filter(d => d?.is_active == 1)
          setApplicants(result);
        })
        .catch(err => {
          console.log('getApplicantByDealershipId >> ', err)
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
      if (inviteeData?.signatures?.length === 2) {
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
      if (inviteeData?.signatures?.length === 2) {
        let buffer = [...selectedCoAppicants, inviteeData]
        const result = buffer.filter(d => d?.id !== inviteeData?.id)
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
      if (inviteeData?.signatures?.length === 2) {
        let buffer = [...selectedGuarantors, inviteeData]
        const result = buffer.filter(d => d?.id !== inviteeData?.id)
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
      let apiUrl = `document/sign?date=${format(dateValue, 'yyyy-MM-dd')}`
      let qry = []
      if (reinitiate) { qry.push('reinitiate') }
      if (qry?.length) apiUrl += '&' + qry.join('&')

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
            displayNotification({
              message: res?.message,
              variant: 'success',
            })
            setTimeout(() => {
              ReloadData();
              onClose();
              setHideSend(false);
            }, 3000);
          } else {
            setHideSend(false)
            displayNotification({
              message: res?.message,
              variant: 'error',
            })
          }
        })
        .catch(err => {
          console.log(err)
        }).finally(() => {
          setDateValue(new Date())
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

  const activateDealer = (value) => {
    // used to extend the document expire days
    // by default it will be 60 days
    setLoading(true);
    apiCall(`document/reactivate/${loansData?.document_id}/${value}`)
      .then((res) => {
        apiCall(`dealership/${dealershipId}/document/${loansData?.document_id}`)
          .then((res) => {
            if (res.status === 'SUCCESS') {
              if (res.data?.status) {
                setActiveState(res?.data?.data);
                queryClient.invalidateQueries(['getLegality-document']);
              }
            } else {
              displayNotification({
                message: res?.message,
                variant: 'error',
              })
              setActiveState();
            }
          })
          .catch((err) => {
            console.log(err);
            setActiveState();
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setOpenModal(false);
      })
  };

  return (
    <>
      <Modal
        opened={opened || false}
        onClose={() => { onClose(); setPdfUrl(); setLoansData(); setDateValue(new Date()) }}
        title={
          <Group gap={10}>
            {
              type === 'sanction' ? (<strong>Sanction Letter</strong>) : type === 'agreement' ? <strong>Loan Agreement</strong> : <strong>{title}</strong>
            }
            {getTrancheStatus?.data?.[0]?.tranche_status ?
              <div className={classes.ifSigned}>
                <CustomToken
                  label={getTrancheStatus?.data?.[0]?.tranche_status === 'open' ? `Active (${getTrancheStatus?.data?.[0]?.open_tranche_count})` : `Closed (${getTrancheStatus?.data?.[0]?.open_tranche_count})`}
                  variant={getTrancheStatus?.data?.[0]?.tranche_status === 'open' ? 'success' : 'error'}
                  icon={getTrancheStatus?.data?.[0]?.tranche_status === 'open' ? 'tick' : 'cross'}
                />
              </div>
              : null
            }
            {loansData?.is_signed == '1' ? <div className={classes.ifSigned}><CustomToken label='Signed' variant='success' icon='tick' /></div> : null}
          </Group>
        }
        style={{ position: 'absolute', zIndex: 9998 }}
        size={'70%'}
      >
        {
          loansData?.is_signed && !reinitiate ?
            (
              <SignedLayout loansData={loansData} />
            ) : (
              <Box className={classes.content}>
                {
                  loading ? (
                    <Group justify={'center'}>
                      <Loader color="green" />
                    </Group>
                  )
                    :
                    (loansData?.document_id && !reinitiate ? (
                      <LeegalityLayout docId={loansData?.document_id} dealershipId={dealershipId} currentUser={currentUser} setActiveState={setActiveState} />
                    )
                      : (
                        <Grid container spacing={2} mt={'lg'}>
                          {
                            type === 'sanction' || type === 'application' ? (
                              <LeegalityPdfView pdfUrl={pdfUrl} loading={pdfLoading} />
                            ) : (
                              <LeegalityAgreementTable
                                loanAmount={loanAmount}
                                dealership={dealership}
                                dealers={applicants?.filter(item => item?.category === 'DEALER')}
                                applicants={applicants?.filter(item => item?.category === 'COAPPLICANT')}
                                guarantor={applicants?.filter(item => item?.category === 'GUARANTOR')}
                                productId={productId}
                                type={type}
                                dateValue={dateValue}
                              />
                            )
                          }
                          <LeegalityInvitees dealers={applicants?.filter(item => item?.category === 'DEALER')} applicants={applicants?.filter(item => item?.category === 'COAPPLICANT')} guarantor={applicants?.filter(item => item?.category === 'GUARANTOR')} updateSelectedDealers={updateSelectedDealers} updateSelectedCoAppicants={updateSelectedCoAppicants} updateSelectedGuarantors={updateSelectedGuarantors} dateValue={dateValue} setDateValue={setDateValue}/>
                        </Grid>
                      ))
                }
              </Box>
            )
        }
        <Group gap={'8px'} justify={'flex-end'} style={{ display: 'flex' }} mt={'md'}>
          <div style={{ marginRight: '20px' }}>
            {
              status && (
                <Box pt={2} color="error.main"  >
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
            loansData?.is_signed == '1' && !reinitiate && (
              <Button variant="contained" color='primary' onClick={() => { setReinitiate(true); }}>Re-Initiate</Button>)
          }
          {
            !loansData?.is_signed && loansData?.document_id && resign ?
              <Button variant="contained" color='primary' onClick={handleResign} style={{ marginLeft: 12 }}>Override Document</Button> : null
          }
          {activeState?.invitations?.filter((item) => item?.expired)?.length > 0
            ? (
              <CheckAllowed currentUser={currentUser} resource={resources_id?.dashboard} action={action_id?.dashboard.reactivate}>
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginLeft: 12 }}
                  onClick={() => setOpenModal({ modal: true, value: 60 })}
                >
                  Activate
                </Button>
              </CheckAllowed>
            ) : null
          }
        </Group>
        <Modal
          opened={openModal?.modal || false}
          onClose={() => {
            setOpenModal(false);
          }}
          title={'Are you sure'}
          style={{ position: 'absolute', zIndex: 9999 }}
        >
          <Text>
            Do you want to extend the expire date of this document?
          </Text>
          <span style={{ fontSize: '12px', color: 'gray' }}>Enter no of days to extend the expire date. By default it will be 60 Days</span>
          {/* <TextInput type='number' style={{ marginBottom: 12 }} value={openModal?.value} onChange={(e) => setOpenModal({ value: e.target.value, modal: true })} /> */}
          <NumberInput value={parseInt(openModal?.value)} onChange={(e) => setOpenModal({ value: e, modal: true })} hideControls />
          <Group justify={'center'} gap={8} mt={'md'}>
            <Button
              onClick={() => {
                setOpenModal(false);
              }}
              variant='outline'
              size='xs'
            >
              No
            </Button>
            <Button
              onClick={() => activateDealer(openModal?.value)}
              color='green'
              size='xs'
            >
              Yes
            </Button>
          </Group>
        </Modal>
      </Modal>
    </>
  )
}

export default SignRequestLayout;