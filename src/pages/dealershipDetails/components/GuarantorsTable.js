import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { useMount } from 'react-use';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

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
    cursor: 'pointer'
  },
}));

const GuarantorsTable = ({ id, editable, guarantorsData, titleAlign, getExperianData, onClickAddMenu, formType, openCloseCreditForm, rowData, currentUser, showDealerEditForm, dealersClickRow, editFormClose }) => {
  const classes = useStyles();
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
          </TableRow>
        </TableHead>
        <TableBody>
          {guarantorsData.map(row => (
            <TableRow className={classes.tableRow} key={row.id} onClick={e => editable && dealersClickRow(e, row, 'GUARANTOR')}>
              <TableCell>
                {row.first_name}&nbsp;&nbsp;
                {/* <Chip size="small" label="Experian Report" onClick={(e) => getExperianData(e, row.id)} /> */}
              </TableCell>
              <TableCell align="center">{row.mobile}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default GuarantorsTable;