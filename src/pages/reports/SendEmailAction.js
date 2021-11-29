import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import Button from '../../components/CommonComponents/Button/Button';
import { SendReports } from '../../services/common.service';




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
    textAlign: 'right',
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
  const [title, setTitle] = useState({msg: 'Yes'});
  const { enqueueSnackbar } = useSnackbar();


  const sendEmail = async () => {
    setTitle({msg: 'Sending...'})
    SendReports()
      .then((res) => {
        if (res.status=== 'SUCCESS') {
          setTitle({ completed: true, msg: res.message})
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success'
          });
          setTimeout(() => {
            setModalData({})
            setOpen(false);
            setTitle({msg: 'Yes'})
          }, 2000)
        } 
        else {
          setTitle({msg: res.message})
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error'
          });
        }
      })
      .catch((err) => {
        setModalData({})
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error'
        });
        setTitle({msg: 'Yes'});
      });
  };
  
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
                {
                  title.completed ?
                    <h3>{title.msg}</h3>
                    : <h3>Would you like to send the reports over an email ?</h3>
                }
              </Grid>
              <Grid item xs={12} className={classes.actionFooter}>
                {
                  title.msg === 'Yes' ?
                    (
                      <Button disabled={loading} variant="outlined" size="medium" color="default" onClick={() => setModalData({})}>No</Button>
                    ) : null
                }
                {
                  title.completed ? null : (
                    <Button disabled={loading} className={classes.actionButton} onClick={() => sendEmail()} type="submit" variant="outlined" size="medium" color="primary">
                      {title.msg}
                    </Button>
                  )
                }
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default SendEmailAction;