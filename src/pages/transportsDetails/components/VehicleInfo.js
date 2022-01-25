import { Drawer, Grid, Paper } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useQueryClient } from 'react-query';
import TrackerUpdateModal from './TrackerUpdateModal'
import { VehicleInfoSidewrapper } from './VehicleInfoSidewrapper';
import Button from '../../../components/CommonComponents/Button/Button'
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog'
import FileUpload from '../../../components/FileUpload'
import Currency from '../../../components/Number/Currency'
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { URL } from '../../../config/serverUrls'
import { rulesList } from '../../../config/userRules';
import { getVehicleServiceDetails, deleteVehicleStatus, deleteVehicleDoc, deleteVehicleLoan } from '../../../services/transports.service'
import AddNewVehicleForm from '../../transports/components/AddNewVehicleForm';


const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    color: '#9e9e9e'
  },
  sidePanelTitle: {
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

export default function VehicleInfo({ id, data, currentUser }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
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
  const [vehicleDetailsForm, setVehicleDetailsForm] = useState({open: false})
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()

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
        return res.json()
      })
      .then(res => {
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
      })
      .catch(error => {
      })

  }

  const onCloseUploader = () => {
    setShowUpload(false);
    setFileUpload(false)
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
    <Paper borderRadius={5}>
      <Typography variant='h6' style={{padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>Vehicle</div>
        <Button color="primary" variant="outlined" onClick={() => {setOpenModal(true); setFormType('Add');}}>Add Vehicle</Button>
      </Typography>
      <Grid container>
        <Grid item md={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle No</TableCell>
                <TableCell>Credit Limit</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.length ?
                  data.map((vehicleInfo, i) => {
                    return(
                      <TableRow key={i}>
                        <TableCell>{vehicleInfo.tt_no}</TableCell>
                        <TableCell><Currency value={vehicleInfo.credit_limit} /></TableCell>
                        {
                          !permissionCheck(currentUser.role_name, rulesList.transporter_view) ? (
                            <TableCell style={{display: 'flex'}} align='center'>
                              <Tooltip title="Vehicle Details">
                                <Typography style={{ marginRight: '7px', color: '#329de0f5' }}>
                                  <InfoTwoToneIcon fontSize="medium" onClick={(e) => {setVehicleDetailsForm({ open: true, vehicleInfo: vehicleInfo })}} />
                                </Typography>
                              </Tooltip>
                              <Tooltip title="Delete vehicle">
                                <Typography style={{ color: '#ff6666' }}>
                                  <DeleteTwoToneIcon fontSize="medium" onClick={(e) => {handleClickOpen(vehicleInfo.tt_no, vehicleInfo.vehicle_id)}} />
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          ) : null
                        }
                      </TableRow>
                    )
                  }) :
                  <Typography variant='body1' style={{margin: 10, color: 'rgb(0,0,0,0.4)'}}>No Vehicles Found!</Typography>
              }
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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
      
      <FormDialog title={'File Preview'} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
      {
        fileUpload &&
          <div style={{ minWidth: '40vw' }}>
            {<FileUpload handleSave={handleSave} id={id} data={rowData} open={fileUpload} onCloseUploader={() => setFileUpload(false)} />}
          </div>
      }

      <TrackerUpdateModal id={id} currentUser={currentUser} statusId={serviceModal?.data?.item?.status_id} data={serviceModal.data?.item} serviceData={serviceModal.data?.serviceData} completed={serviceModal.data?.completed} onClose={closeTrackingStatusModal} />
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => {setOpenModal(false); queryClient.invalidateQueries(['vehicleData', id]);}}
        variant="temporary"
      >
        <AddNewVehicleForm id={id} isAdd={formType} callback={() => setOpenModal(false)} number={vehicleNumber} trans_id={vehicleId} />
      </Drawer>
      <Drawer
        anchor="right"
        open={vehicleDetailsForm?.open}
        onClose={() => setVehicleDetailsForm({open: false})}
        variant="temporary"
      >
        <VehicleInfoSidewrapper currentUser={currentUser} callbackClose={() => setVehicleDetailsForm({open: false})} setImageModal={setImageModal} handleUpload={handleUpload} vehicleInfo={vehicleDetailsForm?.vehicleInfo} handleDocDelete={handleDocDelete} id={id} handleLoanDelete={handleLoanDelete} getServiceStatus={getServiceStatus} openServiceModal={openServiceModal} serviceData={serviceData} tracking={tracking} />
      </Drawer>
    </Paper>
  )
}
