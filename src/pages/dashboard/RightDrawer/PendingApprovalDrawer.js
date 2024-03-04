import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import classes from './SideDrawer.module.css';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { Alert, Button, Modal, Text } from '@mantine/core';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';
import { IconInfoCircle } from '@tabler/icons-react';

const PendingApprovalDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [info, setInfo] = useState({ amount_approved: selectedLoanData?.amount_requested })
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [errorStatus, setErrorStatus] = useState()

  const updateLoanStatus = () => {
    if (remarks) {
      setLoading(true)
      let reqBody = {
        user_id: currentUser.id,
        product_id: info?.product_id,
        amount_approved: info?.amount_approved,
        remarks: remarks
      }

      updateLoanApprovalStatusById(id, loanData.id, 'approval', reqBody)
        .then(res => {
          displayNotification({
            message: res?.message,
            variant: 'success',
          });
          setTimeout(() => {
            window.location.reload();
            setLoading(false)
          }, 1500)
        })
        .catch(err => {
          setLoading(false)
          displayNotification({
            message: err,
            variant: 'error',
          })
        })
    } else {
      setErrorStatus('Please enter remarks for approval')
    }
  }
  const handlePendingApprovalModal = () => {
    if (info.amount_approved > 0) {
      setOpenModal(!openModal)
    }
    else {
      displayNotification({
        message: 'Please enter amount to approve',
        variant: 'warning',
      });
      return null;
    }
  }
  const updateNewLoanInfo = (d) => {
    setInfo({
      ...info,
      ...d
    })
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.contentWrapper}>
          <DealershipData data={data} readOnly={true} />
          <WorkingSheetDrawer id={id} />
          <LoanInfo status={status} currentUser={currentUser} viewable={true} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
          <>
            <DrawerRemarks label={'Recommendation'} loanData={loanData?.review_remarks} readOnly={readOnly} />
            <DrawerRemarks label={'Reviewer recommendation'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
            {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}
          </>
        </div>
        <div>
          <DrawerFooter onClose={onClose} id={id} editable={editable} selectedLoanData={selectedLoanData} currentUser={currentUser} status={status} handlePendingApprovalModal={handlePendingApprovalModal} />
        </div>
      </div >
      <Modal
        opened={openModal}
        onClose={handlePendingApprovalModal}
      >
        <Text fz={'sm'}>
          Please enter your remarks for approval.
        </Text>
        <RichTextEditorBox onChange={setRemarks} />
        {
          errorStatus
            ? <Alert variant='light' color='orange' title='Error!' icon={<IconInfoCircle />}>{errorStatus}</Alert>
            : null
        }
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0px 5px 0px' }}>
          <Button variant='outline' style={{ marginRight: 8 }} onClick={handlePendingApprovalModal}>Cancel</Button>
          <Button
            loading={loading}
            onClick={updateLoanStatus}
          >Confirm</Button>
        </div>
      </Modal>
    </>
  );
}
export default PendingApprovalDrawer;