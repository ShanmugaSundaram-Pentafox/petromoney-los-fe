import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import ApprovalTable from './ApprovalTable';
import ApprovedTable from './ApprovedTable';
import EnhancementDrawer from './EnhancementDrawer';
import RejectedTable from './RejectedTable';
import ReviewTable from './ReviewTable';
import SubmittedTable from './SubmittedTable';
import UserCan, { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getDealershipById } from '../../services/dealerships.service';
import { RightSideDrawer } from '../../components/Mantine/RightSideDrawer/RightSideDrawer';
import DisbursementApprovalTable from './DisbursementApprovalTable';
import { Box, Grid, Paper } from '@mantine/core';
import EnhancementTableList from './EnhancementTableList';


const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 6,
  },
  sidePanelWrapper: {
    width: '70vw',
    maxWidth: '80vw'
  },
}));

const EnhancementTable = ({ currentUser, value, filterQry, statusList, statsChange }) => {
  const classes = useStyles();
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
        setDealershipData({ ...data, 'product_id': selectedLoanData?.new_product_id })
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
            {/* {
              value === 'submit' ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <SubmittedTable title={'Submitted Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
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
              } */}
            {
              value ? (
                <Grid.Col span={12}>
                  <Paper className={classes.tableContainer}>
                    <EnhancementTableList currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} status={value} statusList={statusList} statusChange={statsChange} />
                  </Paper>
                </Grid.Col>
              ) : null
            }
          </Grid>
        )}
      />
      <RightSideDrawer
        opened={showPanel.status}
        size={'70%'}
        onClose={() => setShowPanel({ modal: false })}
        title={showPanel?.id}
      >
        <div className={classes.sidePanelWrapper}>
          {
            showPanel.data && <EnhancementDrawer {...compProps} />
          }
        </div>
      </RightSideDrawer>
    </Box>
  )
}


export default EnhancementTable;