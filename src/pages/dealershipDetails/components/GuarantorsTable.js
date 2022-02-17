import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
// import { useMount } from 'react-use';
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
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fafafa',
    }
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
  },
}));

const GuarantorsTable = ({ id, editable, guarantorsData, titleAlign, getExperianData, onClickAddMenu, formType, openCloseCreditForm, currentUser, showDealerEditForm, dealersClickRow, editFormClose }) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
  const [deleteModal, setDeleteModal] = useState({open:false});
  
  const DeleteApplicant = (row_data) => {
    deleteApplicantById(id, row_data?.id, row_data?.userType)
      .then(res => {
        queryClient.invalidateQueries(['guarantors', id])
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

  if (!guarantorsData || !guarantorsData.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No Guarantors Found</Typography>
        {
          editable && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button color="primary" variant="outlined" size="small" onClick={() => onClickAddMenu('GUARANTOR')}>Add Guarantor</Button>
            </div>
          )
        }
      </div>
    );

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Guarantor</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Guarantor Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            {
              editable &&
                <TableCell align="center">Action</TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {guarantorsData.map(row => (
            <TableRow className={classes.tableRow} key={row.id}>
              <TableCell onClick={e => editable && dealersClickRow(e, row, 'GUARANTOR')}>
                {row.first_name}&nbsp;&nbsp;
                {/* <Chip size="small" label="Experian Report" onClick={(e) => getExperianData(e, row.id)} /> */}
              </TableCell>
              <TableCell align="center" onClick={e => editable && dealersClickRow(e, row, 'GUARANTOR')}>{row.mobile}</TableCell>
              {
                editable &&
                  <TableCell align="right">
                    <Button size='small' variant='outlined' color='secondary' onClick={() => setRowData(row)}>Credit Info</Button>
                    <Button size='small' variant='outlined' style={{color: '#f05454e6', marginLeft: 8, borderColor: '#f05454e6'}} onClick={() => setDeleteModal({open: true, data: row})}>Delete</Button>
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
            Do you really want to delete this guarantor named {deleteModal?.data?.first_name}?
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

export default GuarantorsTable;