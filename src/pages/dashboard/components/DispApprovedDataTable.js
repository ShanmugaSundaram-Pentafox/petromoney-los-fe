import React, { useState, useEffect } from 'react';
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
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import clsx from 'clsx';
import Currency from '../../../components/Number/Currency';
import { logger } from '../../../config/logger';
import TextInput from '../../../components/TextInput/TextInput';
import { updateLoanApprovalStatusById, deleteLoanDisbursementRecord } from '../../../services/loans.service';
import InputMask from 'react-input-mask';
import DayPickerInput from "react-day-picker/DayPickerInput";
import CircularProgress from '@material-ui/core/CircularProgress';
import 'react-day-picker/lib/style.css';
import { Label } from 'recharts';
import { useFlexLayout } from 'react-table';


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
    padding: theme.spacing(4),
    fontSize: 14,
    maxWidth: 600
  },
  actionFooter: {
    textAlign: "right",
  },
  actionButton: {
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    marginTop: 4,
  },
  gridStyle: {
    margin: 'auto',
    width: '50%',
    padding: 10,
  }
}));

const DispApprovedDataTable = ({ id, loanData, editable }) => {
  const classes = useStyles();
  const [dispHistory, setDispHistory] = useState({});
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setDispHistory({
      applicant_code: loanData.applicant_code,
      disbursement_details: loanData.disbursement_details
    });
  }, [loanData]);

  const { values, errors, handleChange, handleSubmit, setValues } = useFormik({
    initialValues: {
      disbursement_status: 1,
      status: "disbursed"
    },
    validationSchema: Yup.object().shape({
      applicant_code: Yup.string().required("Enter valid Applicant code").matches(/^CN0000[0-9]+$/, "Enter Valid Applicant code"),
      prospect_code: Yup.string().required("Enter Prospect code"),
      disbursement_date: Yup.date().required("Enter Disbursement date"),
      amount: Yup.string().required("Enter Amount"),
    }),
    onSubmit: values => {
      const data = values.applicant_code ? { ...values, disbursement_date: selectedDate } : { ...values, applicant_code: dispHistory.applicant_code, disbursement_date: selectedDate };
      setLoading(true);
      updateLoanApprovalStatusById(id, loanData.id, data)
        .then(({ data, message }) => {
          data?.applicant_code && setDispHistory({
            applicant_code: data.applicant_code,
            disbursement_details: data.disbursement_details
          });
          setLoading(false);
          setApiStatus({ status: 'success', message });
          setTimeout(() => {
            setModalData({ open: false })
          }, 700);
        })
        .catch(e => {
          setLoading(false);
          setApiStatus({ status: 'error', message: e });
          logger(e);
        })
    }
  });

  const onRowEdit = data => {
    setValues({
      ...data,
      status: "disbursed"
      // disbursement_date: moment(new Date(data.disbursement_date)).format("YYYY/MM/DD")
    });
    setModalData({ open: true });
  }

  const onRowDelete = data => {
    setConfirmDelete({ status: true, data })
  }

  const deleteRecord = data => {
    setLoading(true);
    deleteLoanDisbursementRecord(id, loanData.id, data)
      .then(({ message }) => {
        setLoading(false);
        setApiStatus({ status: 'success', message });
        setTimeout(() => {
          setConfirmDelete({})
        }, 700);
      })
      .catch(e => {
        setLoading(false);
        setApiStatus({ status: 'error', message: e });
        logger(e);
      })
  }
  const handleDayChange = (selectedDay, modifiers, dayPickerInput) => {
    // const input = dayPickerInput.getInput();
    // setSelectDate(selectedDay)
    setSelectedDate(dayPickerInput.state.value)
  }
  const OverlayComponent = ({ children, ...props }) => {
    return (
      <TextInput
        direction
        alignTop
        required
        name={"disbursement_date"}
        labelText="Disbursement Date"
        placeholder="Example (YYYY/MM/DD)"
        error={errors.disbursement_date}
        helperText={errors.disbursement_date}
        value={values.disbursement_date}
        onDayChange={handleDayChange}
      />
    )



  }

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
                  <Button variant="outlined" size="small" onClick={() => onRowEdit(row)}>Edit</Button>
                  <Button variant="outlined" size="small" onClick={() => onRowDelete(row)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} align="center">
              {
                editable &&
                <Button variant="outlined" size="medium" color="secondary" onClick={() => setModalData({ open: true })} startIcon={<AddRoundedIcon fontSize="small" />}>Add Disbursed Amount</Button>
              }
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
            <Typography variant="h4" id="disbursement-row-data-title" style={{ marginBottom: 20 }}>Add New Disbursed Data</Typography>
            <div id="disbursement-row-data-description">
              <form
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {
                      dispHistory.applicant_code ? (
                        <Typography variant="h5" style={{ marginBottom: 12 }}><span style={{ color: "#888", fontSize: 14 }}>Applicant Code:</span> {dispHistory.applicant_code || "?"}</Typography>
                      ) : (
                        <TextInput
                          direction
                          alignTop
                          required
                          name={"applicant_code"}
                          labelText="Applicant Code"
                          error={errors.applicant_code}
                          helperText={errors.applicant_code}
                          defaultValue={values.applicant_code}
                          onChange={handleChange}
                        />
                      )
                    }
                  </Grid>
                  <Grid item sm={6}>
                    <TextInput
                      direction
                      alignTop
                      required
                      name={"prospect_code"}
                      labelText="Prospect Code"
                      error={errors.prospect_code}
                      helperText={errors.prospect_code}
                      defaultValue={values.prospect_code}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item sm={6}
                    // style={{ backgroundColor: "green" }}
                    className={classes.gridStyle}
                  >
                    <div className={classes.label}><label >Disbursement Date</label></div>
                    <DayPickerInput
                      required
                      format="YYYY/MM/DD"
                      name={"disbursement_date"}
                      label="Disbursement Date"
                      placeholder="(YYYY/MM/DD)"
                      error={errors.disbursement_date}
                      value={values.disbursement_date}
                      helperText={errors.disbursement_date}
                      onDayChange={handleDayChange}
                      classNames={classes.input}
                    />
                    {/* <InputMask
                      mask="9999/99/99"
                      placeholder="Example (YYYY/MM/DD)"
                      value={values.disbursement_date}
                      error={errors.disbursement_date}
                      onChange={handleChange}
                    >
                      {
                        ({ inputProps }) => (
                          <> */}
                    {/* <TextInput
                              direction
                              alignTop
                              required
                              // name={"disbursement_date"}
                              labelText="Disbursement Date"
                              // placeholder="Example (YYYY/MM/DD)"
                              // error={errors.disbursement_date}
                              // helperText={errors.disbursement_date}
                              // value={values.disbursement_date}
                              // {...inputProps}
                              // onChange={dataValue => handleChange(moment(dataValue).format("YYYY/MM/DD"))}
                            /> */}

                    {/* </>
                        )
                      }
                    </InputMask> */}
                  </Grid>
                  <Grid item sm={6}>
                    <TextInput
                      direction
                      alignTop
                      money
                      required
                      name={"amount"}
                      labelText="Amount"
                      defaultValue={values.amount}
                      error={errors.amount}
                      helperText={errors.amount}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* <Grid item sm={12}>
                    <TextInput
                      direction
                      alignTop
                      multiline
                      required
                      rows={4}
                      rowsMax={8}
                      name={"disbursement_remarks"}
                      labelText="Remarks"
                      defaultValue={values.disbursement_remarks}
                      error={errors.disbursement_remarks}
                      helperText={errors.disbursement_remarks}
                      onChange={handleChange}
                      />
                  </Grid> */}
                  <Grid item xs={12} className={classes.actionFooter}>
                    <Button disabled={loading} variant="outlined" size="medium" color="default" onClick={() => setModalData({})}>Cancel</Button>
                    <Button disabled={loading} className={classes.actionButton} type="submit" variant="outlined" size="medium" color="primary">
                      {
                        loading ? <CircularProgress /> : 'Save'
                      }
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
      <Dialog
        open={confirmDelete.status}
        onClose={() => setConfirmDelete({})}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Delete Disbursement Record?</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            You are trying to remove a disbursement record(<strong>Prospect code: {confirmDelete?.data?.prospect_code}</strong>). Click confirm to proceed.
            Click cancel if you are not sure.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({})} disableElevation>
            Cancel
          </Button>
          <Button onClick={() => deleteRecord(confirmDelete.data)} color="primary" autoFocus disableElevation>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {
        apiStatus.type && (
          <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
        )
      }
    </div>
  )
}

export default DispApprovedDataTable;