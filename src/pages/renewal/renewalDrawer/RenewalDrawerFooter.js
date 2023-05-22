import { Button, Drawer } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded'
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { resources_id } from '../../../config/accessControl';
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
      backgroundColor: theme.palette.info.dark,
      color: theme.palette.white
    },
    '&.MuiButton-outlined': {
      color: theme.palette.info.light,
      borderColor: theme.palette.info.light
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.info.light
    }
  },
}))

const RenewalDrawerFooter = ({
  id,
  currentUser,
  status,
  filterType,
  selectedLoanData,
  handleReviewModal,
  handleReject,
  handlePushBack,
}) => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <div>
      <div className={classes.actionButtonsWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {
            ['review', 'approval', 'approved', 'rejected'].includes(status) && (
              <Button variant='outlined' size='small' color='primary'
                onClick={() => setOpenDrawer(true)}
              >
                View Remarks
              </Button>
            )
          }
          {
            status && ['draft', 'submit'].includes(status.toLowerCase()) &&
              <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'send_for_review'}>
                <Button
                  variant="contained"
                  className={clsx(classes.btn, classes.btnSuccess)}
                  startIcon={<ThumbUpAltIcon />}
                  onClick={handleReviewModal}
                >
                  Send for Review
                </Button>
              </CheckAllowed>
          }
          {
            status && ['review', 'approval'].includes(status.toLowerCase()) &&
              <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'loan_reject'}>
                <Button
                  variant="contained"
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
        <ViewRemarks filterType={filterType} handleClose={() => setOpenDrawer(false)} loanId={filterType == 'enhancement' ? selectedLoanData?.id : selectedLoanData?.loan_id} />
      </Drawer>
    </div >
  )
}

export default RenewalDrawerFooter;