import React, { useState } from 'react';
import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useFormik } from 'formik';
import moment from 'moment';
import clsx from 'clsx';
import Currency from '../../../components/Number/Currency';
import { logger } from '../../../config/logger';
import TextInput from '../../../components/TextInput/TextInput';
// import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    fontSize: 14
  },
}));

const DispApprovedDataTable = ({ id, loanData }) => {
  const classes = useStyles();

  const [dispHistory, setDispHistory] = useState({});
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});

  useMount(() => {
    setDispHistory({
      applicant_code: loanData.applicant_code,
      disbursement_details: loanData.disbursement_details
    });
  }, [loanData]);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {},
    onSubmit: values => {
      console.log('>> DISP APPR MODAL >> ', values),
      setLoading(true);
      updateLoanApprovalStatusById(id, loanData.id, values)
        .then(({ message }) => {
          setLoading(false);
          setApiStatus({ status: 'success', message });
        })
        .catch(e => {
          setLoading(false);
          setApiStatus({ status: 'error', message: e });
          logger(e);
        })
    }
  });

  return (
    <div className={classes.root}>
      <Typography variant="h5" style={{ marginBottom: 16 }}>Disbursement Details</Typography>
      <Typography variant="h5" style={{ marginBottom: 12 }}><span style={{ color: "#888", fontSize: 14 }}>Applicant Code:</span> {dispHistory.applicant_code || "?"}</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Prospect Code</TableCell>
            <TableCell align="center">Disb Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          dispHistory?.disbursement_details?.map((row, i) => (
            <TableRow key={i}>
              <TableCell scope="row" component="th">{row.prospect_code}</TableCell>
              <TableCell align="center">{row.disbursement_date}</TableCell>
              <TableCell align="right"><Currency value={row.amount} /></TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small">Edit</Button>
              </TableCell>
            </TableRow>
          ))
        }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} align="center">
              <Button variant="outlined" size="medium" color="secondary" onClick={() => setModalData({ open: true })} startIcon={<AddRoundedIcon fontSize="small" />}>Add Disbursed Amount</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Modal
        aria-labelledby="disbursement-row-data-title"
        aria-describedby="disbursement-row-data-description"
        className={classes.modal}
        open={modalData.open}
        onClose={() => setModalData({})}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={modalData.open}>
          <div className={classes.paper}>
            <h3 id="disbursement-row-data-title">Add New Disbursed Data</h3>
            <div id="disbursement-row-data-description">

              <form
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <Grid container>
                  <Grid item xs={12}>
                    
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default DispApprovedDataTable;