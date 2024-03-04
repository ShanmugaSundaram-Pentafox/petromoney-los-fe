import { Dialog, DialogContent, DialogContentText, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select';
import { useMount } from 'react-use';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import LoanInfo from './LoanInfo';
import LoaderButton from '../../../components/CommonComponents/Button/LoaderButton';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import { action_id, resources_id } from '../../../config/accessControl';
import { getUserRoleForReview } from '../../../services/common.service';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import { isAllowed } from '../../../utils/cerbos';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import classes from './SideDrawer.module.css';

const SubmittedDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [reviewModal, setReviewModal] = useState(false);
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState([]);
  const [remarks, setRemarks] = useState();
  const [info, setInfo] = useState({})
  const [errorStatus, setErrorStatus] = useState()

  useMount(() => {
    if (isAllowed(currentUser?.permissions, resources_id.dashboard, action_id.dashboard.send_for_review)) {
      getUserRoleForReview('is_review=1')
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
  const handleReviewModal = () => {
    if (info?.amount_requested > 0) {
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
        reviewer_id: user?.value,
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
      <div style={{ flexGrow: 1, padding: 16, overflowY: 'auto' }}>

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
      />

      <Dialog
        open={reviewModal}
        onClose={handleReviewModal}
      >
        <DialogContent>
          <div className={classes.dialog}>
            <div style={{ marginBottom: 20 }}>
              <DialogContentText id="approval-remarks-desc">
                Please choose whom did you want to sent for review.
              </DialogContentText>
              <Select
                isClearable
                name='user_approve'
                onChange={(data) => { setUser(data); setErrorStatus(); }}
                options={userRole}
                menuPlacement='bottom'
                menuPosition='fixed'
                maxMenuHeight='200px'
              />
            </div>
            <DialogContentText id="approval-remarks-desc">
              Please enter your remarks for sending this to review.
            </DialogContentText>
            <TextEditor setJSON={setRemarks} toolBar={true} />
            {
              errorStatus &&
              <Alert severity="error" style={{ padding: '0px 16px' }}>{errorStatus}</Alert>
            }
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 5 }}>
            <Button variant='outlined' onClick={handleReviewModal} style={{ marginRight: 8 }}>Cancel</Button>
            <LoaderButton
              variant='contained'
              color='primary'
              buttonLabel='Confirm'
              size='medium'
              isLoading={loading}
              loadingText="Submitting..."
              onClick={() => updateLoanStatus('loan_review')}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default SubmittedDrawer;