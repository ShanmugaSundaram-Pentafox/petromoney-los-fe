import { Drawer } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Stepper from '@material-ui/core/Stepper';
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import TrackerUpdateModal from './TrackerUpdateModal'
import Button from '../../../components/CommonComponents/Button/Button'
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog'
import FileUpload from '../../../components/FileUpload'
import NewVehicleLoanAction from '../../../components/NewVehicleLoan/NewVehicleLoanAction'
import Currency from '../../../components/Number/Currency'
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { logger } from '../../../config/logger'
import { URL } from '../../../config/serverUrls'
import { rulesList } from '../../../config/userRules';
import { getVehicleDocuments, getVehicleLoans, getVehicleServiceDetails, deleteVehicleStatus, deleteVehicleDoc, deleteVehicleLoan } from '../../../services/transports.service'
import AddNewVehicleForm from '../../transports/components/AddNewVehicleForm';


const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    color: '#9e9e9e'
  },
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  tableRow: {
    cursor: 'pointer'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  objectImage: {
    width: 500,
    height: 400,
    objectFit: 'cover'
  }
}))



const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    borderRadius: 4,
    marginBottom: 8,
    minWidth: '52vw',
    // boxShadow: "none",
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
      '&:last-child': {
        marginBottom: 8,
      },
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    // backgroundColor: "rgba(0, 0, 0, .03)",
    // borderBottom: "1px solid rgba(0, 0, 0, .125)",
    // marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
    justifyContent: 'space-between',
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  },
}))(MuiAccordionDetails)

export default function VehicleInfo({ id, data, currentUser }) {
  const [expanded, setExpanded] = useState('')
  const [docs, setDocs] = useState({})
  const [loans, setLoans] = useState({})
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState({})
  const [serviceData, setServiceData] = useState({})
  const [serviceModal, setServiceModal] = useState({})
  const [imageModal, setImageModal] = useState({})
  const [fileUpload, setFileUpload] = useState(false)
  const [showUpload, setShowUpload] = useState(true);
  const [tracking, setTracking] = useState([])
  const [rowData, setRowData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState();
  const [vehicleId, setVehicleId] = useState();
  const [vehicleDetails, setVehicleDetails] = useState();
  const [formType, setFormType] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()



  const handleChange = (vehicleId) => (event, newExpanded) => {
    setExpanded(newExpanded ? vehicleId : false);
    if (newExpanded) {
      if (!Array.isArray(docs[vehicleId])) {
        getVehicleDocuments(id, vehicleId)
          .then(res => {
            setDocs({
              ...docs,
              [vehicleId]: res
            })
          })
          .catch(e => {
            logger(e)
          })

        getVehicleLoans(vehicleId)
          .then(res => {
            const s = res.filter(ser => ser.is_service);
            if (s.length) {
              setServices({
                ...services,
                [vehicleId]: s
              })
            }
            const l = res.filter(ser => !ser.is_service);
            if (l.length) {
              setLoans({
                ...loans,
                [vehicleId]: l
              })
            }
          })
          .catch(e => {
            logger(e)
          })
      }
    }
  }
  const handleUpload = (row, vehicle) => {
    setFileUpload(true);
    setRowData(row);
    setVehicleDetails(vehicle);
  }
  const handleSave = (files) => {
    const formData = new FormData();
    const dealerShipId = id;
    files.map(file => {
      formData.append('file', file);
      formData.append('document_id', rowData.doc_id);
    });
    fetch(`${URL.base}transporter/${id}/vehicle/${vehicleDetails.vehicle_id}/docs`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${currentUser.token}`
      }
    })
      .then(res => {
        // console.log("res",res)
        return res.json()
      })
      .then(res => {
        // enqueueSnackbar('File Upload Success', { variant: "success" });
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          autoHideDuration: 3000,
          variant: 'success',
        })
        onCloseUploader();
        setTimeout(() => {
          window.location.reload();
        }, 2000)
        // console.log("data",res)
        // updateVehicleServiceDetails(id, serviceData.vehicle_id, serviceData.credit_head_id, serviceData.loan_id, { status_id: status, details: { file_url: res?.file_url?.split(" ") } })
        //   .then(res => {
        //     console.log('postServiceStatus >> ', res);
        //     // onCloseModal(true, serviceData);
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
        // onCloseUploader();
      })
      .catch(error => {
        // enqueueSnackbar('File Upload Failed', { variant: "error" });

      })

  }

  const onCloseUploader = () => {
    setShowUpload(false);
    setFileUpload(false)
  }

  const saveAndCloseNewLoan = () => {
    getVehicleLoans(expanded)
      .then(res => {
        const s = res.filter(ser => ser.is_service);
        if (s.length) {
          setServices({
            ...services,
            [expanded]: s
          })
        }
        const l = res.filter(ser => !ser.is_service);
        if (l.length) {
          setLoans({
            ...loans,
            [expanded]: l
          })
        }
      })
      .catch(e => {
        logger(e)
      })
  }

  const getServiceStatus = serviceData => {
    getVehicleServiceDetails(serviceData.vehicle_id, serviceData.credit_head_id, serviceData.id)
      .then(res => {
        setTracking(res.tracking_details);
        setServiceData(st => ({ ...st, [`${serviceData.vehicle_id}_${serviceData.credit_head_id}_${serviceData.id}`]: res }));
      })
      .catch(e => {
        console.log(e);
      });
  }
  const openServiceModal = (data) => {
    setServiceModal({
      open: true,
      data,
    })
  }

  const closeTrackingStatusModal = (fetchStatus, d) => {
    setServiceModal({ open: false })
    if (fetchStatus) {
      getServiceStatus({ ...d, id: d.loan_id });
    }
  }
  const modalOpen = (number, id) => {
    setVehicleNumber(number)
    setVehicleId(id);
    setOpenModal(true);
    setFormType('Edit')

  }
  const handleClickOpen = (number, id) => {
    setVehicleNumber(number)
    setVehicleId(id)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const deleteVehicle = () => {
    deleteVehicleStatus(id, vehicleId)
      .then(res => {
        setOpen(false)
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          autoHideDuration: 3000,
          variant: 'success',
        })

        setTimeout(() => {
          window.location.reload();
        }, 2000)
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }
  const handleDocDelete = (rowData, vehicle) => {
    deleteVehicleDoc(id, rowData, vehicle)
      .then(res => {
        setOpen(false)
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          autoHideDuration: 2000,
          variant: 'success',
        })

        setTimeout(() => {
          window.location.reload();
        }, 2000)
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })

  }
  const handleLoanDelete = (row) => {
    deleteVehicleLoan(row)
      .then(res => {
        setOpen(false)
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          autoHideDuration: 2000,
          variant: 'success',
        })

        setTimeout(() => {
          window.location.reload();
        }, 2000)
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })


  }
  return (
    <div>
      {data.map((vehicleInfo) => {
        return (
          <div key={vehicleInfo.vehicle_id}>
            <Accordion
              square
              expanded={expanded === vehicleInfo.vehicle_id}
              onChange={handleChange(vehicleInfo.vehicle_id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Vehicle Number: {vehicleInfo.tt_no}</Typography>
                <Typography>
                  Credit Limit: <Currency value={vehicleInfo.credit_limit} />
                </Typography>
                <div style={{ display: 'flex' }}>
                  {
                    !permissionCheck(currentUser.role_name, rulesList.transporter_view) ? (
                      <>
                        {/* <Tooltip title="Edit vehicle">
                          <Typography style={{ marginRight: '7px', color: '#4770C1' }} onClick={() => { modalOpen(vehicleInfo.tt_no, vehicleInfo.vehicle_id) }}>
                            <EditOutlinedIcon fontSize="medium" />
                          </Typography>
                        </Tooltip> */}
                        <Tooltip title="Delete vehicle">
                          <Typography style={{ color: '#ff6666' }}>
                            <DeleteOutlineOutlinedIcon fontSize="medium" onClick={() => handleClickOpen(vehicleInfo.tt_no, vehicleInfo.vehicle_id)} />
                          </Typography>
                        </Tooltip>
                      </>
                    ) : null
                  }
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Box mb={2}>
                  <Typography variant="h6" component="h4">Documents</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Doc</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        Array.isArray(docs[expanded]) && docs[expanded].map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>
                              <Button onClick={() => setImageModal({ open: true, image: row.file_path, type: row.file_path.endsWith('.pdf') })} >
                                <a>{row.file_path?.split('/')[row.file_path?.split('/').length - 1] || '-'}</a>
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() => handleUpload(row, vehicleInfo)}
                              >
                                Upload
                              </Button>
                              {
                                row.file_path && (
                                  <Button size="small" onClick={() => handleDocDelete(row, vehicleInfo)}>
                                    Delete
                                  </Button>
                                )
                              }
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </Box>

                <Box mb={2}>
                  <Typography variant="h6" component="h4">Loans</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        Array.isArray(loans[expanded]) && loans[expanded].map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>{row.credit_head}</TableCell>
                            <TableCell>
                              <Currency value={row.loan_amount} />
                            </TableCell>
                            <TableCell>
                              <Button size="small" onClick={() => handleLoanDelete(row)}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </Box>
                <Box mb={2}>
                  {
                    services[expanded] ? (
                      <Typography variant="h6" component="h4">Services</Typography>
                    ) : null
                  }

                  {
                    Array.isArray(services[expanded]) && services[expanded].map((row, i) => (
                      <Box mt={2} flexDirection="column" key={i}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                          <strong><small>{row.credit_head}</small></strong>
                          <Button size="small" variant="outlined" onClick={() => getServiceStatus(row)}>Check status</Button>
                        </Box>
                        <Box>
                          <Stepper key={vehicleInfo.vehicle_id} alternativeLabel nonLinear activeStep={false}>
                            {serviceData[`${row.vehicle_id}_${row.credit_head_id}_${row.id}`]?.steps?.map((item, index) => {
                              const stepProps = {
                                completed: false
                              };
                              const buttonProps = {
                                // optional: <Typography variant="caption">{item.description}</Typography>
                              };
                              // if (isStepOptional(index)) {
                              //   buttonProps.optional = <Typography variant="caption">Optional</Typography>;
                              // }
                              if (serviceData[`${row.vehicle_id}_${row.credit_head_id}_${row.id}`]?.tracking_details[index]) {
                                stepProps.completed = true;
                              }
                              return (
                                <Step key={item.status_id} {...stepProps}>
                                  <StepButton
                                    onClick={() => {
                                      if (tracking.length === index) {
                                        openServiceModal({
                                          item,
                                          completed: stepProps.completed,
                                          serviceData: serviceData[`${row.vehicle_id}_${row.credit_head_id}_${row.id}`]
                                        });

                                      }
                                    }}
                                    // completed={isStepComplete(index)}
                                    {...buttonProps}
                                    title={item.description}
                                  >
                                    {item.status}
                                    {/* <Tooltip title={item.description}>
                                      </Tooltip> */}
                                  </StepButton>
                                </Step>
                              );
                            })}
                          </Stepper>
                        </Box>
                      </Box>
                    ))
                  }
                </Box>
                <NewVehicleLoanAction vehicleId={vehicleInfo.vehicle_id} currentUser={currentUser} callback={saveAndCloseNewLoan} />
              </AccordionDetails>
            </Accordion>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              {/* <DialogTitle id="alert-dialog-title">{"Are you sure...?"}</DialogTitle> */}
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Did you want to delete the vehicle with vehicle number {vehicleNumber} ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  No
                </Button>
                <Button onClick={() => deleteVehicle()} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
      })}
      <FormDialog title={'File Preview'} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
      {
        // const d = JSON.parse((serviceData?.tracking_details?.[4]?.details || "{}").replace(/\'/g,'\"'));
        fileUpload &&
          <div style={{ minWidth: '40vw' }}>
            {<FileUpload handleSave={handleSave} id={id} data={rowData} open={fileUpload} onCloseUploader={() => setFileUpload(false)} />}
          </div>
      }

      {/* <FormDialog title={"Update Service Status"} open={serviceModal.open} onClose={() => setServiceModal({ open: false })}>
        <UpdateServiceForm data={serviceData} callback={() => null} />
      </FormDialog> */}

      <TrackerUpdateModal id={id} currentUser={currentUser} statusId={serviceModal?.data?.item?.status_id} data={serviceModal.data?.item} serviceData={serviceModal.data?.serviceData} completed={serviceModal.data?.completed} onClose={closeTrackingStatusModal} />
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <AddNewVehicleForm id={id} isAdd={formType} callback={() => setOpenModal(false)} number={vehicleNumber} trans_id={vehicleId} />
      </Drawer>
    </div>
  )
}
