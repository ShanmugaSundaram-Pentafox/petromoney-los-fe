import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GridTextField from './GridTextField';

const useStyles = makeStyles(theme => ({
  root: {
    width: '60%',
    padding: theme.spacing(3)
  }
}));

const fields = [
  { key: "loan_os", label: "Loan O/S" },
  { key: "networth", label: "Networth" },
  { key: "it_paid", label: "IT Paid" },
  { key: "net_profit", label: "Net Profit" },
  { key: "net_profit_percentage", label: "Net Profit %" },
  { key: "turnover", label: "Turnover" }
];

const FinanceInfo = ({
  data,
  onChange
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          {
            fields.map(row => (
              <GridTextField
                key={row.key}
                field={row.key}
                label={row.label}
                value={data[row.key]}
                onChange={onChange}
                />
            ))
          }
        </Grid>
      </form>
    </Paper>
  )
}

export default FinanceInfo;