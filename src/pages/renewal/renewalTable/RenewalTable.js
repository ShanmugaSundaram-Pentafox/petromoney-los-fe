import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
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


const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 6,
  },
  sidePanelWrapper: {
    width: '70vw',
    maxWidth: '80vw'
  },
}));

const RenewalTable = ({ currentUser, value, filterQry }) => {
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
          <Grid container spacing={2}>
            {
              value === 'draft' ? (
                <Grid item md={12}>
                  <Paper className={classes.tableContainer}>
                    <DraftTable title={'Applications in draft'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'review' ? (
                <Grid item md={12}>
                  <Paper className={classes.tableContainer}>
                    <ReviewTable title={'Pending for Review'} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'approval' ? (
                <Grid item md={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovalTable title={'Pending for Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === 'approved' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovedTable title={'Approved Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>

              ) : null
            }
            {
              value === 'rejected' ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <RejectedTable title={'Rejected Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
                  </Paper>
                </Grid>
              ) : null
            }
          </Grid>
        )}
      />
      <Drawer
        anchor="right"
        ModalProps={{
          onBackdropClick: () => { setShowPanel({ status: false }) }
        }}
        open={showPanel.status}
        variant={'temporary'}
      >
        <div className={classes.sidePanelWrapper}>
          {
            showPanel.data && <RenewalDrawer {...compProps} />
          }
        </div>
      </Drawer>
    </Box>
  )
}


export default RenewalTable;