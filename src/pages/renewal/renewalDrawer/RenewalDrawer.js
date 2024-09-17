import { Divider, Collapse } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ArrowDropDownSharp, ArrowRightOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import RenewalDrawerFooter from './RenewalDrawerFooter';
import { getDealershipById } from '../../../services/dealerships.service';
import { getRenewalFeeStatus, updateRenewalLoanStatus } from '../../../services/renewal.service';
import LoanInfo from '../../dashboard/RightDrawer/LoanInfo';
import DealershipInfo from '../../dealershipDetails/components/DealershipInfo';
import DealersList from '../../dealershipDetails/components/DealersList';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import { Box, Button, Group, Modal, Paper, Text } from '@mantine/core';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';

const getRemarksMessage = (status, isReject, isPushback) => {
  if (isReject) {
    return 'Rejected';
  }
  if (isPushback) {
    return 'Please check again!'
  }
  if (status === 'approval') {
    return 'Approved'
  }
  if (status === 'review') {
    return 'Please approve'
  }
  return 'Please approve'
}
const getMessage = (status, isReject, isPushback, isEnhancement) => {
  if (isReject) {
    return 'Are you sure you want to REJECT this renewal?'
  }
  if (isPushback) {
    return 'Move to Previous Stage?'
  }
  if (isEnhancement) {
    return 'Are you sure want to move your loan for Enhancement?'
  }
  if (status === 'approval') {
    return 'Are you sure you want to APPROVE this renewal?'
  }
  return 'Move to Next Stage?'
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '0 24px 10px 24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
  },
  dialog: {
    minWidth: '30vw'
  },
  contentWrapper: {
    padding: 12,
    flex: 1,
    overflow: 'auto',
    overflowX: 'hidden'
  },
  wrapperTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  title: {
    top: 0,
    left: 0,
    padding: '8px 16px',
    background: theme.palette.grey[300],
    borderBottomRightRadius: 12,
    boxShadow: '0px 0px 4px #8d8d8d',
  },
  closeIcon: {
    marginTop: 8,
  },
  collapseCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  wrap: {
    flexGrow: '1',
    padding: '16px',
    overflowY: 'auto',
  }
}))


const RenewalDrawer = ({ id, selectedLoanData, status, currentUser, data, onClose }) => {
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [isReject, setIsReject] = useState(false);
  const [isPushback, setIsPushback] = useState(false);
  const [isEnhancement, setIsEnhancement] = useState(false)
  const [errorStatus, setErrorStatus] = useState()
  const [collapse, setCollapse] = useState(false);
  const [info, setInfo] = useState();
  const classes = useStyles();
  const dealershipData = useQuery(['dealership-info', id], () => getDealershipById(id), { refetchOnWindowFocus: false })
  const { enqueueSnackbar } = useSnackbar();

  const getRenewalFeeDetails = useQuery({
    queryKey: ['renewal-fee-details', selectedLoanData?.loan_id],
    queryFn: () => getRenewalFeeStatus({ dealership_id: selectedLoanData?.loan_id }),
    enabled: Boolean(selectedLoanData?.loan_id),
  })

  const closeReviewModal = () => {
    setIsReject(false);
    setIsPushback(false);
    setReviewModal(false)
  }

  const openReviewModal = () => {
    setRemarks(getRemarksMessage(status, isReject, isPushback))
    setReviewModal(true)
  }

  const handleReject = () => {
    setIsReject(true)
    setRemarks(getRemarksMessage(status, true, isPushback))
    setReviewModal(true)
  }

  const handlePushBack = () => {
    setIsPushback(true)
    setRemarks(getRemarksMessage(status, isReject, true))
    setReviewModal(true)
  }

  const handleEnhancement = () => {
    setIsEnhancement(true)
    setRemarks(getRemarksMessage(status, isEnhancement, true))
    setReviewModal(true)
  }

  const updateLoanStatus = () => {
    if (remarks) {
      setLoading(true)
      let reqBody = {
        remarks: remarks,
        loan_id: selectedLoanData?.loan_id,
        product_id: info?.product_id ? parseInt(info?.product_id) : parseInt(selectedLoanData?.new_product_id),
        loan_amount: info?.loan_amount ? parseInt(info?.loan_amount) : parseInt(selectedLoanData?.new_loan_amount),
        renewal_month: status === 'draft' && selectedLoanData?.renewal_month,
        category: isEnhancement && 'renewal',
        status,
        isReject,
        isPushback,
        isEnhancement,
      }
      updateRenewalLoanStatus(reqBody)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        })
        .catch(err => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
        .finally(() => {
          closeReviewModal()
          setLoading(false)
        })
    } else {
      setErrorStatus('Please enter remarks.')
    }
  }
  const updateNewLoanInfo = (data) => {
    setInfo({
      ...info,
      ...data
    })
  }

  const collapseComponent = [
    {
      id: 0,
      name: 'Loan Info',
      component: <LoanInfo type='renewal' updateNewLoanInfo={updateNewLoanInfo} status={status} currentUser={currentUser} data={{ ...data, ...selectedLoanData, product_id: selectedLoanData?.new_product_id || selectedLoanData?.product_id }} newInfo={selectedLoanData} />
    },
    {
      id: 1,
      name: 'Applicants',
      component: <DealersList id={id} currentUser={currentUser} />
    },
    {
      id: 2,
      name: 'PD Sheet',
      component: <WorkingSheetDrawer id={id} />
    }
  ]
  const handleClick = (id) => {
    if (id == collapse)
      setCollapse();
    else
      setCollapse(id);
  }

  return (
    <>
      <div className={classes.wrap}>
        <DealershipInfo data={{ ...dealershipData?.data, ...getRenewalFeeDetails?.data?.[0] }} currentUser={currentUser} />
        <Divider />
        <div>
          {
              collapseComponent?.map((item) => {
                return (
                  <Paper withBorder key={item?.id} p={10} style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}>
                    <div className={classes.collapseCard} onClick={() => handleClick(item.id)}>
                      <Typography variant='h6' style={{ cursor: 'pointer' }}>{item?.name}</Typography>
                      {collapse == item?.id ? <ArrowDropDownSharp /> : <ArrowRightOutlined />}
                    </div>
                    <Collapse in={collapse == item?.id}>
                      {item.component}
                    </Collapse>
                  </Paper>
                )
              })
          }
        </div>
      </div>
      <div>
        <RenewalDrawerFooter selectedLoanData={selectedLoanData} handleEnhancement={handleEnhancement} handleReviewModal={openReviewModal} handlePushBack={handlePushBack} handleReject={handleReject} data={data} onClose={onClose} id={id} currentUser={currentUser} status={status} filterType={'renewal'}/>
      </div>
      <Modal
        opened={reviewModal}
        onClose={closeReviewModal}
        title={getMessage(status, isReject, isPushback, isEnhancement)}
        zIndex={9999}
        size={'lg'}
      >
        <Box>
          <div className={classes.dialog}>
            <Text id="approval-remarks-desc">
              Please enter your remarks.
            </Text>
            <RichTextEditorBox onChange={setRemarks} />
            {
              errorStatus ?
                <Alert severity="error" style={{ padding: '0px 16px' }}>{errorStatus}</Alert> : null
            }
          </div>
          <Group justify='flex-end' mt={15}>
            <Button variant='outline' size='xs' onClick={closeReviewModal} mr={8}>Cancel</Button>
            <Button onClick={() => updateLoanStatus()} loading={loading} size='xs' color='green'>Confirm</Button>
            {/* <LoaderButton
              variant='contained'
              color='primary'
              buttonLabel='Confirm'
              size='medium'
              isLoading={loading}
              loadingText="Submitting..."
              onClick={() => updateLoanStatus()}
            >Confirm</LoaderButton> */}
          </Group>
        </Box>
      </Modal>
    </>
  );
}
export default RenewalDrawer;