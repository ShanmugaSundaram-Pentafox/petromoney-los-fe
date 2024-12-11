import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import LoanInfo from './LoanInfo';
import { action_id, resources_id } from '../../../config/accessControl';
import { getUserRoleForReview } from '../../../services/common.service';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import { isAllowed } from '../../../utils/cerbos';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import classes from './SideDrawer.module.css';
import { Alert, Box, Button, Group, Loader, Modal, Select, Text } from '@mantine/core';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';
import { IconInfoCircle } from '@tabler/icons-react';
import { useDebouncedState } from '@mantine/hooks';

const SubmittedDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [reviewModal, setReviewModal] = useState(false);
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [info, setInfo] = useState({})
  const [errorStatus, setErrorStatus] = useState()
  const [searchValue, setSearchValue] = useDebouncedState(null);

  const { data: userRole, isLoading: userRoleLoading  } = useQuery(
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

  const handleReviewModal = () => {
    if (info?.amount_requested > 0) {
      setSearchValue(null)
      setErrorStatus(null)
      setReviewModal(!reviewModal)
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
    if ((user && remarks) || status == 'pre_submit') {
      setLoading(true)
      let reqBody = {
        user_id: currentUser?.id,
        reviewer_id: parseInt(user?.value),
        review_remarks: remarks,
        product_id: info?.product_id,
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
      setErrorStatus('Please select reviewer and enter remarks.')
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
      {/* Drawer content */}
      <div className={classes.wrap}>

        <DealershipData
          data={data}
          readOnly={true}
        />

        <WorkingSheetDrawer id={id} />

        <LoanInfo
          status={status}
          viewable={false}
          currentUser={currentUser}
          newInfo={loanData}
          editable={editable}
          data={selectedLoanData}
          updateNewLoanInfo={updateNewLoanInfo}
        />
      </div>

      {/* Sticky footer */}
      <DrawerFooter
        selectedLoanData={selectedLoanData}
        handleReviewModal={status == 'pre_submit' ? updateLoanStatus : handleReviewModal}
        data={data}
        onClose={onClose}
        id={id}
        currentUser={currentUser}
        status={status}
        disabled={loading}
      />

      <Modal
        opened={reviewModal}
        onClose={handleReviewModal}
        zIndex={9999}
        size={'lg'}
        title="Send for Review"
      >
        <Box className={classes.dialog}>
          <Text>
            Please choose whom did you want to sent for review.
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
            styles={{ dropdown: { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', zIndex: 99999 } }}
            menuPlacement='bottom'
            menuPosition='fixed'
            maxMenuHeight='200px'
            mb='xs'
          />
          <Text>
            Please enter your remarks for sending this to review.
          </Text>
          <RichTextEditorBox onChange={setRemarks} />
          {
            errorStatus
              ? <Alert mt='xs' variant='light' color='orange' title='Error!' withCloseButton={false} icon={<IconInfoCircle />}>
                {errorStatus}
              </Alert>
              : null
          }
        </Box>
        <Group justify='flex-end' mt={'md'}>
          <Button variant='outline' size='xs' onClick={handleReviewModal}>Cancel</Button>
          <Button
            color='green'
            size='xs'
            loading={loading}
            onClick={() => updateLoanStatus('loan_review')}
          >Confirm</Button>
        </Group>
      </Modal>
    </>
  );
}
export default SubmittedDrawer;