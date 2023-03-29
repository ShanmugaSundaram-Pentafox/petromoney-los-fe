import { Dialog, DialogContent, DialogContentText, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import LoaderButton from '../../../components/CommonComponents/Button/LoaderButton';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '0 24px 10px 24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  dialog: {
    minWidth: '25vw'
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
  const [info, setInfo] = useState({ amount_approved: selectedLoanData?.amount_requested })
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const classes = useStyles();
  const [remarks, setRemarks] = useState();
  const [errorStatus, setErrorStatus] = useState()
  const { enqueueSnackbar } = useSnackbar();

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
      setErrorStatus('Please enter remarks for approval')
    }
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
      <Dialog
        open={openModal}
        onClose={handlePendingApprovalModal}
      >
        <DialogContent>
          <div className={classes.dialog}>
            <DialogContentText id="approval-remarks-desc">
              Please enter your remarks for approval.
            </DialogContentText>
            <TextEditor setJSON={setRemarks} toolBar={true} />
            {
              errorStatus &&
                <Alert severity="error" style={{ padding: '0px 16px' }}>{errorStatus}</Alert>
            }
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0px 5px 0px' }}>
            <Button variant='outlined' style={{ marginRight: 8 }} onClick={handlePendingApprovalModal}>Cancel</Button>
            <LoaderButton
              variant='contained'
              color='primary'
              loadingText='Submitting...'
              isLoading={loading}
              onClick={updateLoanStatus}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default PendingApprovalDrawer;