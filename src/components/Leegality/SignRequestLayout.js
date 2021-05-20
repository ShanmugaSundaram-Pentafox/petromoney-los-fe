import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { getLoanById, getLoanDocumentHistoryById } from '../../services/loans.service';
import { getAllGuarantor, getPdfContent } from '../../services/leegality.service';
import { useSnackbar } from 'notistack';


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

const SignRequestLayout = ({ open, onClose, title, type, dealershipId, loanId, callback }) => {
  const classes = useStyles();
  const [dealers, setDealers] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedDealers, setSelectedDealers] = useState([])
  const [selectedCoAppicants, setSelectedCoAppicants] = useState([])
  const [selectedGuarantors, setSelectedGuarantors] = useState([])
  // const [docId, setDocId] = useState();
  const [status, setStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [loansData, setLoansData] = useState({});
  const [pdfUrl, setPdfUrl] = useState();
  const [signedLetterUrl, setSignedLetterUrl] = useState();
  const [guarantor, setGuarantor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideSend, setHideSend] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if (loanId) {
      setLoading(true);
      getLoanDocumentHistoryById(loanId, type)
        .then(res => {
          setLoansData(res);
          setSignedLetterUrl(res.sanction_url)
          // if (res?.document_id) {
          //   setDocId(res?.document_id)
          // }
          if (['sanction', 'application'].includes(type)) {
            getPdfContent(loanId, dealershipId, type)
              .then(res => {
                setPdfUrl(res);
              })
              .catch(err => {
                console.log('getPdfContent >> ', err)
              })
          } else {
            setPdfUrl(undefined);
          }
          setLoading(false);
        })
        .catch(err => {
          console.log('getLoansData >> ', err)
        })
    }
    if (dealershipId) {
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

      getAllGuarantor(dealershipId)
        .then(res => {
          setGuarantor(res);
        })
        .catch(err => {
          console.log('getAllGuarantor >>', err)
        })
    }
  }, [dealershipId, loanId, type]);
  const updateSelectedDealers = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      setSelectedDealers([...selectedDealers, inviteeData])
    } else {
      const result = selectedDealers.filter(d => d.id !== inviteeData.id)
      setSelectedDealers(result)
    }
  }
  const updateSelectedCoAppicants = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      setSelectedCoAppicants([...selectedCoAppicants, inviteeData])
    } else {
      const result = selectedCoAppicants.filter(d => d.id !== inviteeData.id)
      setSelectedCoAppicants(result)
    }
  }
  const updateSelectedGuarantors = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      setSelectedGuarantors([...selectedGuarantors, inviteeData])
    } else {
      const result = selectedGuarantors.filter(d => d.id !== inviteeData.id)
      setSelectedGuarantors(result)
    }
  }
  const ReloadData = () => {
    getLoanDocumentHistoryById(loanId, type)
      .then(res => {
        setLoansData(res);
        setLoading(false);
      })
      .catch(err => {
        console.log('getLoansData >> ', err)
      })
  }

  const sendInvitees = () => {
    setHideSend(true);
    if (selectedCoAppicants.length !== 0 && selectedDealers.length !== 0) {
      apiCall(`document/sign`, {
        body: {
          dealer: selectedDealers,
          coapplicants: selectedCoAppicants,
          guarantor: selectedGuarantors,
          dealership_id: dealershipId,
          type: type,
          loanId: loanId,
        },
        method: "POST",
      })
        .then(res => {
          if (res.status === "SUCCESS") {
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
            // setSuccessStatus(res.message || 'eSign request send successfully')
            setTimeout(() => {
              ReloadData();
              onClose();
              setHideSend(false);
            }, 3000);

            // callback();
            // setTimeout(() => {
            //   setDocId(res?.data?.document_id)
            // }, 1500);
          } else {
            setHideSend(false)
            console.log('>> Document Details status error >> ', res)
          }
        })
        .catch(err => {
          console.log(err)
        });
    }
    else {
      setHideSend(false);
      setStatus(true);
      setTimeout(() => {
        setStatus(false);
      }, 2000)

    }
  }
  return (
    <Dialog
      fullWidth
      maxWidth={"lg"}
      open={open}
      onClose={() => {
        setLoansData({});
      }}
    >
      <DialogTitle disableTypography className={classes.dTitle}>
        {
          type === 'sanction' ? (<strong>Sanction Letter</strong>) : type === 'agreement' ? <strong>Loan Agreement</strong> : <strong>{title}</strong>
        }
        {/* <strong>{title}</strong> */}
        <IconButton size="small" aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {
        loansData.is_signed ? (
          <DialogContent dividers className={classes.content}>

            <Grid container spacing={2}>
              <Grid item sm={8}>
                {
                  loansData.document_url ? (
                    <PdfViewer
                      file={loansData.document_url}
                    />
                  ) : null
                }
              </Grid>
            </Grid>
          </DialogContent>

        ) : (
          <DialogContent dividers className={classes.content}>
            {
              loading ? (
                <CircularProgress className="circular-progress-color" variant="determinate" color="green" />
              ) : (loansData?.document_id ? (
                <LeegalityLayout docId={loansData.document_id} />
              ) : (
                <Grid container spacing={2}>
                  {
                    type === "sanction" || type == "application" ? (
                      <Grid item sm={12} >
                        {
                          pdfUrl ?
                            <PdfViewer
                              isBase64
                              file={pdfUrl}
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
                                      <TableCell>
                                        {
                                          dealers.map(item => {
                                            return item.first_name
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Dealership Address</TableCell>
                                      <TableCell>
                                        {
                                          dealers?.map(item => {
                                            return item.address
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Residence Address</TableCell>
                                      <TableCell>
                                        {
                                          dealers?.map(item => {
                                            return item.address
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Name of Co-borrower</TableCell>
                                      <TableCell>
                                        {
                                          applicants.map(item => {
                                            return item.first_name
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>E-mail Address of Co-borrower</TableCell>
                                      <TableCell>
                                        {
                                          applicants.map(item => {
                                            return item.email
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Contact Number of Co-borrower</TableCell>
                                      <TableCell>
                                        {
                                          applicants.map(item => {
                                            return item.mobile
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Office/Residential Address of Co-borrower</TableCell>
                                      <TableCell>
                                        {
                                          applicants.map(item => {
                                            return item.address
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Name of Guarantor</TableCell>
                                      <TableCell>
                                        {
                                          guarantor?.map(item => {
                                            return item.first_name
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>E-mail Address of Guarantor</TableCell>
                                      <TableCell>
                                        {
                                          guarantor?.map(item => {
                                            return item.email
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Contact Number of Guarantor</TableCell>
                                      <TableCell>
                                        {
                                          guarantor?.map(item => {
                                            return item.mobile
                                          }).join(', ')
                                        }
                                      </TableCell>
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
                                      <TableCell>
                                        {
                                          guarantor?.map(item => {
                                            return item.address
                                          }).join(', ')
                                        }
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Loan Cycle</TableCell>
                                      <TableCell>15 Days - Revolving Credit</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Interest rate</TableCell>
                                      <TableCell>18 % P.A.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Overdue Interest</TableCell>
                                      <TableCell>30 % P.A.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Facility of Tenor</TableCell>
                                      <TableCell>12 Months</TableCell>
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
                      type === 'agreement' && guarantor.length !==0 &&
                      <Box pt={2}>
                        <p>Guarantors</p>
                        <Box pt={1}>
                          <CardsCheckList
                            data={guarantor}
                            onChange={updateSelectedGuarantors}
                          />
                        </Box>
                      </Box>
                    }
                  </Grid>
                </Grid>
              ))
            }
          </DialogContent>
        )
      }
      <DialogActions>
        <Box pl={2} pr={2} style={{ display: "flex" }}>
          {/* <Button onClick={onClose} color="primary">
            Cancel
          </Button> */}
          {/* {
            selectedDealers.length !== 0 && selectedCoAppicants.length !== 0 ?
              (<Button variant="contained" className={classes.sendButton} onClick={sendInvitees} color="primary">
                Send
              </Button>) : null
          } */}
          <div style={{ marginRight: "20px" }}>

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
          </div>
          {
            !loading && loansData?.document_id ? null : hideSend ? null : (
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