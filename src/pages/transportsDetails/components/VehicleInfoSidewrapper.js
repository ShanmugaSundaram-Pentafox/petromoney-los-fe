import { Box, Button, IconButton, makeStyles, Step, StepButton, Stepper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react'
import { useMount } from 'react-use';
import NewVehicleLoanAction from '../../../components/NewVehicleLoan/NewVehicleLoanAction';
import Currency from '../../../components/Number/Currency';
import { logger } from '../../../config/logger';
import { getVehicleDocuments, getVehicleLoans } from '../../../services/transports.service';
import { VehicleDetails } from '../../transports/components/VehicleDetails'

const useStyles = makeStyles(theme => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
    width: '40vw',
    padding: 10
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: '1px solid rgb(0,0,0,0.2)'
  },
  section: {
    marginTop: 8,
    marginBottom: 8
  }
}))

export const VehicleInfoSidewrapper = ({currentUser, callbackClose, vehicleInfo, setImageModal, handleUpload, handleDocDelete, id, handleLoanDelete, getServiceStatus, openServiceModal, serviceData, tracking, editable}) => {
  const [collapse, setCollapse] = useState(true)
  const [docs, setDocs] = useState({})
  const [services, setServices] = useState({})
  const [loans, setLoans] = useState({})
  const classes = useStyles();

  useMount(() => {
    getVehicleDocuments(id, vehicleInfo?.vehicle_id)
      .then(setDocs)
      .catch(e => {
        logger(e)
      })

    getVehicleLoans(vehicleInfo?.vehicle_id)
      .then(res => {
        const s = res.filter(ser => ser.is_service);
        if (s.length) {
          setServices(s)
        }
        const l = res.filter(ser => !ser.is_service);
        if (l.length) {
          setLoans(l)
        }
      })
      .catch(e => {
        logger(e)
      })
  })

  const saveAndCloseNewLoan = () => {
    getVehicleLoans(vehicleInfo?.vehicle_id)
      .then(res => {
        const s = res.filter(ser => ser.is_service);
        if (s.length) {
          setServices(s)
        }
        const l = res.filter(ser => !ser.is_service);
        if (l.length) {
          setLoans(l)
        }
      })
      .catch(e => {
        logger(e)
      })
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <div className={classes.sidePanelTitle}>
        <Typography variant='h5'>Vehicle Details</Typography>
        <IconButton size='small' onClick={callbackClose}><CloseIcon size='small' /></IconButton>
      </div>
      <div className={classes.sidePanelFormContentWrapper}>
        <VehicleDetails vehicleTestDet={vehicleInfo?.vehicle_details} vehicleInfo={vehicleInfo} collapse={collapse}/>
        <Typography variant='body2' style={{marginTop: 14, textAlign: 'center', color: 'rgb(0,0,0,0.4)', cursor: 'pointer'}} onClick={() => setCollapse(!collapse)}>{collapse ? 'Show More' : 'Show Less'}</Typography>
        <Box mb={2}>
          <Typography variant="h6" component="h4" className={classes.section}>Documents</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Doc</TableCell>
                {
                  !editable && <TableCell>Action</TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Array.isArray(docs) && docs.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => setImageModal({ open: true, image: row.file_path, type: row.file_path.endsWith('.pdf') })} >
                        <Typography variant='body1'><strong>{row?.file_name || row.file_path?.split('/')[row.file_path?.split('/').length - 1] || '-'}</strong></Typography>
                      </Button>
                    </TableCell>
                    {
                      !editable && 
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
                    }
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Box>
        <Box mb={2}>
          <Typography variant="h6" component="h4" className={classes.section}>Loans</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                {
                  !editable && <TableCell>Action</TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Array.isArray(loans) && loans.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.credit_head}</TableCell>
                    <TableCell>
                      <Currency value={row.loan_amount} />
                    </TableCell>
                    {
                      !editable && 
                      <TableCell>
                        <Button size="small" onClick={() => handleLoanDelete(row)}>
                          Delete
                        </Button>
                      </TableCell>
                    }
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Box>
        <Box mb={2}>
          {
                        services?.length ? (
                          <Typography variant="h6" component="h4">Services</Typography>
                        ) : null
          }

          {
            Array.isArray(services) && services.map((row, i) => (
              <Box mt={2} flexDirection="column" key={i}>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <strong><small>{row.credit_head}</small></strong>
                  <Button size="small" variant="outlined" onClick={() => getServiceStatus(row)}>Check status</Button>
                </Box>
                <Box>
                  <Stepper key={vehicleInfo?.vehicle_id} alternativeLabel nonLinear activeStep={false}>
                    {serviceData[`${row.vehicle_id}_${row.credit_head_id}_${row.id}`]?.steps?.map((item, index) => {
                      const stepProps = {
                        completed: false
                      };
                      const buttonProps = {
                      };
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
                            {...buttonProps}
                            title={item.description}
                          >
                            {item.status}
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
      </div>
      {
        !editable &&
        <div className={classes.actionButtonsWrapper}>
          <NewVehicleLoanAction vehicleId={vehicleInfo?.vehicle_id} currentUser={currentUser} callback={saveAndCloseNewLoan} />
        </div>
      }
    </div>
  )
}