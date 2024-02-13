import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import Currency from '../../../components/Number/Currency';


const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 20,
  },
}));

const DispApprovedDataTable = ({ loanData }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" style={{ marginBottom: 16 }}>Disbursement Details</Typography>
      {loanData?.map((item) => (
        <>
          <Typography variant="h5" style={{ marginBottom: 12 }}><span style={{ color: '#888', fontSize: 14 }}>Applicant Code:</span> {item.applicant_code || '?'}</Typography>
          <Table size="small" style={{ marginBottom: 16 }}>
            <TableHead>
              <TableRow>
                <TableCell>Prospect Code</TableCell>
                <TableCell align="center">Disb Date</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (JSON.parse(item?.disbursement_details))?.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" component="th">{row.prospect_code}</TableCell>
                    <TableCell align="center">{row.disbursement_date}</TableCell>
                    <TableCell align="right"><Currency value={row.amount} /></TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </>
      ))}
    </div>
  )
}

export default DispApprovedDataTable;