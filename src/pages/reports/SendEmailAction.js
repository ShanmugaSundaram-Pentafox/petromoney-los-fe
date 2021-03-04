import React, { useState } from 'react';
import Button from '../../components/CommonComponents/Button/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Alert from '@material-ui/lab/Alert';
import TextInput from '../../../src/components/TextInput/TextInput';
import InputMask from 'react-input-mask';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import clsx from 'clsx';


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
    // boxShadow: theme.shadows[5],
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
}));

const SendEmailAction = () => {
  const classes = useStyles();
  const [dispHistory, setDispHistory] = useState({});
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);



  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const sendEmail = () => {
    setOpen(false);
    setModalData({});
    alert("mail send")
  }
  // const { values, errors, handleChange, handleSubmit, setValues } = useFormik({
  //   initialValues: {
  //     disbursement_status: 1,
  //     status: "disbursed"
  //   },
  //   validationSchema: Yup.object().shape({
  //     applicant_code: Yup.string().min(2),
  //     prospect_code: Yup.string().min(2).required("Enter Prospect code"),
  //     disbursement_date: Yup.string().required("Enter Disbursement date"),
  //     amount: Yup.string().required("Enter Amount"),
  //   }),
  //   onSubmit: values => {
  //     const data = values.applicant_code ? values : { ...values, applicant_code: dispHistory.applicant_code };
  //     setLoading(true);
  //   }
  // });


  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setModalData({ open: true })}>
        Send Email
      </Button>
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
        {/* <Fade in={modalData.open}> */}
          <div className={classes.paper}>
            <div id="">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h3>Would you like to send the reports over an email?</h3>
                  </Grid>
                  <Grid item xs={12} className={classes.actionFooter}>
                    <Button disabled={loading} variant="outlined" size="medium" color="default" onClick={() => setModalData({})}>No</Button>
                    <Button disabled={loading} className={classes.actionButton} onClick={() => sendEmail()} type="submit" variant="outlined" size="medium" color="primary">
                      {
                        loading ? <CircularProgress /> : 'Yes'
                      }
                    </Button>
                  </Grid>
                </Grid>
            </div>
          </div>
        {/* </Fade> */}
      </Modal>
    </div>
  );
}
export default SendEmailAction;