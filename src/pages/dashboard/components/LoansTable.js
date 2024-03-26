import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import DueTable from '../../../components/Tables/DueTable';
import OverDueTable from '../../../components/Tables/OverDueTable';
import SubmittedTable from '../../../components/Tables/SubmittedTable';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getDealershipById } from '../../../services/dealerships.service';
import ApprovedDrawer from '../RightDrawer/ApprovedDrawer';
import DisbApprovedDrawer from '../RightDrawer/DisbApprovedDrawer';
import DisbursedDrawer from '../RightDrawer/DisbursedDrawer';
import PendingApprovalDrawer from '../RightDrawer/PendingApprovalDrawer';
import PendingDisbApprovedDrawer from '../RightDrawer/PendingDisbApprovalDrawer';
import PendingReviewDrawer from '../RightDrawer/PendingReviewDrawer';
import RejectedDrawer from '../RightDrawer/RejectedDrawer';
import SubmittedDrawer from '../RightDrawer/SubmittedDrawer';
import DashboardTable from '../../../components/Tables/DashboardTable';

const statusPicker = {
  'Pending Approval': 'loan_approval',
  'Pending Review': 'loan_review',
  'Disb. Approval': 'disbursement_approval',
  'Submitted': 'submitted',
  'Approved': 'approved',
  'Rejected': 'rejected',
  'Disbursed': 'disbursed',
  'Disb. Approved': 'disbursement_approved',
}


const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 6,
  },
}));


const LoansTable = ({ currentUser, value, filterQry, handleClick, chartData }) => {
  const classes = useStyles();
  const [showPanel, setShowPanel] = useState({
    status: false,
    data: ''
  });
  const [dealershipData, setDealershipData] = useState();
  const [loansData, setLoansData] = useState();
  const [reportDetails, setReportDetails] = useState({});

  const showDealershipInfo = (id, selectedLoanData, status) => {
    setLoansData(selectedLoanData);
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch(e => null);

    setShowPanel({ status: true, data: status, id: id, editable: permissionCheck(currentUser.role_name, rulesList.loan_approval) });
  }
  const showReportsInfo = (id, selectedLoanData, status) => {
    setReportDetails(selectedLoanData)
  }
  const compProps = {
    id: showPanel?.id,
    status: showPanel?.data,
    editable: showPanel?.editable,
    currentUser: currentUser,
    data: dealershipData,
    onClose: () => { setShowPanel({ status: false }) },
    selectedLoanData: loansData,
  }

  return (
    <Box pt={2}>
      <UserCan
        role={currentUser.role_name}
        perform={rulesList.dashboard}
        yes={() => (
          <Grid container spacing={2}>
            {
              value ? (
                <Grid item md={12}>
                  <Box className={classes.tableContainer}>
                    <DashboardTable title={'Pending for Initial Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} status={statusPicker[value]} value={value} chartData={chartData} handleChange={handleClick} />
                  </Box>
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
              <Box className={classes.tableContainer}>
                <SubmittedTable title={'Submitted Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} />
              </Box>
            </>)
        )}
      />

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

export default LoansTable;