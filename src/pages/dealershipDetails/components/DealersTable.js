import { Drawer } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import CreditInfoSideWrapper from './CreditInfoSideWrapper';

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
    cursor: 'pointer'
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
  }
}));

const DealersTable = ({ id, editable, data, titleAlign, showCreditForm, getExperianData, onClickAddMenu, formType, openCloseCreditForm, currentUser, showDealerEditForm, dealersClickRow, editFormClose }) => {
  const classes = useStyles();
  const [rowData, setRowData] = useState()

  if (!data || !data.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No Dealers Found</Typography>
        {
          editable && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Button color="primary" variant="outlined" size="small" onClick={() => onClickAddMenu('DEALER')}>Add dealer</Button>
            </div>
          )
        }
      </div>
    );
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
      </div>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Dealer Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Documents</TableCell>
            {
              editable &&
                <TableCell align="center">Action</TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow className={classes.tableRow} key={row.id}>
              <TableCell onClick={e => editable && dealersClickRow(e, row, 'DEALER')}>
                {row.first_name}&nbsp;&nbsp;
                {/* <Chip size="small" label="Experian Report" onClick={(e) => getExperianData(e, row.id)} /> */}
              </TableCell>
              <TableCell align="center" onClick={e => editable && dealersClickRow(e, row, 'DEALER')}>{row.mobile}</TableCell>
              <TableCell align="center" onClick={e => editable && dealersClickRow(e, row, 'DEALER')}>
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
    </div>
  )
}

export default DealersTable;