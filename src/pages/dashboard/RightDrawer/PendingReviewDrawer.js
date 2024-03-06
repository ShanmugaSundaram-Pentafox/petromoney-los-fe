import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select';
import { useMount } from 'react-use';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import { action_id, resources_id } from '../../../config/accessControl';
import { getUserRoleForReview } from '../../../services/common.service';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import { isAllowed } from '../../../utils/cerbos';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import classes from './SideDrawer.module.css';
import { Alert, Box, Button, Modal, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const PendingReviewDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose, readOnly }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [approvalModal, setApprovalModal] = useState(false)
  const [info, setInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const [errorStatus, setErrorStatus] = useState()
  const [userRole, setUserRole] = useState([]);
  const [remarks, setRemarks] = useState();


  useMount(() => {
    if (isAllowed(currentUser?.permissions, resources_id.dashboard, action_id.dashboard.send_for_approval)) {
      getUserRoleForReview('is_approve=1')
        .then(res => {
          let d = [];
          res.forEach((item) => {
            d.push({
              label: `${item.first_name} ${item.last_name}`,
              value: item.id
            })
          })
          setUserRole(d);
        })
        .catch(() => null)
    }
  })

  const handleApprovalModal = () => {
    if (info?.amount_requested > 0) {
      setApprovalModal(!approvalModal)
    }
    else {
      displayNotification({
        message: 'Please enter amount to proceed further',
        variant: 'success',
        autoClose: false
      });
      return null;
    }
  }
  const updateLoanStatus = () => {
    if (user && remarks) {
      setLoading(true)
      let reqBody = {
        user_id: currentUser.id,
        approver_id: user.value,
        product_id: info?.product_id,
        approval_remarks: remarks,
        amount_requested: info?.amount_requested
      }
      updateLoanApprovalStatusById(id, loanData?.id, 'approval', reqBody)
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
      setErrorStatus('Please select approver and enter remarks.')
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
      <Box className={classes.wrapper}>
        <Box className={classes.contentWrapper}>
          <DealershipData data={data} readOnly={true} />
          <WorkingSheetDrawer id={id} />
          <LoanInfo status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
          <>
            <DrawerRemarks label={'Reviewer Remarks'} loanData={loanData?.review_remarks} readOnly={readOnly} />
            {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}
          </>
        </Box>
        <Box>
          <DrawerFooter
            selectedLoanData={selectedLoanData}
            handleApprovalModal={handleApprovalModal}
            loanData={loanData}
            onClose={onClose}
            id={id}
            editable={editable}
            status={status}
            currentUser={currentUser}
          />
        </Box>
      </Box>
      <Modal
        opened={approvalModal}
        onClose={handleApprovalModal}
        zIndex={9999}
        size={'lg'}
      >
        <Box className={classes.dialog}>
          <Box style={{ marginBottom: 20 }}>
            <Text>
              Please choose whom did you want to sent for approval.
            </Text>
            <Select
              clearable
              name='user_approve'
              onChange={(data) => { setUser(data); setErrorStatus(); }}
              options={userRole}
              menuPlacement='bottom'
              menuPosition='fixed'
              maxMenuHeight='200px'
            />
          </Box>
          <Text>
            Please enter your remarks for sending this for approval.
          </Text>
          <TextEditor setJSON={setRemarks} toolBar={true} />
          {
            errorStatus
              ? <Alert variant='light' color='orange' title='Error!' icon={<IconInfoCircle />}>
                {errorStatus}
              </Alert>
              : null
          }
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 5 }}>
          <Button variant='outline' size='xs' style={{ marginRight: 8 }} onClick={handleApprovalModal}>Cancel</Button>
          <Button
            color='green'
            size='xs'
            loading={loading}
            onClick={updateLoanStatus}
          >Confirm</Button>
        </Box>
      </Modal>
    </>
  );

}
export default PendingReviewDrawer;