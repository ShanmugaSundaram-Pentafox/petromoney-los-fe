import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import { action_id, resources_id } from '../../../config/accessControl';
import { getUserRoleForReview } from '../../../services/common.service';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import { isAllowed } from '../../../utils/cerbos';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import classes from './SideDrawer.module.css';
import { Alert, Box, Button, Group, Loader, Modal, Select, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';
import { useDebouncedState } from '@mantine/hooks';

const PendingReviewDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose, readOnly }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [approvalModal, setApprovalModal] = useState(false)
  const [info, setInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const [errorStatus, setErrorStatus] = useState()
  // const [userRole, setUserRole] = useState([]);
  const [remarks, setRemarks] = useState();
  const [searchValue, setSearchValue] = useDebouncedState('');

  const { data: userRole, isLoading: userRoleLoading } = useQuery(
    ['userRoles', searchValue],
    () => getUserRoleForReview({ status: 'is_approve=1', search: searchValue }),
    {
      select: (data) =>
        data.map((item) => ({
          label: `${item.first_name} ${item.last_name || ''}`.trim(),
          value: item.id?.toString(),
        })),
      enabled: isAllowed(currentUser?.permissions, resources_id.dashboard, action_id.dashboard.send_for_approval),
    }
  );

  // useMount(() => {
  //   if (isAllowed(currentUser?.permissions, resources_id.dashboard, action_id.dashboard.send_for_approval)) {
  //     getUserRoleForReview({status : 'is_approve=1', search: searchValue})
  //       .then(res => {
  //         let d = [];
  //         res.forEach((item) => {
  //           d.push({
  //             label: `${item.first_name} ${item.last_name}`,
  //             value: item.id?.toString()
  //           })
  //         })
  //         setUserRole(d);
  //       })
  //       .catch(() => null)
  //   }
  // })

  const handleApprovalModal = () => {
    if (info?.amount_requested > 0) {
      setSearchValue(null)
      setErrorStatus(null)
      setApprovalModal(!approvalModal)
    }
    else {
      displayNotification({
        message: 'Please enter amount to proceed further',
        variant: 'warning',
      });
      return null;
    }
  }
  const updateLoanStatus = () => {
    if (user && remarks) {
      setLoading(true)
      let reqBody = {
        user_id: currentUser.id,
        approver_id: parseInt(user.value),
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
          onClose()
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
      <div className={classes.wrap}>
        <DealershipData data={data} readOnly={true} />
        <WorkingSheetDrawer id={id} />
        <LoanInfo status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
        <>
          <DrawerRemarks label={'Reviewer Remarks'} loanData={loanData?.review_remarks} readOnly={readOnly} />
          {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}
        </>
      </div>
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
      <Modal
        opened={approvalModal}
        onClose={handleApprovalModal}
        zIndex={9999}
        size={'lg'}
        title={'Send for Approval'}
      >
        <Box className={classes.dialog}>
          <Text>
            Please choose whom did you want to sent for approval.
          </Text>
          <Select
            searchable
            nothingFoundMessage = {userRoleLoading ? <Loader size="xs"/> : 'No data found'}
            onSearchChange={setSearchValue}
            onBlur={setSearchValue(null)}
            placeholder='search or select reviewer'
            clearable
            name='user_approve'
            onChange={(_value, option) => { setUser(option); setErrorStatus(); }}
            data={userRole || []}
            styles={{ dropdown: { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', zIndex: 9999 } }}
            menuPlacement='bottom'
            menuPosition='fixed'
            maxMenuHeight='200px'
            mb='xs'
          />
          <Text>
            Please enter your remarks for sending this for approval.
          </Text>
          <RichTextEditorBox onChange={setRemarks} />
          {
            errorStatus
              ? <Alert mt='xs' variant='light' color='orange' title='Error!' icon={<IconInfoCircle />}>
                {errorStatus}
              </Alert>
              : null
          }
        </Box>
        <Group justify='flex-end' mt={'md'}>
          <Button variant='outline' size='xs' onClick={handleApprovalModal}>Cancel</Button>
          <Button
            color='green'
            size='xs'
            loading={loading}
            onClick={updateLoanStatus}
          >Confirm</Button>
        </Group>
      </Modal>
    </>
  );

}
export default PendingReviewDrawer;