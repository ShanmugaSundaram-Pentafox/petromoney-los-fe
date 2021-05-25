import React, { useState } from "react"
import { withStyles } from "@material-ui/core/styles"
import MuiAccordion from "@material-ui/core/Accordion"
import Box from "@material-ui/core/Box"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import Currency from "../../../components/Number/Currency"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getVehicleDocuments, getVehicleLoans, getVehicleServiceDetails, deleteVehicleStatus, updateVehicleServiceDetails } from "../../../services/transports.service"
import { logger } from "../../../config/logger"
import Button from "../../../components/CommonComponents/Button/Button"
import NewVehicleLoanAction from "../../../components/NewVehicleLoan/NewVehicleLoanAction"
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog"
import TrackerUpdateModal from "./TrackerUpdateModal"
import FileUpload from "../../../components/FileUpload"
import { URL } from "../../../config/serverUrls"
import { useSnackbar } from 'notistack';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AddNewVehicleForm from "../../transports/components/AddNewVehicleForm";



const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    borderRadius: 4,
    marginBottom: 8,
    // boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
      "&:last-child": {
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
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
    justifyContent: "space-between",
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  },
}))(MuiAccordionDetails)

export default function VehicleInfo({ id, data, currentUser }) {
  const [expanded, setExpanded] = useState("")
  const [docs, setDocs] = useState({})
  const [loans, setLoans] = useState({})
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
  const [modalType, setModalType] = useState("");
  const { enqueueSnackbar } = useSnackbar();


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
  const handleUpload = () => {
    setFileUpload(true);
  }
  const handleSave = (files) => {
    const formData = new FormData();
    const dealerShipId = id;
    files.map(file => {
      formData.append(`file`, file);
      formData.append(`document_id`, 18);
    });
    fetch(`${URL.base}transporter/${data[0].vehicle_id}/vehicle/${id}/docs`, {
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
        enqueueSnackbar('File Upload Success', { variant: "success" });
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
    setModalType("EDIT");
  }
  const deleteVehicle = (vehicleId) => {
    deleteVehicleStatus(id, vehicleId)
      .then(res => {
        // if (res.status ==="SUCCESS") {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
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
                <Typography variant="h6">Vehicle Number: {vehicleInfo.tt_no}</Typography>
                <Typography>
                  Credit Limit: <Currency value={vehicleInfo.credit_limit} />
                </Typography>
                <div style={{ display: "flex" }}>
                  <Tooltip title="Edit vehicle">
                    <Typography style={{ marginRight: '7px', color: "#4770C1" }} onClick={() => modalOpen(vehicleInfo.tt_no, vehicleInfo.vehicle_id)}>
                      <EditOutlinedIcon fontSize="medium" />
                    </Typography>
                  </Tooltip>
                  <Tooltip title="Delete vehicle">
                    <Typography style={{ color: '#ff6666' }}>
                      <DeleteOutlineOutlinedIcon fontSize="medium" onClick={() => deleteVehicle(vehicleInfo.vehicle_id)} />
                    </Typography>
                  </Tooltip>
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
                        Array.isArray(docs[expanded]) && docs[expanded].map(row => (
                          <TableRow>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>
                              <Button onClick={() => setImageModal({ open: true, image: row.file_path })}>
                                {row.file_path?.split("/")[row.file_path?.split("/").length - 1] || '-'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={handleUpload}
                              >
                                Upload
                              </Button>
                              <Button size="small">
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
                        Array.isArray(loans[expanded]) && loans[expanded].map(row => (
                          <TableRow>
                            <TableCell>{row.credit_head}</TableCell>
                            <TableCell>
                              <Currency value={row.loan_amount} />
                            </TableCell>
                            <TableCell>
                              <Button size="small">
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
                  <Typography variant="h6" component="h4">Services</Typography>

                  {
                    Array.isArray(services[expanded]) && services[expanded].map(row => (
                      <Box mt={2} flexDirection="column">
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
          </div>
        )
      })}

      <FormDialog title={""} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
        {imageModal.image && <img src={imageModal.image} alt="image-viewer" />}
      </FormDialog>
      {
        // const d = JSON.parse((serviceData?.tracking_details?.[4]?.details || "{}").replace(/\'/g,'\"'));
        fileUpload &&
        <div style={{ minWidth: '40vw' }}>
          {<FileUpload handleSave={handleSave} id={id} data={rowData} open={showUpload} onCloseUploader={onCloseUploader} />}
        </div>
      }

      {/* <FormDialog title={"Update Service Status"} open={serviceModal.open} onClose={() => setServiceModal({ open: false })}>
        <UpdateServiceForm data={serviceData} callback={() => null} />
      </FormDialog> */}

      <TrackerUpdateModal id={id} currentUser={currentUser} statusId={serviceModal?.data?.item?.status_id} data={serviceModal.data?.item} serviceData={serviceModal.data?.serviceData} completed={serviceModal.data?.completed} onClose={closeTrackingStatusModal} />
      <FormDialog
        title="Add Vehicle"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddNewVehicleForm id={id} number={vehicleNumber} trans_id={vehicleId} modalType={modalType} />
      </FormDialog>
    </div>
  )
}
