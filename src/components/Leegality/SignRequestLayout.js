import { TableContainer, Table, TableBody, TableRow, TableCell as TableCellComp } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/styles';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import CardsCheckList from './components/CardsCheckList';
import LeegalityLayout from './LeegalityLayout';
import { getOmcList, getProductsMaster } from '../../services/common.service';
import { getCoApplicantByDealershipId, getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById } from '../../services/dealerships.service';
import { getAllGuarantor, getPdfContent } from '../../services/leegality.service';
import { getLoanDocumentHistoryById } from '../../services/loans.service';
import apiCall from '../../utils/api.util';
import { numInWords } from '../../utils/commonFunctions.util';
import { ViewData } from '../CommonComponents/FilePreview';
import PdfViewer from '../CommonComponents/PdfViewer/PdfViewer';
import Currency from '../Number/Currency';


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
    padding: '10px 20px',
  },
  content: {
    overflowY: 'auto',
  },
  info: {
    color: 'rgb(0,0,0,0.4)',
    marginTop:8
  }

}));

const TableCell = withStyles(() => ({
  root: {
    border: '1px solid #eeeeee',
  },
}))(TableCellComp)

const SignRequestLayout = ({ open, onClose, title, type, dealershipId , loanId, callback, loanAmount, productId }) => {
  const classes = useStyles();
  const [dealership, setDealership] = useState({})
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
  const [product, setProduct] = useState();
  const { data: products = [] } = useQuery(['products'], () => getProductsMaster(), {refetchOnWindowFocus: false})
  const { data: omcs = [] } = useQuery('omcs', () => getOmcList(), {refetchOnWindowFocus: false})

  useEffect(() => {
    setProduct(products.find(item => item.product_id === productId))
  }, [productId])


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
      getDealershipById(dealershipId)
        .then(setDealership)
        .catch(err => {
          console.log('getDealershipDetails >>', err);
        })
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
      if(inviteeData?.signatures?.length === 2){
        let buffer = [...selectedDealers, inviteeData]
        const result = buffer.filter(d => d?.id !== inviteeData?.id)
        setSelectedDealers([...result, inviteeData]);
      } else {
        setSelectedDealers([...selectedDealers, inviteeData])
      }
    } else {
      const result = selectedDealers.filter(d => d.id !== inviteeData.id)
      setSelectedDealers(result)
    }
  }
  const updateSelectedCoAppicants = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      if(inviteeData?.signatures?.length === 2){
        let buffer = [...selectedCoAppicants, inviteeData]
        const result = buffer.filter(d=> d?.id !== inviteeData?.id)
        setSelectedCoAppicants([...result, inviteeData])
      } else {
        setSelectedCoAppicants([...selectedCoAppicants, inviteeData])
      }
    } else {
      const result = selectedCoAppicants.filter(d => d.id !== inviteeData.id)
      setSelectedCoAppicants(result)
    }
  }
  const updateSelectedGuarantors = (selectedStatus, inviteeData) => {
    if (selectedStatus) {
      if(inviteeData?.signatures?.length === 2){
        let buffer = [...selectedGuarantors, inviteeData]
        const result = buffer.filter(d=> d?.id !== inviteeData?.id)
        setSelectedGuarantors([...result, inviteeData])
      } else {
        setSelectedGuarantors([...selectedGuarantors, inviteeData])
      }
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
      apiCall('document/sign', {
        body: {
          dealer: selectedDealers,
          coapplicants: selectedCoAppicants,
          guarantor: selectedGuarantors,
          dealership_id: dealershipId,
          type: type,
          loanId: loanId,
        },
        method: 'POST',
      })
        .then(res => {
          if (res.status === 'SUCCESS') {
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
      maxWidth={'md'}
      open={open}
      onClose={onClose}
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
                <LeegalityLayout docId={loansData?.document_id} dealershipId={dealershipId} />
              ) : (
                <Grid container spacing={2}>
                  {
                    type === 'sanction' || type === 'application' ? (
                      <Grid item sm={8} md={7} >
                        {
                          pdfUrl ?
                            <PdfViewer
                              height="70vh"
                              file={pdfUrl}
                            />
                            : null
                        }
                      </Grid>) : (
                      <Grid item md={8} >
                          <Grid container spacing={2}>
                          <Grid item md={12} >
                              <Box>
                              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                  <ViewData title="Date of Agreement" value={format(new Date(), 'dd-MM-yyyy')} />
                                  <ViewData title="Place of execution of Agreement" value="Chennai" />
                                </div>
                              <TableContainer>
                                  <Table>
                                  <TableBody>
                                      <TableRow>
                                      <TableCell>Dealership Name</TableCell>
                                      <TableCell>{dealership?.name}</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Dealership Agreement Date</TableCell>
                                      <TableCell>{dealership?.agreement_executed_on}</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Dealership Address</TableCell>
                                      <TableCell>{dealership?.address}</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>OMC</TableCell>
                                      <TableCell>
                                          {
                                          omcs.find(item => {return item.id == dealership?.omc})?.name
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Name Of The Borrower</TableCell>
                                      <TableCell>
                                          {
                                          dealers.map(item => {
                                            return item.first_name
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
                                      <TableCell>Name Of Co-Borrower</TableCell>
                                      <TableCell>
                                          {
                                          applicants.map(item => {
                                            return item.first_name
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>E-Mail Address Of Co-Borrower</TableCell>
                                      <TableCell>
                                          {
                                          applicants.map(item => {
                                            return item.email
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Contact Number Of Co-Borrower</TableCell>
                                      <TableCell>
                                          {
                                          applicants.map(item => {
                                            return item.mobile
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Office/ Residential Address Of Co-Borrower</TableCell>
                                      <TableCell>
                                          {
                                          applicants.map(item => {
                                            return item.address
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Name Of Guarantor</TableCell>
                                      <TableCell>
                                          {
                                          guarantor?.map(item => {
                                            return item.first_name
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>E-Mail Address Of Guarantor</TableCell>
                                      <TableCell>
                                          {
                                          guarantor?.map(item => {
                                            return item.email
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Contact Number Of Guarantor</TableCell>
                                      <TableCell>
                                          {
                                          guarantor?.map(item => {
                                            return item.mobile
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Office/ Residential Address Of Guarantor</TableCell>
                                      <TableCell>
                                          {
                                          guarantor?.map(item => {
                                            return item.address
                                          }).join(', ')
                                        }
                                        </TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Loan Amount</TableCell>
                                      <TableCell><Currency value={loanAmount} /></TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Loan Amount (In Words)</TableCell>
                                      <TableCell>{numInWords(loanAmount)}</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>DPN Date</TableCell>
                                      <TableCell>{format(new Date(), 'dd-MM-yyyy')}</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>DPN Loan Amount</TableCell>
                                      <TableCell><Currency value={loanAmount} /></TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Loan Cycle</TableCell>
                                      <TableCell>{product?.tenure} days</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Interest Rate</TableCell>
                                      <TableCell>{product?.interest} %</TableCell>
                                    </TableRow>
                                      <TableRow>
                                      <TableCell>Overdue Interest Rate</TableCell>
                                      <TableCell>{product?.penal_interest} %</TableCell>
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
                  <Grid item sm={3} md={4}>
                    <Box>
                      <Typography variant="h4">Select Invitees</Typography>
                    </Box>
                    <Box pt={2}>
                      <Typography variant='body1'>Dealers</Typography>
                      {
                        dealers.length !==0 ?
                          <Box pt={1}>
                            <CardsCheckList
                              data={dealers}
                              onChange={updateSelectedDealers}
                            />
                          </Box>
                          : <Typography variant='body1' className={classes.info}>No Dealers Found!</Typography>
                      }
                    </Box>

                    <Box pt={2}>
                      <Typography variant='body1'>Co-applicants</Typography>
                      {
                        applicants.length !==0 ?
                          <Box pt={1}> 
                            <CardsCheckList
                              data={applicants}
                              onChange={updateSelectedCoAppicants}
                            />
                          </Box>
                          : <Typography variant='body1' className={classes.info}>No Applicants Found!</Typography>
                      }
                    </Box> 
                    <Box pt={2}>
                      <Typography variant='body1'>Guarantors</Typography>
                      {
                        guarantor.length !== 0 ?
                          <Box pt={1}>
                            <CardsCheckList
                              data={guarantor}
                              onChange={updateSelectedGuarantors}
                            />
                          </Box>
                          : <Typography variant='body1' className={classes.info}>No Guarantors Found!</Typography>
                      }
                    </Box>
                  </Grid>
                </Grid>
              ))
            }
          </DialogContent>
        )
      }
      <DialogActions>
        <Box pl={2} pr={2} style={{ display: 'flex' }}>
          {/* <Button onClick={onClose} color="primary">
            Cancel
          </Button> */}
          {/* {
            selectedDealers.length !== 0 && selectedCoAppicants.length !== 0 ?
              (<Button variant="contained" className={classes.sendButton} onClick={sendInvitees} color="primary">
                Send
              </Button>) : null
          } */}
          <div style={{ marginRight: '20px' }}>

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