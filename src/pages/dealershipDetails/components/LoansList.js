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
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Currency from '../../../components/Number/Currency';

const useStyles = makeStyles({
  title: {
    padding: 8,
  },
  table: {
    // minWidth: 650,
  },
});

const LoansList = ({ data }) => {
  
  const classes = useStyles();

  if(!data || !data.length) return null;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" className={classes.title}>Loans</Typography>
      <Divider />
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Req</TableCell>
            <TableCell>Apr</TableCell>
            <TableCell>Disp</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.type}</TableCell>
              <TableCell><Currency value={row.amount_requested} /></TableCell>
              <TableCell><Currency value={row.amount_approved} /></TableCell>
              <TableCell><Currency value={row.amount_disbursed} /></TableCell>
              <TableCell>{row.status}</TableCell>
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

export default LoansList;