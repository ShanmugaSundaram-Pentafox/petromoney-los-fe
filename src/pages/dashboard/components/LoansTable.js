import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { Link as RouterLink } from 'react-router-dom';
// import moment from 'moment';
// import clsx from 'clsx';
// import MUIDataTable from "mui-datatables";
// import Currency from '../../../components/Number/Currency';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import ApprovalReqestTable from '../../../components/Tables/ApprovalReqestTable';
import ApprovedTable from '../../../components/Tables/ApprovedTable';
import DisbursedTable from '../../../components/Tables/DisbursedTable';
import DisbursementApprovedTable from '../../../components/Tables/DisbursementApprovedTable';
import DisbursementReqestTable from '../../../components/Tables/DisbursementReqestTable';
// import DueTable from '';
import DueTable from '../../../components/Tables/DueTable';
import OverDueTable from '../../../components/Tables/OverDueTable';
import RejectedTable from '../../../components/Tables/RejectedTable';
import ReviewerTable from '../../../components/Tables/ReviewTable';
import SubmittedTable from '../../../components/Tables/SubmittedTable';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getDealershipById } from '../../../services/dealerships.service';
import { setAllLoans } from '../../../store/loans/loans.actions';
import { selectAllLoans } from '../../../store/loans/loans.selector';
import ApprovedDrawer from '../RightDrawer/ApprovedDrawer';
import DisbApprovedDrawer from '../RightDrawer/DisbApprovedDrawer';
import DisbursedDrawer from '../RightDrawer/DisbursedDrawer';
import PendingApprovalDrawer from '../RightDrawer/PendingApprovalDrawer';
import PendingDisbApprovedDrawer from '../RightDrawer/PendingDisbApprovalDrawer';
import PendingReviewDrawer from '../RightDrawer/PendingReviewDrawer';
import RejectedDrawer from '../RightDrawer/RejectedDrawer';
import SubmittedDrawer from '../RightDrawer/SubmittedDrawer';


const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 6,
    // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.12)',
    // marginBottom: theme.spacing(3)
  },
  categoryContainer: {
    display: 'flex',
  },
  categoryCard: {
    flex: 1,
    marginRight: theme.spacing(3),
    '&:last-child': {
      marginRight: 0
    }
  },
  title: {
    fontWeight: 400,
    fontSize: 18,
    padding: 8,
    backgroundColor: '#a6b1e1'
  },
  cardItem: {
    padding: '14px 12px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f2f2f2',
    display: 'block',
    position: 'relative',
    transition: 'all .3s ease-in-out',
    '&:nth-child(even)': {
      backgroundColor: 'rgba(245, 245, 245, 0.33)'
    },
    '&:hover': {
      backgroundColor: 'rgba(235, 235, 235, 0.66)',
      cursor: 'pointer'
    },
  },
  invalid: {
    backgroundColor: '#faf2f2'
  },
  cardTitle: {
    paddingBottom: 12,
    fontSize: 16,
  },
  infoSection: {
    display: 'flex',
    fontSize: 13,
    color: '#767676',
    justifyContent: 'space-between',
    paddingRight: 8
  },
  money: {
    color: '#333'
  },
  sidePanelWrapper: {
    width: '70vw',
    maxWidth: '80vw'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    fontSize: 14,
    textAlign: 'left',
    maxWidth: 600
  },
  box: {
    padding: 2,
    borderColor: 'grey'

  },
  list: {
    padding: 2,
    marginBottom: 20,
  },
  details: {
    padding: 4,
    borderColor: 'grey',
    minWidth: 150,
    height: 100,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

// const convertToCurrency = value => <Currency value={value} />;

const LoansTable = ({ currentUser, value, filterQry }) => {
  const classes = useStyles();
  const [showPanel, setShowPanel] = useState({
    status: false,
    data: ''
  });
  const [dealershipData, setDealershipData] = useState();
  // const [modalData, setModalData] = useState({});
  const [loansData, setLoansData] = useState();
  const [reportDetails, setReportDetails] = useState({});

  const showDealershipInfo = (id, selectedLoanData, status) => {
    setLoansData(selectedLoanData);
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch(e => null);
    // getDealershipLoansById(id)
    //   .then(data => setLoansData(data))
    //   .catch(e => null)

    // getDealersByDealershipId(id)
    //   .then(data => setDealersData(data))
    //   .catch(e => null)

    setShowPanel({ status: true, data: status, id: id, editable: permissionCheck(currentUser.role_name, rulesList.loan_approval) });
  }
  const showReportsInfo = (id, selectedLoanData, status) => {
    setReportDetails(selectedLoanData)
    // setModalData({ open: true })
  }
  const compProps = {
    id: showPanel?.id,
    status: showPanel?.data,
    editable: showPanel?.editable,
    currentUser: currentUser,
    data: dealershipData,
    onClose: () => { setShowPanel({ status: false }) },
    selectedLoanData: loansData,
    // updateLoanStatus: updateLoanStatus
  }

  return (
    <Box pt={2}>
      <UserCan
        role={currentUser.role_name}
        perform={rulesList.dashboard}
        yes={() => (
          <Grid container spacing={2}>
            {
              value === 'Pending Approval' ? (
                <Grid item md={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovalReqestTable title={'Pending for Initial Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'Pending Review' ? (
                <Grid item md={12}>
                  <Paper className={classes.tableContainer}>
                    <ReviewerTable title={'Pending for Review'} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'Disb. Approval' ? (
                <Grid item md={12}>
                  <Paper className={classes.tableContainer}>
                    <DisbursementReqestTable title={'Pending for Disbursement Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'Submitted' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <SubmittedTable title={'Submitted Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'Approved' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovedTable title={'Approved Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>

              ) : null
            }
            {
              value === 'Rejected' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <RejectedTable title={'Rejected Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'Disbursed' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <DisbursedTable title={'Disbursed Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'Disb. Approved' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <DisbursementApprovedTable title={'Disbursement Approved Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
          </Grid>
        )}
        no={() => (
          currentUser.role_name === 'DEALER' ? (
            <>
              <DueTable onRowClick={showReportsInfo} />
              <OverDueTable onRowClick={showReportsInfo} />

            </>
          ) : (
            <>
              <Paper className={classes.tableContainer}>
                <SubmittedTable title={'Submitted Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} />
              </Paper>
            </>)
        )}
      />
      {/* <Drawer
        anchor="right"
        // elevation={4}
        ModalProps={{
          onBackdropClick: () => { setShowPanel({ status: false }) }
        }}
        open={showPanel.status}
        variant={'temporary'}
      >
        <div className={classes.sidePanelWrapper}>
          {
            showPanel.data === 'submitted' ? <SubmittedDrawer {...compProps} />
              : showPanel.data === 'loan_review' ? <PendingReviewDrawer {...compProps} />
                : showPanel.data === 'loan_approval' ? <PendingApprovalDrawer {...compProps} />
                  : showPanel.data === 'approved' ? <ApprovedDrawer {...compProps} />
                    : showPanel?.data === 'disbursement_approval' ? <PendingDisbApprovedDrawer {...compProps} />
                      : showPanel?.data === 'disbursement_approved' ? <DisbApprovedDrawer {...compProps} />
                        : showPanel?.data === 'disbursed' ? <DisbursedDrawer {...compProps} />
                          : showPanel?.data === 'rejected' ? <RejectedDrawer {...compProps} /> : null
          }
        </div>
      </Drawer> */}

      <RightSideDrawer
        size="60%"
        opened={showPanel.status}
        onClose={() => setShowPanel({ status: false })}
        title={compProps.data?.id}
      >
        {
          showPanel.data === 'submitted' ? <SubmittedDrawer {...compProps} />
            : showPanel.data === 'loan_review' ? <PendingReviewDrawer {...compProps} />
              : showPanel.data === 'loan_approval' ? <PendingApprovalDrawer {...compProps} />
                : showPanel.data === 'approved' ? <ApprovedDrawer {...compProps} />
                  : showPanel?.data === 'disbursement_approval' ? <PendingDisbApprovedDrawer {...compProps} />
                    : showPanel?.data === 'disbursement_approved' ? <DisbApprovedDrawer {...compProps} />
                      : showPanel?.data === 'disbursed' ? <DisbursedDrawer {...compProps} />
                        : showPanel?.data === 'rejected' ? <RejectedDrawer {...compProps} /> : null
        }
      </RightSideDrawer>
    </Box>
  )
}

const mapStateToProps = createStructuredSelector({
  all_loans: selectAllLoans
});

const mapDispatchToProps = dispatch => ({
  setAllLoans: loans => dispatch(setAllLoans(loans))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoansTable);