import { Dialog, DialogActions, DialogContent, FormGroup, Checkbox, Tooltip, FormControlLabel, Button, Typography, Chip, IconButton, CircularProgress, DialogContentText } from '@material-ui/core';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import LoaderButton from '../../../components/CommonComponents/Button/LoaderButton';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getLoanById, getLoanRejectReason, updateLoanApprovalStatusById, updateLoanStats } from '../../../services/loans.service';

const useStyles = makeStyles(theme => ({
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  btn: {
    marginLeft: 16
  },
  rejectModal: {
    width: 600,
    minHeight: '35vh',
    maxHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
  },
  chip: {
    borderRadius: 2,
    marginRight: 10
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
  btnError: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.white
    },
    '&.MuiButton-outlined': {
      color:theme.palette.error.main,
      borderColor:theme.palette.error.main
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },

  items: {
    borderBottom: '1px solid #c9c7c7',
    paddingTop: 5,
    paddingBottom: 5,
    '&:hover': {
      backgroundColor: '#ffffff',
      borderRadius: 2
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eachItem: {
    textOverflow: 'ellipsis',
    paddingLeft: 5
  },
}))

const DrawerFooter = ({
  id,
  editable,
  currentUser,
  onClose,
  status,
  selectedLoanData,
  handleReviewModal,
  handleApprovalModal,
  handlePendingApprovalModal,
  updateApprovalStatus
}) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const classes = useStyles();
  const [reLoader, setReloader] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [pushback, setPushback] = useState(false);
  const [pushbackRemarks, setPushbackRemarks] = useState();
  const [optionsData, setOptionsData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState();
  const [activeTab, setActiveTab] = useState();
  const [reasonData, setReasonData] = useState()
  const [rejectReason, setRejectReason] = useState([])
  const [displayReason, setDisplayReason] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState();
  const { enqueueSnackbar } = useSnackbar();
  var pushback_condition = [ 'loan_approval', 'disbursement_approval', 'disbursement_approved' ];
  /* The pushback_condition array is to check the condition for the pushback button, 
  The push back button want to show for all the user expect the Approved field, 
  Only the admin has the permission for the Approved field. */
  if(currentUser.role_id == '1'){
    /* The role_id = 1 is for Admin */
    pushback_condition.push('approved')
  }
  useMount(() => {
    getLoanRejectReason()
      .then(data => {
        const optionsBuffer = []
        const dataBuffer = []
        data.map((data, index) => {
          optionsBuffer.push({ value: index, label: data.reason })
          dataBuffer.push([data.list.map((d) => { return ({ value: d.id, label: `${d.code} - ${d.description}` }) })])
        })
        setOptionsData(optionsBuffer)
        setReasonData(dataBuffer)
      })
      .catch(() => null)
  })

  const sortByKey = (a, b, key) => {
    if (a[key]?.trim() < b[key]?.trim()) {
      return -1;
    }
    if (a[key]?.trim() > b[key]?.trim()) {
      return 1;
    }
    return 0;
  }

  const handleResubmit = () => {
    setReloader(true);
    updateLoanStats(id, loanData.id)
      .then(res => {
        setReloader(false);
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          setReloader(false);
          window.location.reload();
        }, 2000)
      })
      .catch(() => {
        setReloader(false);
      })
  }
  const handlePushBack = () => {
    let reqBody = {
      user_id: currentUser.id,
      pushback_remarks: pushbackRemarks,
    }
    if(pushbackRemarks?.length){
      setLoading(true)
      updateLoanApprovalStatusById(id, loanData.id, 'pushback', reqBody)
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
      setErrorMsg('Please enter the Remarks')
    }
  }
  const removeItem = (item) => {
    setRejectReason(rejectReason.filter(value => value !== item.value))
    setDisplayReason(displayReason.filter(label => label.label !== item.label))
  }
  const handleReasonChange = (event) => {
    if(errorMsg) setErrorMsg()
    let reasonArray = [...displayReason, { label: event.target.name, value: event.target.value }];
    let arrayCheck = [...rejectReason, event.target.value];
    if (rejectReason.includes(event.target.value)) {
      arrayCheck = arrayCheck.filter(value => value !== event.target.value)
      reasonArray = reasonArray.filter(name => name.label !== event.target.name)
    }
    setDisplayReason(reasonArray)
    setRejectReason(arrayCheck)
  }

  const updateLoanStatus = () => {
    let reqBody = {
      user_id: currentUser.id,
      reason_id: rejectReason,
    }
    if(rejectReason?.length){
      setLoading(true)
      updateLoanApprovalStatusById(id, loanData.id, 'reject', reqBody)
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
      setErrorMsg('Please Select a reason to reject this loan')
    }

  }
  return (
    <div>
      <div className={classes.actionButtonsWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIosRoundedIcon />}
            onClick={onClose}>
            Back
          </Button>
          {
            editable && status && ['loan_review', 'loan_approval', 'approved', 'rejected', 'disbursed'].includes(status.toLowerCase()) && (
              <UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  <LoaderButton
                    variant={'contained'}
                    className={clsx(classes.btn, classes.btnError)}
                    isLoading={reLoader}
                    onClick={handleResubmit}
                    loadingText='submitting...'>{'Re-Submit'}</LoaderButton>
                  /* Checking if the user in the loan_review state then the Re-submit button will be displayed as Push Back, Because............ */
                )}
              />)
          }
          {/* {
            editable && status && pushback_condition.includes(status.toLowerCase()) && (
              <UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  <LoaderButton
                    variant="outlined"
                    className={clsx(classes.btn, classes.btnError)}
                    isLoading={reLoader}
                    onClick={() => setPushback(true)}
                    loadingText='pushing back...'>Push Back</LoaderButton>
                )}
              />)
          } */}
          {/* Push back API is not merged */}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            component={RouterLink}
            to={`/dealership/${id}`}
            variant="contained"
            disabled={loanData?.isLoading}
            className={clsx(classes.btn, classes.btnSuccess)}
            startIcon={<AccountTreeRoundedIcon />}
          >
            View more
          </Button>
          {
            status && ['submitted'].includes(status.toLowerCase()) &&![8, 9].includes(currentUser?.role_id) &&
              <UserCan
                role={currentUser.role_name}
                perform={rulesList?.loan_approval}
                yes={() => (
                  < div >
                    <Button
                      variant="contained"
                      disabled={loanData?.isLoading}
                      className={clsx(classes.btn, classes.btnSuccess)}
                      startIcon={<ThumbUpAltIcon />}
                      onClick={handleReviewModal}
                    >
                      Send for Review
                    </Button>
                  </div>
                )} />
          }
          {
            status && ['pre_submit'].includes(status.toLowerCase()) &&
              <UserCan
                role={currentUser.role_name}
                perform={rulesList?.loan_approval}
                yes={() => (
                  < div >
                    <Button
                      variant="contained"
                      disabled={loanData?.isLoading}
                      className={clsx(classes.btn, classes.btnSuccess)}
                      startIcon={<ThumbUpAltIcon />}
                      onClick={handleReviewModal}
                    >
                      Submit
                    </Button>
                  </div>
                )} />
          }
          {
            editable && status && ['loan_approval', 'loan_review', 'disbursement_approval'].includes(status.toLowerCase()) &&
              <UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  <>
                    {
                      editable && status && ['loan_review', 'loan_approval', 'disbursement_approval'].includes(status.toLowerCase()) &&
                        <>
                          {
                            (currentUser.id == loanData?.approver_id || currentUser.id == loanData?.reviewer_id || [1, 2, 3, 4].includes(currentUser.role_id)) &&
                              <Button
                                variant="contained"
                                disabled={loanData?.loading}
                                className={clsx(classes.btn, classes.btnError)}
                                startIcon={<ThumbDownAltIcon />}
                                onClick={() => setRejectModal(true)}
                              >
                                Reject
                              </Button>
                          }
                        </>
                    }
                    {
                      status !== 'loan_review' && status !== 'loan_approval' &&
                        <Button
                          variant="contained"
                          disabled={loanData?.loading}
                          className={clsx(classes.btn, classes.btnSuccess)}
                          startIcon={<ThumbUpAltIcon />}
                          onClick={updateApprovalStatus}
                        >
                          Approve
                        </Button>
                    }
                    {
                      status && status.toLowerCase() === 'loan_approval' && (currentUser.id == loanData?.approver_id || [1, 2, 3, 4].includes(currentUser.role_id)) &&
                        <Button
                          variant="contained"
                          disabled={loanData?.loading}
                          className={clsx(classes.btn, classes.btnSuccess)}
                          startIcon={<ThumbUpAltIcon />}
                          onClick={handlePendingApprovalModal}
                        >
                          Approve
                        </Button>
                    }
                  </>
                )}
              />
          }
          {
            editable && status && ['loan_review'].includes(status.toLowerCase()) && (currentUser.id == loanData?.reviewer_id || [1, 2, 3, 4].includes(currentUser.role_id)) &&
              < UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  <div>
                    <Button
                      variant="contained"
                      disabled={loanData?.isLoading}
                      className={clsx(classes.btn, classes.btnSuccess)}
                      startIcon={<ThumbUpAltIcon />}
                      onClick={handleApprovalModal}
                    >
                      Send for Approval
                    </Button>
                  </div>
                )}
              />
          }
        </div>
      </div>
      <Dialog
        open={rejectModal}
        onClose={() => setRejectModal(false)}
      >
        <DialogContent className={classes.rejectModal}>
          {
            <>
              <div>
                {
                  errorMsg &&
                    <Alert severity='error' style={{marginBottom: 12}}>{errorMsg}</Alert>
                }
                <Typography style={{ marginBottom: 16 }} variant='body1'>Choose category and reasons for rejection.</Typography>
                <Typography variant='body2'>Category</Typography>
                {
                  optionsData.map((item, i) => {
                    return <Chip key={i} label={item.label} className={classes.chip} variant={activeTab === i ? 'default' : 'outlined'} onClick={() => {
                      setSelectedCategory({ label: item?.label, value: item?.value })
                      setActiveTab(item.value)
                    }} clickable color={activeTab === i ? 'primary' : ''} />
                  })
                }
              </div>
              {
                selectedCategory && (
                  <div className={classes.actions}>
                    <Typography variant='body1'>Reason</Typography>
                    <FormGroup>
                      {
                        reasonData[selectedCategory.value][0].map((data, index) => {
                          return (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  onChange={handleReasonChange}
                                  value={data.value} key={data.value} checked={rejectReason.includes(data.value)} name={data.label}
                                />}
                              label={data.label}
                              color={activeTab === data.label ? 'primary' : ''}
                            />
                          )
                        })
                      }
                    </FormGroup>
                  </div>
                )
              }
              {
                displayReason.length != 0 && (
                  <div className={classes.actions2}>
                    <Typography variant='body1'><strong>Selected Reasons</strong></Typography>
                    {
                      displayReason.sort((a, b) => sortByKey(a, b, 'label')).map((item, i) => {
                        return (
                          <div key={i} className={classes.items}>
                            <p className={classes.eachItem}><span className={classes.itemNotation}>{i + 1}.</span> {item.label}</p>
                            <Tooltip title="Remove">
                              <IconButton size='small'>
                                <CloseIcon fontSize='small' onClick={() => removeItem(item)} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              }
            </>
          }
        </DialogContent>
        <DialogActions>
          <div>
            <Button onClick={() => setRejectModal(false)}>Cancel</Button>
            <Button color='primary' variant='outlined' onClick={updateLoanStatus}>{loading ? <CircularProgress size={22} /> : 'Confirm'}</Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={pushback}
        onClose={() => setPushback(false)}
      >
        <DialogContent>
          <DialogContentText>
            Please Enter the reason for Push back.
          </DialogContentText>
          <TextEditor setJSON={setPushbackRemarks} toolBar={true} />
          {
            errorMsg &&
              <Alert severity="error" style={{padding: '0px 16px'}}>{errorMsg}</Alert>
          }
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 5}}>
            <Button variant='outlined' style={{marginRight: 8}} onClick={() => setPushback(false)}>Cancel</Button>
            <LoaderButton
              color='primary'
              variant='contained'
              isLoading={loading}
              loadingText='Submitting...'
              onClick={handlePushBack}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default DrawerFooter;