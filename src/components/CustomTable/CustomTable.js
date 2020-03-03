import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paginationLeft: {
    // padding: theme.spacing(2),
    // textAlign: 'right',
    color: theme.palette.text.secondary,
  },
  paginationRight: {
    // padding: theme.spacing(2),
    textAlign: 'right',
    color: theme.palette.text.secondary,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const classes = useStyles();
  const {
    page,
    pageCount,
    rowsPerPage,
    setPageSize,
    canNextPage,
    canPreviousPage,
    handleNextButtonClick,
    handleBackButtonClick,
    handleFirstPageButtonClick,
    handleLastPageButtonClick,
  } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs className={classes.paginationLeft}>
        <Typography component="div">Page {page+1} of {pageCount}</Typography>
      </Grid>
      <Grid item xs className={classes.paginationRight}>
        <Typography component="span">
          Rows per page:&nbsp;&nbsp;
        </Typography>
        <Select value={rowsPerPage} onChange={e => setPageSize(Number(e.target.value))}>
          {
            [10, 20, 30].map(item => <MenuItem value={item}>{item}</MenuItem>)
          }
        </Select>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={!canPreviousPage}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={!canPreviousPage} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={!canNextPage}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={!canNextPage}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default function CustomTable ({
  columns,
  data,
  rowsPerPage=10,
}) {

  const tableConfig = {
    columns,
    data,
    initialState: { pageSize: rowsPerPage },
  };

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,

    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(tableConfig, usePagination, useGlobalFilter);

  // Render the UI for your table
  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              )})}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <TablePaginationActions
                page={pageIndex}
                pageCount={pageCount}
                rowsPerPage={pageSize}
                setPageSize={val => setPageSize(val)}
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
                handleNextButtonClick={() => nextPage()}
                handleBackButtonClick={() => previousPage()}
                handleFirstPageButtonClick={() => gotoPage(0)}
                handleLastPageButtonClick={() => gotoPage(pageCount - 1)}
              />
            </TableCell>
          </TableRow>
        </TableFooter>

      </Table>

    </TableContainer>
  )
}