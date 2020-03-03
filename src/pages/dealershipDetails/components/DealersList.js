import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

const DealersList = ({ data }) => {
  
  const classes = useStyles();
  if(!data || !data.length) return null;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Dealer Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.first_name}</TableCell>
              <TableCell>{(row.gender)}</TableCell>
              <TableCell>{row.mobile}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton
                    // className={classes.editButton}
                    color="inherit"
                    onClick={() => null}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DealersList;