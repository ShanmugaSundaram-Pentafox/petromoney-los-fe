import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { getReport } from '../../services/users.service';
import { useMount } from 'react-use';
import usePageTitle from '../../hooks/usePageTitle';
import Currency from '../../components/Number/Currency';
import moment from 'moment';

const columns = [
  { id: 'applicant_code', label: 'Applicant Code', minWidth: 170 },
  { id: 'applicant_name', label: 'Applicant Name', minWidth: 100 },
  {
    id: 'cust_code',
    label: 'Customer Code',
    minWidth: 170,
    align: 'right', 
  },
  {
    id: 'cust_region',
    label: 'Customer Region',
    minWidth: 170,
    align: 'right', 
  },
  {
    id: 'duedate',
    label: 'Due Date',
    minWidth: 170,
    align: 'right', 
    format: (value) =>  <div>{ moment(new Date(value)).format('DD MMM, YYYY') }</div>
  },
  {
    id: 'disb_amt',
    label: 'disburse Amt',
    minWidth: 170,
    align: 'right', 
    format: (value) => <Currency value={value}/>,
  },
  {
    id: 'tot_due',
    label: 'Total Due',
    minWidth: 170,
    align: 'right', 
    format: (value) => <Currency value={value}/>,
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '100%',
  },
});

export default function StickyHeadTable() {
  usePageTitle('Report OverDue')
  const [rows , setRows]= useState([])
  useMount( async () => {
      var a = await getReport()
      setRows(a.overdue)
      console.log(a.overdue)
  })


  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}