import React, { useState } from 'react';
// import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { useMount } from 'react-use';
// import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import Currency from '../../../components/Number/Currency';
// import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  }
}));

const DispApprovedDataTable = ({ id, loanData }) => {
  const classes = useStyles();

  const [dispHistory, setDispHistory] = useState({});

  useMount(() => {
    setDispHistory({
      applicant_code:"CN0000000000024",
      disbursement_details: [
        { prospect_code: "FULCR0000000013",
          disbursement_date: "19-07-22 00:00:00",
          disbursement_remarks: "test 1",
          loan_amount: "500000"}, 
        { prospect_code: "FULCR0000000013",
          disbursement_date: "19-07-22 00:00:00",
          disbursement_remarks: "test 2",
          loan_amount: "500000"}
      ]
    });
    // if(!loans || !loans.length) {
      // getLoansByStatus('disbursed')
      //   .then(data => {
      //     setLoansData('disbursed', data);
      //   })
      //   .catch(e => null)
    // }
  });
  
  if(!dispHistory.applicant_code) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">Applicant Code: {dispHistory.applicant_code}</Typography>
      {
        Array.isArray(dispHistory.disbursement_details) ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Prospect Code</TableCell>
                <TableCell align="center">Disb Date</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {
              dispHistory?.disbursement_details?.map((row, i) => (
                <TableRow key={i}>
                  <TableCell scope="row" component="th">{row.PROSPECTCODE}</TableCell>
                  <TableCell align="center">{row.DISBDATE}</TableCell>
                  <TableCell align="right"><Currency value={row.LOANAMOUNT} /></TableCell>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        ) : <Paper style={{ padding: 10 }}>No disbursement made</Paper> 
      }
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.disbursed
});

export default connect(mapStateToProps)(DispApprovedDataTable);