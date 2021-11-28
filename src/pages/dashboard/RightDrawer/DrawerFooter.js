import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { updateLoanStats } from '../../../services/loans.service';


const useStyles = makeStyles(theme => ({
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
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
  btnError: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
}))

const DrawerFooter = ({ id, editable, data, loanData, currentUser, onClose, status }) => {
  const classes = useStyles();
  const [reLoader, setReloader] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const handleResubmit = () => {
    setReloader(true);
    updateLoanStats(data.id, loanData.id)
      .then(res => {
        // enqueueSnackbar(res, { variant: "success" });
        setReloader(false);
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        }
        )
        setTimeout(() => {
          setReloader(false);
          window.location.reload();
        }, 2000)

        // setData(data)
      })
      .catch((e) => {
        setReloader(false);
        console.log(e);
      })
  }
  console.log('status >>>>>>>>>>>>>>>>>>>>>', status)
  return (
    <div  >
      <div className={classes.actionButtonsWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIosRoundedIcon />}
            onClick={onClose}>
            Back
          </Button>
          {
            editable && status && ['loan_review', 'loan_approval', 'approved', 'rejected'].includes(status.toLowerCase()) && (
              <UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  !reLoader ? (
                    <div>
                      <Button
                        variant="contained"
                        disabled={loanData?.isLoading}
                        className={clsx(classes.btn, classes.btnError)}
                        onClick={handleResubmit}
                      >
                        Re-submit
                      </Button>
                    </div>
                  ) : (
                    <div style={{ marginLeft: '16px' }}>
                      <CircularProgress size={30} />
                    </div>
                  )
                )}
              />)
          }
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
            status && ['submitted'].includes(status.toLowerCase()) && (
              <UserCan
                role={currentUser.role_name}
                perform={rulesList?.loan_approval}
                yes={() => (
                  <>
                    {
                      <div>
                        <Button
                          variant="contained"
                          disabled={loanData?.isLoading}
                          className={clsx(classes.btn, classes.btnSuccess)}
                          startIcon={<ThumbUpAltIcon />}
                          onClick={() => setReviewModal(true)}
                        >
                          Send for Review
                        </Button>
                      </div>
                    }
                  </>
                )}
              />
            )
          }
          {
            editable && status && ['loan_review'].includes(status.toLowerCase()) && (
              <UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  <>
                    {
                      <div>
                        <Button
                          variant="contained"
                          disabled={loanData?.isLoading}
                          className={clsx(classes.btn, classes.btnSuccess)}
                          startIcon={<ThumbUpAltIcon />}
                        // onClick={() => setRejectModal(true)}
                        >
                          Send for Approval
                        </Button>
                      </div>
                    }
                  </>
                )}
              />
            )
          }
          {
            editable && status && ['loan_approval', 'disbursement_approval'].includes(status.toLowerCase()) && (
              <UserCan
                role={currentUser.role_name}
                perform={rulesList.loan_approval}
                yes={() => (
                  <>
                    {
                      // !rejectLoader ? (
                      <div>
                        <Button
                          variant="contained"
                          disabled={loanData?.loading}
                          className={clsx(classes.btn, classes.btnError)}
                          startIcon={<ThumbDownAltIcon />}
                        // onClick={() => setRejectModal(true)}
                        >
                          Reject
                        </Button>
                      </div>
                      // ) : (
                      //   <div style={{ marginLeft: '16px' }}>
                      //     <CircularProgress size={30} />
                      //   </div>
                      // )
                    }
                    {
                      // !approveLoader ? (
                      <div>
                        <Button
                          variant="contained"
                          disabled={loanData?.loading}
                          className={clsx(classes.btn, classes.btnSuccess)}
                          startIcon={<ThumbUpAltIcon />}
                        // onClick={() => updateLoanStatus('approval')}
                        >
                          Approve
                        </Button>
                      </div>
                      // )
                      //  : (
                      //   <div style={{ marginLeft: '16px' }}>
                      //     <CircularProgress size={30} />
                      //   </div>
                      // )
                    }
                  </>
                )}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default DrawerFooter;