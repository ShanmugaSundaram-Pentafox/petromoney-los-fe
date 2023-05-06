import { Button, Drawer } from '@material-ui/core';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded'
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { resources_id } from '../../../config/accessControl';
import { getLoanById } from '../../../services/loans.service';
import { isAllowed } from '../../../utils/cerbos';
import CheckAllowed from '../../rbac/CheckAllowed';
import ViewRemarks from '../renewalTable/ViewRemarks';

const useStyles = makeStyles(theme => ({
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
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
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  btnWarn: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.white
    },
    '&.MuiButton-outlined': {
      color: theme.palette.warning.light,
      borderColor: theme.palette.error.main
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.warning.light
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

const RenewalDrawerFooter = ({
  id,
  currentUser,
  status,
  selectedLoanData,
  handleReviewModal,
  handleReject,
  handlePushBack,
}) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.loan_id))
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <div>
      <div className={classes.actionButtonsWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='outlined' size='small' color='primary'
            onClick={() => setOpenDrawer(true)}
          >
            View Remarks
          </Button>
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
            status && ['draft'].includes(status.toLowerCase()) &&
              <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'send_for_review'}>
                <Button
                  variant="contained"
                  disabled={loanData?.isLoading}
                  className={clsx(classes.btn, classes.btnSuccess)}
                  startIcon={<ThumbUpAltIcon />}
                  onClick={handleReviewModal}
                >
                  Send for Review
                </Button>
              </CheckAllowed>
          }
          {
            status && ['review'].includes(status.toLowerCase()) &&
              <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'loan_reject'}>
                <Button
                  variant="contained"
                  disabled={loanData?.loading}
                  className={clsx(classes.btn, classes.btnWarn)}
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handlePushBack}
                >
                  Pushback
                </Button>
              </CheckAllowed>
          }
          {
            status && ['approval', 'review'].includes(status.toLowerCase()) &&
              <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'loan_reject'}>
                <Button
                  variant="contained"
                  disabled={loanData?.loading}
                  className={clsx(classes.btn, classes.btnError)}
                  startIcon={<ThumbDownAltIcon />}
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </CheckAllowed>
          }
          {
            status && status.toLowerCase() === 'approval' && (isAllowed(currentUser?.permissions, resources_id.dashboard, 'loan_approve')) &&
              <Button
                variant="contained"
                disabled={loanData?.loading}
                className={clsx(classes.btn, classes.btnSuccess)}
                startIcon={<ThumbUpAltIcon />}
                onClick={handleReviewModal}
              >
                Approve
              </Button>
          }
          {
            status && ['review'].includes(status.toLowerCase()) && (isAllowed(currentUser?.permissions, resources_id.dashboard, 'send_for_approval')) &&
              <div>
                <Button
                  variant="contained"
                  disabled={loanData?.isLoading}
                  className={clsx(classes.btn, classes.btnSuccess)}
                  startIcon={<ThumbUpAltIcon />}
                  onClick={handleReviewModal}
                >
                  Send for Approval
                </Button>
              </div>
          }
        </div>
      </div>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        variant="temporary"
      >
        <ViewRemarks handleClose={()=>setOpenDrawer(false)} loanId={selectedLoanData?.loan_id} />
      </Drawer>
    </div >
  )
}

export default RenewalDrawerFooter;