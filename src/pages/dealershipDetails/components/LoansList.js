import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Currency from '../../../components/Number/Currency';
import { useMount } from 'react-use';
import { getDealershipLoansById } from '../../../services/dealerships.service';

const useStyles = makeStyles({
  wrapper: {
    padding: 8
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
});

const LoansList = ({ id, titleAlign }) => {
  const classes = useStyles();
  const [data, setLoansData] = useState();
  
  useMount(() => {
    getDealershipLoansById(id)
      .then(data => setLoansData(data))
      .catch(e => null)
  });

  if(!data || !data.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No Loan details found</Typography>
      </div>
    );

  return (
    <div className={classes.wrapper}>
      <Typography variant="h5" align={titleAlign} className={classes.title}>Loans</Typography>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align="right">Requested</TableCell>
            <TableCell align="right">Approved</TableCell>
            <TableCell align="right">Disb</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.type}</TableCell>
              <TableCell align="right"><Currency value={row.amount_requested} /></TableCell>
              <TableCell align="right"><Currency value={row.amount_approved} /></TableCell>
              <TableCell align="right"><Currency value={row.amount_disbursed} /></TableCell>
              <TableCell align="center">{row.status}</TableCell>
              <TableCell align="center">
                <ButtonGroup size="small" aria-label="dealer action buttons">
                  <Button>View</Button>
                  <Button>Edit</Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default LoansList;