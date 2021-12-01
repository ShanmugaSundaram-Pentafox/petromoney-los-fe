import { Dialog, DialogActions, DialogContent, DialogContentText, Button, CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import TextInput from '../../../components/TextInput/TextInput';
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


const PendingApprovalDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [info, setInfo] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const classes = useStyles();
  const [remarks, setRemarks] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const updateLoanStatus = () => {
    setLoading(true)
    let reqBody = {
      user_id: currentUser.id,
      product_id: info?.product_id,
      amount_approved: info?.amount_approved,
      remarks: remarks
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
  }
  const handlePendingApprovalModal = () => {
    if (!info.amount_approved) {
      enqueueSnackbar('Please enter amount to approve', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      })
      return null;
    }
    else {
      setOpenModal(!openModal)
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
          <LoanInfo status={status} currentUser={currentUser} viewable={true} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
          <>
            <DrawerRemarks label={'Remarks'} loanData={loanData?.review_remarks} readOnly={readOnly} />
            <DrawerRemarks label={'Reviewer remarks'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
          </>
        </div>
        <div>
          <DrawerFooter onClose={onClose} id={id} editable={editable} selectedLoanData={selectedLoanData} currentUser={currentUser} status={status} handlePendingApprovalModal={handlePendingApprovalModal} />
        </div>
      </div >
      <Dialog
        open={openModal}
        onClose={handlePendingApprovalModal}
      >
        <DialogContent>
          <div className={classes.dialog}>
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
            <Button onClick={handlePendingApprovalModal}>Cancel</Button>
            <Button color='primary' variant='outlined'
              onClick={() => { updateLoanStatus() }}
            >
              {loading ? <CircularProgress size={22} /> : 'Confirm'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default PendingApprovalDrawer;