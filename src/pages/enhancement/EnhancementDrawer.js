import { Divider, Collapse } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ArrowDropDownSharp, ArrowRightOutlined } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getDealershipById } from '../../services/dealerships.service';
import { updateEnhancementLoanStatus } from '../../services/enhancement.service';
import { getLoanById } from '../../services/loans.service';
import LoanInfo from '../dashboard/RightDrawer/LoanInfo';
import DealershipInfo from '../dealershipDetails/components/DealershipInfo';
import DealersList from '../dealershipDetails/components/DealersList';
import WorkingSheetDrawer from '../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import RenewalDrawerFooter from '../renewal/renewalDrawer/RenewalDrawerFooter';
import { Box, Button, Group, Modal, Paper, Text } from '@mantine/core';
import RichTextEditorBox from '../../components/RichTexEditor/RichTextEditorBox';

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
    height: '90vh',
  },
  dialog: {
    minWidth: '30vw'
  },
  contentWrapper: {
    padding: 12,
    flex: 1,
    width: '100%',
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
  collapseCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  }
}))


const EnhancementDrawer = ({ id, selectedLoanData, status, currentUser, data, onClose }) => {
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [remarks, setRemarks] = useState();
  const [isReject, setIsReject] = useState(false);
  const [isPushback, setIsPushback] = useState(false);
  const [errorStatus, setErrorStatus] = useState()
  const [collapse, setCollapse] = useState(false);
  const [info, setInfo] = useState();
  const classes = useStyles();
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.loan_id))
  const dealershipData = useQuery(['dealership-info', id], () => getDealershipById(id), { refetchOnWindowFocus: false })
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
        product_id: info?.product_id ? parseInt(info?.product_id) : parseInt(selectedLoanData?.new_product_id),
        loan_amount: info?.loan_amount ? parseInt(info?.loan_amount) : parseInt(selectedLoanData?.new_loan_amount),
        loan_id: loanData?.id || selectedLoanData?.loan_id,
        status,
        isReject,
        isPushback,
      }
      updateEnhancementLoanStatus(reqBody, selectedLoanData?.id)
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
  const updateNewLoanInfo = (data) => {
    setInfo({
      ...info,
      ...data
    })
  }

  const collapseComponent = [
    {
      id: 0,
      name: 'Loan Info',
      component: <LoanInfo type='enhancement' updateNewLoanInfo={updateNewLoanInfo} status={status} currentUser={currentUser} data={data} newInfo={selectedLoanData} />
    },
    {
      id: 1,
      name: 'Applicants',
      component: <DealersList id={id} currentUser={currentUser} />
    },
    {
      id: 2,
      name: 'PD Sheet',
      component: <WorkingSheetDrawer id={id} />
    },

  ]
  const handleClick = (id) => {
    if (id == collapse)
      setCollapse();
    else
      setCollapse(id);
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.contentWrapper}>
          <DealershipInfo viewOnly={true} data={dealershipData?.data} currentUser={currentUser} />
          <Divider />
          <div>
            {
              collapseComponent?.map((item) => {
                return (
                  <Paper variant='outlined' key={item?.id} style={{ marginTop: 20, marginBottom: 20, cursor: 'pointer' }}>
                    <div className={classes.collapseCard} onClick={() => handleClick(item.id)}>
                      <Typography variant='h6' style={{ cursor: 'pointer' }}>{item?.name}</Typography>
                      {collapse == item?.id ? <ArrowDropDownSharp /> : <ArrowRightOutlined />}
                    </div>
                    <Collapse in={collapse == item?.id}>
                      {item.component}
                    </Collapse>
                  </Paper>
                )
              })
            }
          </div>
        </div>
        <div>
          <RenewalDrawerFooter filterType={'enhancement'} selectedLoanData={selectedLoanData} handleReviewModal={openReviewModal} handlePushBack={handlePushBack} handleReject={handleReject} data={data} onClose={onClose} id={id} currentUser={currentUser} status={status} />
        </div>
      </div >
      <Modal
        opened={reviewModal}
        onClose={closeReviewModal}
        title={getMessage(status, isReject, isPushback)}
        zIndex={9999}
        size={'lg'}
      >
        <Box>
          <div className={classes.dialog}>
            <Text id="approval-remarks-desc">
              Please enter your remarks.
            </Text>
            <RichTextEditorBox onChange={setRemarks} />
            {
              errorStatus ?
                <Alert severity="error" style={{ padding: '0px 16px' }}>{errorStatus}</Alert> : null
            }
          </div>
          <Group justify='flex-end' mt={15}>
            <Button size='xs' variant='outline' onClick={closeReviewModal}>Cancel</Button>
            <Button size='xs' loading={loading} onClick={() => updateLoanStatus()} color='green'>Confirm</Button>
            {/* <LoaderButton
              variant='contained'
              color='primary'
              buttonLabel='Confirm'
              size='medium'
              isLoading={loading}
              loadingText="Submitting..."
              onClick={() => updateLoanStatus()}
            >Confirm</LoaderButton> */}
          </Group>
        </Box>
      </Modal>
    </>
  );
}
export default EnhancementDrawer;