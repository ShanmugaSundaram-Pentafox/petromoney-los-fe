import { Divider, Collapse } from '@material-ui/core';
import { ArrowDropDownSharp, ArrowRightOutlined } from '@material-ui/icons';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getDealershipById } from '../../services/dealerships.service';
import { updateEnhancementLoanStatus } from '../../services/enhancement.service';
import { getLoanById } from '../../services/loans.service';
import LoanInfo from '../dashboard/RightDrawer/LoanInfo';
import DealershipInfo from '../dealershipDetails/components/DealershipInfo';
import DealersList from '../dealershipDetails/components/DealersList';
import WorkingSheetDrawer from '../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import RenewalDrawerFooter from '../renewal/renewalDrawer/RenewalDrawerFooter';
import { Alert, Box, Button, Group, Modal, Paper, Text, Title } from '@mantine/core';
import RichTextEditorBox from '../../components/RichTexEditor/RichTextEditorBox';
import classes from './Enhancement.module.css';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';

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
const getMessage = (status, isReject, isPushback) => {
  if (isReject) {
    return 'Are you sure you want to REJECT this renewal?'
  }
  if (isPushback) {
    return 'Move to Previous Stage?'
  }
  if (status === 'approval') {
    return 'Are you sure you want to APPROVE this renewal?'
  }
  return 'Move to Next Stage?'
}


const EnhancementDrawer = ({ id, selectedLoanData, status, currentUser, data, onClose }) => {
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [isReject, setIsReject] = useState(false);
  const [isPushback, setIsPushback] = useState(false);
  const [errorStatus, setErrorStatus] = useState()
  const [collapse, setCollapse] = useState(false);
  const [info, setInfo] = useState();
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.loan_id))
  const dealershipData = useQuery(['dealership-info', id], () => getDealershipById(id), { refetchOnWindowFocus: false })
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

  const updateLoanStatus = () => {
    if (remarks) {
      setLoading(true)
      let reqBody = {
        remarks: remarks,
        product_id: info?.product_id ? parseInt(info?.product_id) : parseInt(selectedLoanData?.new_product_id),
        loan_amount: info?.loan_amount ? parseInt(info?.loan_amount) : parseInt(selectedLoanData?.new_loan_amount),
        loan_id: loanData?.id || selectedLoanData?.loan_id,
        status,
        isReject,
        isPushback,
      }
      updateEnhancementLoanStatus(reqBody, selectedLoanData?.id)
        .then(res => {
          displayNotification({
            message: res,
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        })
        .catch(err => {
          displayNotification({
            message: err,
            variant: 'error'
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
      component: <LoanInfo type='enhancement' updateNewLoanInfo={updateNewLoanInfo} status={status} currentUser={currentUser} data={data} newInfo={selectedLoanData} />
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
    },

  ]
  const handleClick = (id) => {
    if (id == collapse)
      setCollapse();
    else
      setCollapse(id);
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.contentWrapper}>
          <DealershipInfo viewOnly={true} data={dealershipData?.data} currentUser={currentUser} />
          <Divider />
          <div>
            {
              collapseComponent?.map((item) => {
                return (
                  <Paper variant='outlined' key={item?.id} style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}>
                    <div className={classes.collapseCard} onClick={() => handleClick(item.id)}>
                      <Title order={6} style={{ cursor: 'pointer' }}>{item?.name}</Title>
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
          <RenewalDrawerFooter filterType={'enhancement'} selectedLoanData={selectedLoanData} handleReviewModal={openReviewModal} handlePushBack={handlePushBack} handleReject={handleReject} data={data} onClose={onClose} id={id} currentUser={currentUser} status={status} />
        </div>
      </div >
      <Modal
        opened={reviewModal}
        onClose={closeReviewModal}
        title={getMessage(status, isReject, isPushback)}
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
                <Alert title={'Error'} withCloseButton={false}>{errorStatus}</Alert> : null
            }
          </div>
          <Group justify='flex-end' mt={15}>
            <Button size='xs' variant='outline' onClick={closeReviewModal}>Cancel</Button>
            <Button size='xs' loading={loading} onClick={() => updateLoanStatus()} color='green'>Confirm</Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
export default EnhancementDrawer;