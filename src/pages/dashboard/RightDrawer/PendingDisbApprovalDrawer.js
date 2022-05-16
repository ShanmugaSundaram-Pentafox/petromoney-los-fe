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
  dialog: {
    minWidth: '25vw'
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


const PendingDisbApprovedDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [info, setInfo] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [errorStatus, setErrorStatus] = useState()
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

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
    if(remarks){
      setLoading(true)
      let reqBody = {
        user_id: currentUser.id,
        amount_disbursed: info?.amount_disbursed ? info?.amount_disbursed : info?.amount_approved,
        disbursement_approval_remarks: remarks
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
          <LoanInfo viewable={true} status={status} currentUser={currentUser} newInfo={loanData} editable={editable} data={selectedLoanData} updateNewLoanInfo={updateNewLoanInfo} />
          <>
            <DrawerRemarks label={'Remarks'} loanData={loanData?.review_remarks} readOnly={readOnly} />
            <DrawerRemarks label={'Reviewer remarks'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
            <DrawerRemarks label={'Approver remarks'} loanData={loanData?.remarks} readOnly={readOnly} />
            <DrawerRemarks label={'Recommendation remarks'} loanData={loanData?.disbursement_recommendation_remarks} readOnly={readOnly} />
          </>
        </div>
        <div>
          <DrawerFooter selectedLoanData={selectedLoanData} onClose={onClose} id={id} editable={editable} currentUser={currentUser} status={status} updateApprovalStatus={handleModal} />
        </div>
      </div >
      <Dialog
        open={openModal}
        onClose={handleModal}
      >
        <DialogContent>
          <div className={classes.dialog}>
            <DialogContentText id="approval-remarks-desc">
              Please enter remarks for approval.
            </DialogContentText>
            <TextEditor setJSON={setRemarks} toolBar={true}/>
            {/* <TextInput
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
            /> */}
            {
              errorStatus && 
                <Alert severity="error" style={{padding: '0px 16px'}}>{errorStatus}</Alert>
            }
          </div>
          <div style={{display: 'flex', justifyContent: 'center', margin: '8px 0px 5px 0px'}}>
            <Button variant='outlined' style={{marginRight:8}} onClick={handleModal}>Cancel</Button>
            <LoaderButton 
              variant='contained'
              color='primary'
              isLoading={loading}
              loadingText='Submitting...'
              onClick={updateLoanStatus}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default PendingDisbApprovedDrawer;