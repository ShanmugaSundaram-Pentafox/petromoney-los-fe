import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import PdfViewer from '../CommonComponents/PdfViewer/PdfViewer';
import { getCoApplicantByDealershipId, getDealersByDealershipId } from '../../services/dealers.service';
import CardsCheckList from './components/CardsCheckList';
import apiCall from '../../utils/api.util';
import { getDealershipLoansById } from '../../services/dealerships.service';
import { CompassCalibrationOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const SignRequestLayout = ({ open, onClose, title, dealershipId, loanId }) => {
  const classes = useStyles();
  const [dealers, setDealers] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedDealers, setSelectedDealers] = useState([])
  const [selectedCoAppicants, setSelectedCoAppicants] = useState([])
  
  useEffect(() => {
    if(dealershipId) {
      getDealersByDealershipId(dealershipId)
        .then(res => {
          setDealers(res);
        })
        .catch(err => {
          console.log('getDealersByDealershipId >> ', err);
        });
  
      getCoApplicantByDealershipId(dealershipId)
        .then(res => {
          setApplicants(res);
        })
        .catch(err => {
          console.log('getCoApplicantByDealershipId >> ', err)
        })
    }
  }, [dealershipId]);

  const updateSelectedDealers = (selectedStatus, inviteeData) => {
    if(selectedStatus) {
      setSelectedDealers([...selectedDealers, inviteeData])
    } else {
      const result = selectedDealers.filter(d => d.id !== inviteeData.id)
      setSelectedDealers(result)
    }
  }
  const updateSelectedCoAppicants = (selectedStatus, inviteeData) => {
    if(selectedStatus) {
      setSelectedCoAppicants([...selectedCoAppicants, inviteeData])
    } else {
      const result = selectedCoAppicants.filter(d => d.id !== inviteeData.id)
      setSelectedCoAppicants(result)
    }
  }

  const sendInvitees = () => {
    apiCall(`document/sign`,{
      body : {
        "dealer":selectedDealers,
        "coapplicants":selectedCoAppicants,
        "dealership_id":dealershipId,
        "type": "agreement",
        "loanId":loanId
      },
      method : "POST",
    })
    .then(res => {
      if(res.status === "SUCCESS") {
        onClose()
      } else {
        console.log('>> Document Details status error >> ', res)
      }
    })
    .catch(err => {
      console.log(err)
    });
  }

  return (
    <Dialog
      fullWidth
      maxWidth={"lg"}
      scroll="paper"
      open={open}
    >
      <DialogTitle disableTypography className={classes.dTitle}>
        <strong>{title}</strong>
        <IconButton size="small" aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <PdfViewer
              file={'http://docs.petromoney.in/111018/application/15101410_loan_application.pdf'}
              />
          </Grid>
          <Grid item sm={6}>
            <Box>
              <Typography variant="h4">Select Invitees</Typography>
            </Box>
            <Box pt={2}>
              <p>Dealers</p>
              <Box pt={1}>
                <CardsCheckList
                  data={dealers}
                  onChange={updateSelectedDealers}
                />
              </Box>
            </Box>
            <Box pt={2}>
              <p>Co-applicants</p>
              <Box pt={1}>
                <CardsCheckList
                  data={applicants}
                  onChange={updateSelectedCoAppicants}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Box pl={2} pr={2}>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={sendInvitees} color="primary">
            Send
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default SignRequestLayout;