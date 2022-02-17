import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import CreditInfoSideWrapper from './CreditInfoSideWrapper';
import { logger } from '../../../config/logger';
import { deleteApplicantById } from '../../../services/dealers.service';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
  header: {
    display: 'flex',
    marginBottom: 8
  },
  footer: {
    paddingTop: 8,
    textAlign: 'right'
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
  },
  actionButtons: {
    // paddingTop: 8
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
    marginRight: 3,
    marginBottom: 4,
    padding: 4,
  }
}));

const CoApplicantsTable = ({id, editable, coApplicantsData, titleAlign, getExperianData, onClickAddMenu, formType, openCloseCreditForm, currentUser, showDealerEditForm, dealersClickRow, editFormClose }) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
  const [deleteModal, setDeleteModal] = useState({open:false});

  const DeleteApplicant = (row_data) => {
    deleteApplicantById(id, row_data?.id, row_data?.userType)
      .then(res => {
        queryClient.invalidateQueries(['co-applicants', id])
        setDeleteModal({})
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
      })
      .catch(e => {
        logger(e)
      })
  }
    
  if (!coApplicantsData || !coApplicantsData.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No CoApplicants Found</Typography>
        {
          editable && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button color="primary" variant="outlined" size="small" onClick={() => onClickAddMenu('COAPPLICANT')}>Add CoApplicants</Button>
            </div>
          )
        }
      </div>
    );

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Co-Applicants</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Co Applicant Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Documents</TableCell>
            {
              editable &&
                <TableCell align="center">Action</TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {coApplicantsData.map(row => (
            <TableRow className={classes.tableRow} key={row.id}>
              <TableCell onClick={e => editable && dealersClickRow(e, row, 'COAPPLICANT')}>
                {row.first_name}&nbsp;&nbsp;
              </TableCell>
              <TableCell align="center" onClick={e => editable && dealersClickRow(e, row, 'COAPPLICANT')}>{row.mobile}</TableCell>
              <TableCell align="center" onClick={e => editable && dealersClickRow(e, row, 'COAPPLICANT')}>
                {row.aadhar_f_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.aadhar_f_file_url} target="_blank" title={'Aadhar Front'} rel="noreferrer">{'Aadhar Front'}</a>

                </TableCell>}
                {row.aadhar_b_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.aadhar_b_file_url} target="_blank" title={'Aadhar Back'} rel="noreferrer">{'Aadhar Back'}</a>

                </TableCell>}
                {row.pan_file_url && <TableCell style={{ border: 0 }} align="center">
                  <a className={classes.document}
                    href={row.pan_file_url} target="_blank" title={'PAN'} rel="noreferrer">{'PAN'}</a>
                </TableCell>}
                {!row.pan_file_url && !row.aadhar_b_file_url && !row.aadhar_f_file_url &&
                  <TableCell style={{ border: 0 }} align="center">
                    -
                  </TableCell>}
              </TableCell>
              {
                editable &&
                  <TableCell align="right">
                    <Button size='small' variant='outlined' color='secondary' onClick={() => setRowData(row)}>Credit Info</Button>
                    <Button size='small' variant='outlined' style={{color: '#f05454e6', marginLeft: 8, borderColor: '#f05454e6'}} onClick={() => setDeleteModal({open:true, data:row})}>Delete</Button>
                  </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Drawer
        anchor="right"
        open={rowData}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          {
            // !dealerData?.isLoading && !coApplicantsData?.isLoading &&
            <CreditInfoSideWrapper dealershipId={id} data={rowData} currentUser={currentUser} onClose={() => setRowData()} />
          }
        </div>
      </Drawer>
      <Dialog
        open={deleteModal?.open}
        onClose={() => setDeleteModal({})}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this co-applicant named {deleteModal?.data?.first_name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size='small' onClick={() => setDeleteModal({})}>Cancel</Button>
          <Button variant='contained' size='small' style={{backgroundColor: '#f05454e6', color: 'white'}} onClick={() => DeleteApplicant(deleteModal?.data)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CoApplicantsTable;