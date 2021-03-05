import React, { useState } from 'react';
import Button from '../../components/CommonComponents/Button/Button';
import { makeStyles } from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {SendReports} from '../../services/common.service';



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
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [title, setTitle] =useState("Would you like to send the reports over an email?")

  const sendEmail = async () => {
    setTitle("Email Sending...")
     await SendReports()
    setTitle("Mail Sent successfully")
    setTimeout(() => {
    setOpen(false);
    setModalData({})
    setTitle("Would you like to send the reports over an email?")
    }, 2000)
    
  }

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
        <div className={classes.paper}>
          <div id="">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>{title}</h3>
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
      </Modal>
    </div>
  );
}
export default SendEmailAction;