import React, { useState } from 'react';
import { createStructuredSelector } from 'reselect';
// import { Link as RouterLink } from 'react-router-dom';
// import moment from 'moment';
// import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
// import MUIDataTable from "mui-datatables";
import Grid from '@material-ui/core/Grid';
import { selectAllLoans } from '../../../store/loans/loans.selector';
import { setAllLoans } from '../../../store/loans/loans.actions';
// import Currency from '../../../components/Number/Currency';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { getDealershipById } from '../../../services/dealerships.service';
import DealershipDetails from './DealershipDetails';
import SubmittedTable from '../../../components/Tables/SubmittedTable';
import ApprovalReqestTable from '../../../components/Tables/ApprovalReqestTable';
import DisbursementReqestTable from '../../../components/Tables/DisbursementReqestTable';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import DisbursementApprovedTable from '../../../components/Tables/DisbursementApprovedTable';
import ApprovedTable from '../../../components/Tables/ApprovedTable';
import RejectedTable from '../../../components/Tables/RejectedTable'
import DisbursedTable from '../../../components/Tables/DisbursedTable';
// import DueTable from '';
import OverDueTable from '../../../components/Tables/OverDueTable';
import DueTable from '../../../components/Tables/DueTable';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { getDealerDetails } from '../../../services/dealers.service';
import Currency from '../../../components/Number/Currency';
import Button from '../../../components/CommonComponents/Button/Button';
import { BorderColor } from '@material-ui/icons';
import Moment from 'moment';




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
    backgroundColor: "#a6b1e1"
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
    width: '60vw',
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

const LoansTable = ({ currentUser, all_loans, setAllLoans, value }) => {
  const classes = useStyles();
  const [showPanel, setShowPanel] = useState({
    status: false,
    data: ""
  });
  const [dealershipData, setDealershipData] = useState();
  const [modalData, setModalData] = useState({});
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

    setShowPanel({ status: true, data: status });
  }
  const showReportsInfo = (id, selectedLoanData, status) => {
    getDealerDetails()
      .then(data => {
        setReportDetails(selectedLoanData)
      })
      .catch(e => null);
      setModalData({ open: true })
  }
  let input = reportDetails.duedate;
  return (
    <Box pt={2}>
      <UserCan
        role={currentUser.role_name}
        perform={rulesList.loan_approval}
        yes={() => (
          <Grid container spacing={2}>
            {
              value === "Pending Approval" ? (
                <Grid item md={6}>
                  <Paper className={classes.tableContainer}>
                    <ApprovalReqestTable title={"Pending for Initial Approval"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === "Pending Disbursement Approval" ? (
                <Grid item md={6}>
                  <Paper className={classes.tableContainer}>
                    <DisbursementReqestTable title={"Pending for Disbursement Approval"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === "Submitted" ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <SubmittedTable title={"Submitted Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === "Approved" ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <ApprovedTable title={"Disbursement Approved Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                  </Paper>
                </Grid>

              ) : null
            }
            {
              value === "Rejected" ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <RejectedTable title={"Rejected Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                  </Paper>
                </Grid>
              ) : null
            }
            {
              value === "Disbursed" ? (
                <Grid item xs={12}>
                  <Paper className={classes.tableContainer}>
                    <DisbursedTable title={"Disbursed Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                  </Paper>
                </Grid>
              ) : null
            }
          </Grid>
        )}
        no={() => (
          currentUser.role_name === "DEALER" ? (
            <>
              <DueTable onRowClick={showReportsInfo} />
              <OverDueTable onRowClick={showReportsInfo} />

            </>
          ) : (
              <>
                <Paper className={classes.tableContainer}>
                  <SubmittedTable title={"Submitted Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                </Paper>
              </>)
        )}
      />
      <Drawer
        anchor="right"
        // elevation={4}
        ModalProps={{
          onBackdropClick: () => { setShowPanel({ status: false }) }
        }}
        open={showPanel.status}
        variant={"temporary"}
      >
        <div className={classes.sidePanelWrapper}>
          <DealershipDetails
            data={dealershipData}
            loanData={loansData}
            status={showPanel.data}
            currentUser={currentUser}
            onClose={() => { setShowPanel({ status: false }) }}
          />
        </div>
      </Drawer>
      <Modal
        className={classes.modal}
        open={modalData.open}
        onClose={() => setModalData({})}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <div className={classes.paper}>
          <div id="">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Loan ID &nbsp; &nbsp; &nbsp; &nbsp;<strong>{reportDetails.prospectcode}</strong></Typography>
                <Typography>Dealership &nbsp;  {reportDetails.cust_code} - {reportDetails.applicant_name}</Typography>
                <Typography style={{ paddingBottom: 50 }}>Sales Area &nbsp; {reportDetails.cust_salesarea}</Typography>
                <Box borderBottom={1} display="flex" className={classes.box} >
                  <Box borderRight={1} className={classes.details}>
                    <div>
                      <strong>{Moment(reportDetails.disb_date, 'DD-MM-YYYY').format('DD MMM YY')}</strong>
                      <p>Disbursement Date</p>
                    </div>
                  </Box>
                  <Box borderRight={1} className={classes.details}>
                    <div>
                      <strong>{Moment(input, 'DD-MM-YYY').format('DD MMM YY')}</strong>
                      <p>Due Date</p>
                    </div>
                  </Box>
                  <Box className={classes.details}>
                    <div>
                      <strong><Currency value={reportDetails.disb_amt} /></strong>
                      <p>Disbursement Amount</p>
                    </div>
                  </Box>
                </Box>
                <Box display="flex" className={classes.list}>
                  <Box borderRight={1} className={classes.details}>
                    <div>
                      <strong><Currency value={reportDetails.prin_due} /></strong>
                      <p>Principal Due</p>
                    </div>
                  </Box>
                  <Box borderRight={1} className={classes.details}>
                    <div>
                      <strong><Currency value={reportDetails.int_due} /></strong>
                      <p>Interest Due</p>
                    </div>
                  </Box>
                  <Box item md={4} className={classes.details}>
                    <div>
                      <strong>{Moment(reportDetails.disb_date, 'DD-MM-YYYY').toNow(input, 'DD-MM-YYYY')}</strong>
                      <p>Days Remaining</p>
                    </div>
                  </Box>
                </Box>
                <div style={{ textAlign: 'center' }}>
                  <Typography>Total Due Amount</Typography>
                  <Typography style={{ marginBottom: 20 }}><Currency value={reportDetails.tot_due} /></Typography>
                  <Button variant="contained" size="medium" style={{ backgroundColor: '#008B45', color: 'white' }}>Pay Now</Button>
                </div>

              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
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