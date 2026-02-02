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
import { Alert, Button, Group, Modal, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';

const PendingDisbApprovedDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [info, setInfo] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [errorStatus, setErrorStatus] = useState()

  const updateNewLoanInfo = (d) => {
    setInfo({
      ...info,
      ...d
    })
  }
  const handleModal = () => {
    setOpenModal(!openModal)
  }
  const updateLoanStatus = () => {
    if (remarks) {
      setLoading(true)
      let reqBody = {
        user_id: currentUser.id,
        amount_disbursed: info?.amount_disbursed ? info?.amount_disbursed : info?.amount_approved,
        disbursement_approval_remarks: remarks
      }
      updateLoanApprovalStatusById(id, loanData.id, 'approval', reqBody)
        .then(res => {
          displayNotification({
            message: res.message,
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
          });
        })
    } else {
      setErrorStatus('Please enter remarks for approval')
    }

  }
  return (
    <>
      <div className={classes.wrap}>
        <DealershipData data={data} readOnly={true} />
        <WorkingSheetDrawer id={id} />
        <LoanInfo viewable={true} status={status} currentUser={currentUser} newInfo={loanData} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
        <>
          {/* <DrawerRemarks label={'Remarks'} loanData={loanData?.review_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Reviewer remarks'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Approver remarks'} loanData={loanData?.remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Recommendation remarks'} loanData={loanData?.disbursement_recommendation_remarks} readOnly={readOnly} /> */}
          {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}
        </>
      </div>
      <DrawerFooter selectedLoanData={selectedLoanData} onClose={onClose} id={id} editable={editable} currentUser={currentUser} status={status} updateApprovalStatus={handleModal} />
      <Modal
        opened={openModal}
        onClose={handleModal}
        zIndex={9999}
        size={'lg'}
      >
        <Text fz={'sm'}>
          Please enter remarks for approval.
        </Text>
        <RichTextEditorBox onChange={setRemarks} />
        {
          errorStatus
            ? <Alert variant='light' color='orange' title='Error!' icon={<IconInfoCircle />}>{errorStatus}</Alert>
            : null
        }
        <Group justify='center' gap={10} mt={20}>
          <Button size='xs' variant='outline' onClick={handleModal}>Cancel</Button>
          <Button
            size='xs'
            color='green'
            loading={loading}
            onClick={updateLoanStatus}
          >
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  );
}
export default PendingDisbApprovedDrawer;