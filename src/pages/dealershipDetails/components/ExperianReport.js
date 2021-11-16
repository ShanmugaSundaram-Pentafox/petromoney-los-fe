import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useMount } from 'react-use';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getExperianReportById, refreshExperianReportById } from '../../../services/common.service';
import Currency from '../../../components/Number/Currency';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  row: {
    paddingLeft: 10,
    paddingRight: 4,
    paddingBottom: 10
  },
  titleRow: {
    paddingRight: 4,
    paddingBottom: 14
  },
  panelTitle: {
    textAlign: 'center',
    padding: '12px 16px',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelTitle: {
    fontSize: 16,
    padding: '8px 4px',
    marginBottom: 8,
    borderBottom: '1px dashed #ccc',
    background: '#f6f6f6'
  },
  textLabel: {
    fontSize: 14,
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: 24
  },
  actionFooter: {

  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
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
}));

const Text = ({ show = true, label, value }) => {
  const classes = useStyles();
  const gridItem = {
    md: 6,
    item: true,
    className: classes.row
  };
  return show ? (
    <>
      <Grid {...gridItem}>
        <Typography className={classes.textLabel} variant="p">{label}</Typography>
      </Grid>
      <Grid {...gridItem}>
        <Typography className={classes.textLabel} variant="p">{value}</Typography>
      </Grid>
    </>
  ) : null
}

const ExperianReport = ({ id, type, onClose }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState();
  const classes = useStyles();
  const gridItem = {
    md: 12,
    item: true,
    className: classes.titleRow
  };
  useMount(() => {
    getReport();
  });

  const getReport = refresh => {
    if (refresh) {
      setLoading(true);
      refreshExperianReportById(id, type)
        .then(res => {
          setData(res[0] || {});
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.log('Experian report fetch err - ', err);
        })
      return;
    }

    getExperianReportById(id, type)
      .then(res => {
        setData(res[0] || {});
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('Experian report fetch err - ', err);
      })
  }

  if (loading) {
    return (
      <div className={classes.sidePanelFormWrapper}>
        <Typography className={classes.panelTitle} variant="h4">Experian Report</Typography>
        <div className={classes.sidePanelFormContentWrapper}>
          Getting the report...
        </div>
      </div>
    )
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.panelTitle} variant="h4">Experian Report</Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <Grid container>
          <Text label={"Name"} value={`${data.first_name} ${data.last_name}`} />
          <Text label={"PAN"} value={data.pan} />
          <Text label={"Date of Birth"} value={data.dob} />
          <Text show={data.telephone} label={"Telephone"} value={data.telephone} />
          <Text show={data.mobile} label={"Mobile"} value={data.mobile} />
          <Text show={data.email} label={"Email"} value={data.email} />

          <Grid {...gridItem}>
            <Typography className={classes.sidePanelTitle} variant="h4">Score</Typography>
          </Grid>
          <Text label={"Bureau Score"} value={data.bureau_score} />
          <Text label={"Bureau Score Confidence"} value={data.bureau_score_confidence} />
          <Text show={data.credit_rating} label={"Credit Rating"} value={data.credit_rating} />

          <Grid {...gridItem}>
            <Typography className={classes.sidePanelTitle} variant="h4">Credit Account</Typography>
          </Grid>
          <Text label={"Total"} value={data.ca_total} />
          <Text label={"Active"} value={data.ca_active} />
          <Text label={"Default"} value={data.ca_default} />
          <Text label={"Closed"} value={data.ca_closed} />
          <Text label={"CAD Suit Filed Current Balance"} value={data.ca_suit_file_current_balance} />

          <Grid {...gridItem}>
            <Typography className={classes.sidePanelTitle} variant="h4">Total Outstanding Balance</Typography>
          </Grid>
          <Text label={"Balance Secured"} value={<Currency value={data.os_balance_secured} />} />
          <Text label={"Balance Secured Percentage"} value={data.os_balance_secured_percentage} />
          <Text label={"Balance Unsecured"} value={<Currency value={data.os_balance_unsecured} />} />
          <Text label={"Balance Unsecured Percentage"} value={data.os_balance_unsecured_percentage} />
          <Text label={"Balance All"} value={<Currency value={data.os_balance_all} />} />

          <Grid {...gridItem}>
            <Typography className={classes.sidePanelTitle} variant="h4">CAIS Account Details</Typography>
          </Grid>
          <Text label={"Account Type"} value={data.account_type} />
          <Text label={"Open Date"} value={data.open_date} />
          <Text label={"Credit Limit Amount"} value={<Currency value={data.credit_limit} />} />
          <Text label={"Highest Credit or Original Loan Amount"} value={<Currency value={data.highest_credit} />} />

        </Grid>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="contained"
              startIcon={<NavigateBeforeRoundedIcon />}
              disabled={loading}
              onClick={onClose}>Close</Button>
          </div>
          <div>
            <Button
              variant="contained"
              className={classes.btnSuccess}
              startIcon={<RefreshIcon />}
              onClick={() => setOpenDialog(true)}>Refresh</Button>
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Refresh Experian Report?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Getting latest experian report will incur some cost. Click confirm to proceed.
            Click cancel if you are not sure.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { setOpenDialog(false); getReport(true); }} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ExperianReport;