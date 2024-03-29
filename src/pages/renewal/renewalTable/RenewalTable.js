import React, { useState } from 'react';
import ApprovalTable from './ApprovalTable';
import ApprovedTable from './ApprovedTable';
import DraftTable from './DraftTable';
import RejectedTable from './RejectedTable';
import ReviewTable from './ReviewTable';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getDealershipById } from '../../../services/dealerships.service';
import RenewalDrawer from '../renewalDrawer/RenewalDrawer';
import DisbursementApprovalTable from './DisbursementApprovalTable';
import { Box, Grid, Paper } from '@mantine/core';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import classes from './Renewal.module.css'

const RenewalTable = ({ currentUser, value, filterQry }) => {
  const [showPanel, setShowPanel] = useState({
    status: false,
    data: ''
  });
  const [dealershipData, setDealershipData] = useState();
  const [loansData, setLoansData] = useState();

  const showDealershipInfo = (id, selectedLoanData, status) => {
    setLoansData(selectedLoanData);
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch(e => null);

    setShowPanel({ status: true, data: status, id: id, editable: permissionCheck(currentUser.role_name, rulesList.loan_approval) });
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
          <Grid gutter={2} mt={15}>
            {
              value === 'draft' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <DraftTable title={'Applications in draft'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid.Col>
              ) : null
            }
            {
              value === 'review' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <ReviewTable title={'Pending for Review'} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid.Col>
              ) : null
            }
            {
              value === 'approval' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovalTable title={'Pending for Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid.Col>
              ) : null
            }
            {
              value === 'approved' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovedTable title={'Approved Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid.Col>

              ) : null
            }
            {
              value === 'rejected' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <RejectedTable title={'Rejected Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid.Col>
              ) : null
            }
            {
              value === 'Disb. Approval' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <DisbursementApprovalTable title={'Disbursement Approval Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid.Col>
              ) : null
            }
          </Grid>
        )}
      />
      <RightSideDrawer
        opened={showPanel.status}
        onClose={() => setShowPanel({ status: false })}
        size={'70%'}
        title={showPanel?.id}
      >
        <div className={classes.sidePanelWrapper}>
          {
            showPanel.data && <RenewalDrawer {...compProps} />
          }
        </div>
      </RightSideDrawer>
    </Box>
  )
}


export default RenewalTable;