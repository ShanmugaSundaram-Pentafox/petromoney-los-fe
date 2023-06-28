import { Dialog, DialogContent, DialogContentText, Drawer, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { green, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import CreditInfoSideWrapper from './CreditInfoSideWrapper';
import CrimeInfoSideWrapper from './CrimeInfoSideWrapper';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { action_id, resources_id } from '../../../config/accessControl';
import { addApplicants } from '../../../services/fileUpload.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    padding: 8
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fafafa',
    }
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
  }
}));



const DealersTable = ({ id, data, titleAlign, onClickAddMenu, currentUser, dealersClickRow }) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
  const [crimeData, setCrimeData] = useState();
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [openFilePreview, setOpenFilePreview] = useState();

  const deleteApplicant = (values) => {
    const obj = { ...values, is_active: values.is_active == 1 ? 0 : 1 };
    const resObj = compareObject(values, obj, { category: values?.category })
    let apiUrl = `applicant/${id}/${values?.id}/active`;
    addApplicants(resObj, currentUser, apiUrl, values?.id)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setOpenDialog({ open: false })
        queryClient.invalidateQueries(['dealership-applicants', id])
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        setOpenDialog({ open: false })
      })
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '50%' }} variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Dealer Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Documents</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow className={classes.tableRow} style={{ backgroundColor: row?.is_main_applicant == 1 ? '#EAFAF1' : null }} key={row.id} onClick={e => dealersClickRow(e, row, 'DEALER')}>
              <TableCell >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{row.first_name}&nbsp;&nbsp;</Typography>
                  {
                    row?.is_main_applicant == 1 ?
                      <Typography variant='caption'>( mainapplicant )</Typography> : null
                  }
                </div>
              </TableCell>
              <TableCell align="center">{row.mobile}</TableCell>
              <TableCell align="center">
                {
                  row.aadhar_file_url && (
                    <TableCell style={{ border: 0 }} align="center">
                      <div className={classes.document} onClick={() => { setOpenFilePreview({ open: true, image: row.aadhar_file_url,type: row?.aadhar_file_url?.endsWith('.pdf') }); }}>
                        <p>{'Aadhaar'}</p>
                      </div>
                    </TableCell>
                  )
                }
                {
                  row.pan_file_url && (
                    <TableCell style={{ border: 0 }} align="center">
                      <div className={classes.document} onClick={() => { setOpenFilePreview({ open: true, image: row.pan_file_url,type: row?.pan_file_url?.endsWith('.pdf') }); }}>
                        <p>{'PAN'}</p>
                      </div>
                    </TableCell>
                  )
                }
                {
                  !row.pan_file_url && !row.aadhar_file_url &&
                    <TableCell style={{ border: 0 }} align="center">
                      -
                    </TableCell>
                }
              </TableCell>
              <TableCell align="right" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {/* dealer crime check access permission */}
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerCrimeCheck}>
                    <Button style={{ marginRight: 12 }} size='small' variant='outlined' color='secondary' onClick={() => setCrimeData(row)}>Crime check</Button>
                  </CheckAllowed>
                  {/* dealer credit check access permission */}
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerCreditCheck}>
                    <Button size='small' variant='outlined' color='secondary' onClick={() => setRowData(row)}>Credit Info</Button>
                  </CheckAllowed>
                  {/* // dealer status change permission */}
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerStatus}>
                    <div style={{ marginLeft: 12 }} onClick={() => { setOpenDialog({ open: true, data: row }) }}>
                      {
                        row.is_active == 0 ? (
                          <Tooltip title='Activate'>
                            <CheckCircleTwoToneIcon style={{ color: grey[500] }} />
                          </Tooltip>
                        ) : (
                          <Tooltip title='Deactivate'>
                            <CheckCircleTwoToneIcon style={{ color: green[200] }} />
                          </Tooltip>
                        )
                      }
                    </div>
                  </CheckAllowed>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openDialog?.open}
        onClose={() => setOpenDialog({ ...openDialog, open: false })}
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <InfoCircleOutlined style={{ fontSize: 48, margin: 16, marginBottom: 20, color: openDialog?.data?.is_active ? 'rgb(255,59,48)' : 'rgb(62, 175, 118)' }} />
            <Typography variant='h3'>Are you sure?</Typography>
          </div>
          <DialogContentText style={{ textAlign: 'center' }}>{`Do you really want to delete ${openDialog?.data?.first_name}?`}</DialogContentText>
        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 19 }}>
          <Button size='medium' variant='outlined' onClick={() => setOpenDialog({ ...openDialog, open: false })}>Cancel</Button>
          <Button variant='contained' size='medium' style={openDialog?.data?.is_active == 1 ? { backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 16 } : { backgroundColor: 'rgb(62, 175, 118)', color: 'white', marginLeft: 16 }} onClick={() => deleteApplicant(openDialog?.data)}>
            {openDialog?.data?.is_active == 1 ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </Dialog>
      <Drawer
        anchor="right"
        open={rowData}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <CreditInfoSideWrapper dealershipId={id} data={rowData} currentUser={currentUser} onClose={() => setRowData()} />
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        open={crimeData}
        onClose={() => { setCrimeData() }}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <CrimeInfoSideWrapper dealershipId={id} data={crimeData} currentUser={currentUser} onClose={() => setCrimeData()} />
        </div>
      </Drawer>
      <FormDialog className={classes.dialogBox} onDownload={openFilePreview?.image} open={openFilePreview?.image} onClose={() => setOpenFilePreview({ open: false })}>
        <FilePreview data={openFilePreview} />
      </FormDialog>
    </div>
  )
}

export default DealersTable;