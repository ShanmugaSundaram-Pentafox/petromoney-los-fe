import { Dialog, DialogActions, DialogContent, DialogContentText, Button, CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select';
import { useMount } from 'react-use';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
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


const PendingReviewDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose, readOnly }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const classes = useStyles();
  const [approvalModal, setApprovalModal] = useState(false)
  const [info, setInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const [errorStatus, setErrorStatus] = useState()
  const [userRole, setUserRole] = useState([]);
  const [remarks, setRemarks] = useState();
  const { enqueueSnackbar } = useSnackbar();


  useMount(() => {
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
  })

  const handleApprovalModal = () => {
    setApprovalModal(!approvalModal)
  }
  const updateLoanStatus = () => {
    if(user && remarks){
      setLoading(true)
      let reqBody = {
        user_id: currentUser.id,
        approver_id: user.value,
        product_id: info?.product_id,
        approval_remarks: remarks,
      }
      updateLoanApprovalStatusById(id, loanData?.id, 'approval', reqBody)
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
            setLoading(false)
          }, 1500)
        })
        .catch(err => {
          setLoading(false)
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
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
      <div className={classes.wrapper}>
        <div className={classes.wrapperTitle}>
          <Typography className={classes.title} variant="h4" component="h4">{data?.id}</Typography>
          <CloseIcon className={classes.closeIcon} onClick={onClose} />
        </div>
        <div className={classes.contentWrapper}>
          <DealershipData data={data} readOnly={true} />
          <SalesInfo id={id} currentUser={currentUser} readOnly={true} />
          <LoanInfo status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
          <>
            <DrawerRemarks label={'Reviewer Remarks'} loanData={loanData?.review_remarks} readOnly={readOnly} />
          </>
        </div>
        <div>
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
        </div>
      </div>
      <Dialog
        open={approvalModal}
        onClose={handleApprovalModal}
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
                onChange={(data) => {setUser(data); setErrorStatus();}}
                options={userRole}
                menuPlacement='bottom'
                menuPosition='fixed'
                maxMenuHeight='200px'
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
                setRemarks(e.target.value); setErrorStatus();
              }}
            />
            {
              errorStatus && 
                <Alert severity="error" style={{padding: '0px 16px'}}>{errorStatus}</Alert>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <div>
            <Button onClick={handleApprovalModal}>Cancel</Button>
            <Button color='primary' variant='outlined'
              onClick={updateLoanStatus}
            >
              {loading ? <CircularProgress size={22} /> : 'Confirm'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );

}
export default PendingReviewDrawer;