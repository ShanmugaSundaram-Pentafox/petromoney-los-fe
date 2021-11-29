import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select';
import { useMount } from 'react-use';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import LoanInfo from './LoanInfo';
import TextInput from '../../../components/TextInput/TextInput';
import { getUserRoleForReview } from '../../../services/common.service';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import SalesInfo from '../components/SalesInfo';



const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '0 24px 10px 24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  dialog: {
    minWidth: '40vw'
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
  actionButtonsWrapper: {
    paddingTop: 16,
  },
  btn: {
    marginLeft: 16
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
}))


const SubmittedDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose }) => {
  // const userRole = useQuery('user-role', () => { getUserRoleForReview('is_review=1') })
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [reviewModal, setReviewModal] = useState(false);
  const [user, setUser] = useState([])
  const [userRole, setUserRole] = useState([]);
  const [remarks, setRemarks] = useState();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useMount(() => {
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
  })
  const handleReviewModal = () => {
    setReviewModal(!reviewModal)
  }

  const updateLoanStatus = () => {
    let reqBody = {
      user_id: currentUser.id,
      reviewer_id: user.value,
      review_remarks: remarks,
    }
    updateLoanApprovalStatusById(id, loanData.id, 'approval', reqBody)
      .then(res => {
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload();
        }, 1500)
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

  }
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.wrapperTitle}>
          <Typography className={classes.title} variant="h4" component="h4">{data?.id}</Typography>
          <CloseIcon className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.contentWrapper}>
          <DealershipData data={data} readOnly={true} />
          <SalesInfo id={id} currentUser={currentUser} readOnly={true} />
          <LoanInfo status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} />
        </div>
        <div>
          <DrawerFooter selectedLoanData={selectedLoanData} handleReviewModal={handleReviewModal} data={data} onClose={onClose} id={id} currentUser={currentUser} status={status} />
        </div>
      </div >
      <Dialog
        open={reviewModal}
        onClose={handleReviewModal}
      >
        <DialogContent>
          <div className={classes.dialog}>
            <div style={{ marginBottom: 20 }}>
              <DialogContentText id="approval-remarks-desc">
                Please choose whom did you want to sent for approval.
              </DialogContentText>
              <Select
                isClearable
                name='user_approve'
                onChange={setUser}
                options={userRole}
              />
            </div>
            <DialogContentText id="approval-remarks-desc">
              Please enter your remarks for sending this for approval.
            </DialogContentText>
            <TextInput
              multiline
              alignTop
              direction='column'
              rows={4}
              rowsMax={8}
              labelText="Remarks*"
              placeholder="Enter your remarks here."
              value={remarks}
              onChange={e => {
                setRemarks(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div>
            <Button onClick={handleReviewModal}>Cancel</Button>
            <Button color='primary' variant='outlined'
              onClick={() => { updateLoanStatus('loan_review') }}
            >
              Confirm
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default SubmittedDrawer;