import { Dialog, DialogContent, DialogContentText, Button, DialogTitle } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import RenewalDrawerFooter from './RenewalDrawerFooter';
import LoaderButton from '../../../components/CommonComponents/Button/LoaderButton';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import { updateRenewalLoanStatus } from '../../../services/renewal.service';
import DealershipData from '../../dashboard/RightDrawer/DealershipData';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';

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
}))


const RenewalDrawer = ({ id, selectedLoanData, status, currentUser, data, onClose }) => {
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [isReject,setIsReject] = useState(false);
  const [isPushback,setIsPushback] = useState(false);
  const [errorStatus, setErrorStatus] = useState()
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

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
        loan_id: selectedLoanData?.loan_id,
        status,
        isReject,
        isPushback,
      }
      updateRenewalLoanStatus(reqBody)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload();
          }, 1000)
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
        .finally(() => {
          closeReviewModal()
          setLoading(false)
        })
    } else {
      setErrorStatus('Please enter remarks.')
    }
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
          <WorkingSheetDrawer id={id} />
        </div>
        <div>
          <RenewalDrawerFooter selectedLoanData={selectedLoanData} handleReviewModal={openReviewModal} handlePushBack={handlePushBack} handleReject={handleReject} data={data} onClose={onClose} id={id} currentUser={currentUser} status={status} />
        </div>
      </div >
      <Dialog
        open={reviewModal}
        onClose={closeReviewModal}
      >
        <DialogTitle>{getMessage(status, isReject, isPushback)}</DialogTitle>
        <DialogContent>
          <div className={classes.dialog}>
            <DialogContentText id="approval-remarks-desc">
              Please enter your remarks.
            </DialogContentText>
            <TextEditor setJSON={setRemarks} toolBar={true} remarkData={remarks} />
            {
              errorStatus ?
                <Alert severity="error" style={{ padding: '0px 16px' }}>{errorStatus}</Alert> : null
            }
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, marginBottom: 5 }}>
            <Button variant='outlined' onClick={closeReviewModal} style={{ marginRight: 8 }}>Cancel</Button>
            <LoaderButton
              variant='contained'
              color='primary'
              buttonLabel='Confirm'
              size='medium'
              isLoading={loading}
              loadingText="Submitting..."
              onClick={() => updateLoanStatus()}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default RenewalDrawer;