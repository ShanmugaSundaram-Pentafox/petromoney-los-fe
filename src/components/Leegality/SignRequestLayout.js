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
import { getCoApplicantByDealershipId, getDealersByDealershipId, getSanctionLetterPdf } from '../../services/dealers.service';
import CardsCheckList from './components/CardsCheckList';
import apiCall from '../../utils/api.util';
import { getDealershipLoansById } from '../../services/dealerships.service';
import { CompassCalibrationOutlined } from '@material-ui/icons';
import LeegalityLayout from './LeegalityLayout';
import { TableContainer } from '@material-ui/core';
import { Table } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { getLoanById } from '../../services/loans.service';
import { getAllGuarantor, getSanctionLetter } from '../../services/leegality.service';

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
  sendButton: {
    padding: "10px 20px",
  },
  content: {
    overflowY: "auto",
  }
}));

const SignRequestLayout = ({ open, onClose, title, type, dealershipId, loanId }) => {
  const classes = useStyles();
  const [dealers, setDealers] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedDealers, setSelectedDealers] = useState([])
  const [selectedCoAppicants, setSelectedCoAppicants] = useState([])
  const [docId, setDocId] = useState();
  const [status, setStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [loansData, setLoansData] = useState([]);
  const [sanctionUrl, setSanctionUrl] = useState();
  const [guarantor, setGuarantor] = useState([]);


  useEffect(() => {
    if (dealershipId) {
      getDealersByDealershipId(dealershipId)
        .then(res => {
          setDealers(res);
        })
        .catch(err => {
          console.log('getDealersByDealershipId >> ', err);
        });
      getLoanById(dealershipId, loanId)
        .then(res => {
          setLoansData(res);
          if(res?.document_id) {
            setDocId(res?.document_id)
          }
        })
        .catch(err => {
          console.log('getLoansData >> ', err)
        })
      getCoApplicantByDealershipId(dealershipId)
        .then(res => {
          setApplicants(res);
        })
        .catch(err => {
          console.log('getCoApplicantByDealershipId >> ', err)
        })
      getSanctionLetter(loanId, dealershipId)
        .then(res => {
          console.log("sanction letter 1",res);
          setSanctionUrl(res);
        })
        .catch(err => {
          console.log('getSanctionLetterPDF >> ', err)
        })
      getAllGuarantor(dealershipId)
        .then(res => {
          setGuarantor(res);
        })
        .catch(err => {
          console.log('getAllGuarantor >>', err)
        })
    }
  }, [dealershipId, loanId]);
  const updateSelectedDealers = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      setSelectedDealers([...selectedDealers, inviteeData])
    } else {
      const result = selectedDealers.filter(d => d.id !== inviteeData.id)
      setSelectedDealers(result)
    }
  }
  console.log("guarantor details", guarantor);
  const updateSelectedCoAppicants = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      setSelectedCoAppicants([...selectedCoAppicants, inviteeData])
    } else {
      const result = selectedCoAppicants.filter(d => d.id !== inviteeData.id)
      setSelectedCoAppicants(result)
    }
  }

  const sendInvitees = () => {
    if (selectedCoAppicants.length !== 0 && selectedDealers.length !== 0) {
      apiCall(`document/sign`, {
        body: {
          "dealer": selectedDealers,
          "coapplicants": selectedCoAppicants,
          "dealership_id": dealershipId,
          "type": "sanction",
          "loanId": loanId
        },
        method: "POST",
      })
        .then(res => {
          if (res.status === "SUCCESS") {
            setSuccessStatus(res.message || 'eSign request send successfully')
            setTimeout(() => {
              setDocId(res?.data?.document_id)
            }, 1500);
          } else {
            console.log('>> Document Details status error >> ', res)
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
    else {
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
      }, 3000)

    }
  }
  return (
    <Dialog
      fullWidth
      maxWidth={"lg"}
      open={open}
    >
      <DialogTitle disableTypography className={classes.dTitle}>
        <strong>{title}</strong>
        <IconButton size="small" aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        {
          docId ? (
            <LeegalityLayout docId={docId} />
          ) : (
            <Grid container spacing={2}>
              {
                type === "sanction" || type == "esign" ? (
                  <Grid item sm={8} >
                    {
                      sanctionUrl ? 
                        <PdfViewer
                          isBase64
                          file={sanctionUrl}
                        />
                        : null
                    }
                  </Grid>) : (
                  <Grid item sm={8} >
                    <Grid container spacing={2}>
                      <Grid item sm={10} >
                        <Box pt={2}>
                          <TableContainer>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Date of Agreement</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Place of execution of Agreement</TableCell>
                                  <TableCell>Chennai</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Name of the borrower</TableCell>
                                  {
                                    dealers.map(item => {
                                      return <TableCell>{item.first_name}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>Dealership Address</TableCell>
                                  {
                                    dealers?.map(item => {
                                      return <TableCell>{item.address}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>Residence Address</TableCell>
                                  {
                                    dealers?.map(item => {
                                      return <TableCell>{item.address}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>Name of Co-borrower</TableCell>
                                  {
                                    applicants.map(item => {
                                      return <TableCell>{item.first_name}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>E-mail Address of Co-borrower</TableCell>
                                  {
                                    applicants.map(item => {
                                      return <TableCell>{item.email}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>Contact Number of Co-borrower</TableCell>
                                  {
                                    applicants.map(item => {
                                      return <TableCell>{item.mobile}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>Office/Residential Address of Co-borrower</TableCell>
                                  {
                                    applicants.map(item => {
                                      return <TableCell>{item.address}</TableCell>
                                    })
                                  }
                                </TableRow>
                                <TableRow>
                                  <TableCell>Name of Guarantor</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>E-mail Address of Guarantor</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Contact Number of Guarantor</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Loan Amount</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Loan Amount (In Words)</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Office/ Residential Address of Guarantor</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Loan Cycle</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Interest rate</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Overdue Interest</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Facility of Tenor</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }
              <Grid item sm={3}>
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
                {
                  status && (
                    <Box pt={2} pl={3} color="error.main"  >
                      You must select Dealers &amp; CoApplicants...
                    </Box>
                  )
                }
                {
                  successStatus && (
                    <Box pt={2} pl={3} color="success.main"  >
                      {successStatus}
                    </Box>
                  )
                }
              </Grid>

            </Grid>
          )
        }
      </DialogContent>
      <DialogActions>
        <Box pl={2} pr={2}>
          {/* <Button onClick={onClose} color="primary">
            Cancel
          </Button> */}
          {/* {
            selectedDealers.length !== 0 && selectedCoAppicants.length !== 0 ?
              (<Button variant="contained" className={classes.sendButton} onClick={sendInvitees} color="primary">
                Send
              </Button>) : null
          } */}
          {
            docId ? null : (
              <Button variant="contained" onClick={sendInvitees} color="primary">
                Send
              </Button>
            )
          }

        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default SignRequestLayout;