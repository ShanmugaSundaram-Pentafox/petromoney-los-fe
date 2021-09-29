import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Moment from 'moment';
// import Button from '../../components/CommonComponents/Button/Button';
import Currency from '../../components/Number/Currency';
import DueTable from '../../components/Tables/DueTable';
import OverDueTable from '../../components/Tables/OverDueTable';

const useStyles = makeStyles(theme => ({
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
    justifyContent: 'center',
    '&.makeStyles-details-46 p': {
      fontSize: 12,
      marginTop: 6,
    }
  }
}));
const DealersDueReport = ({ currentUser }) => {
  const classes = useStyles();
  const [modalData, setModalData] = useState({});
  const [reportDetails, setReportDetails] = useState({});


  const showReportsInfo = (id, selectedLoanData, status) => {
    setReportDetails(selectedLoanData)
    setModalData({ open: true })
  }

  return (
    <>
      {
        currentUser.role_name === "DEALER" && (
          <Grid container spacing={2}>
            <Grid item md={6}>
              <OverDueTable id={currentUser.dealership_id} onRowClick={showReportsInfo} />
            </Grid>
            <Grid item md={6}>
              <DueTable id={currentUser.dealership_id} onRowClick={showReportsInfo} />
            </Grid>
          </Grid>
        )
      }
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
                <Typography>Loan ID &nbsp; &nbsp; &nbsp; &nbsp; <strong>{reportDetails.prospectcode}</strong></Typography>
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
                      <strong>{Moment(reportDetails.duedate, 'DD-MM-YYY').format('DD MMM YY')}</strong>
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
                      <strong>{
                        Moment(reportDetails.duedate, 'DD-MM-YYYY').diff(Moment(), 'days')}</strong>
                      <p>Days Remaining</p>
                    </div>
                  </Box>
                </Box>
                <div style={{ textAlign: 'center' }}>
                  <Typography>Total Due Amount</Typography>
                  <Typography style={{ marginBottom: 20 }}><strong><Currency value={reportDetails.tot_due} /></strong></Typography>
                  {/* <Button variant="contained" size="medium" style={{ backgroundColor: '#008B45', color: 'white' }}>Pay Now</Button> */}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DealersDueReport;