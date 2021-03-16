import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import { useMount } from 'react-use';
import Paper from '@material-ui/core/Paper';
import Currency from '../../components/Number/Currency';
import { getReport } from '../../services/users.service';
import usePageTitle from '../../hooks/usePageTitle';
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid } from '@material-ui/core';

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

const DueTable = () => {
  const classes = useStyles();

  const [loans, setLoans] = useState([])
  useMount(async () => {
    var a = await getReport()
    setLoans(a.due)
  })
  const columns = useMemo(() => {
    return [
      { name: 'applicant_code', label: 'Applicant Code' },
      { name: 'applicant_name', label: 'Applicant Name' },
      { name: 'cust_code', label: 'Dealership ID' },
      { name: 'cust_region', label: 'Customer Region' },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'disb_amt',
        label: 'disburse Amt',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'tot_due',
        label: 'Total Due',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  if (loans.length === 0) {
    return (
      <div className={classes.root}>
        <Grid item xs={12}>
          <Skeleton variant="rect" width="100%" height={600} />
        </Grid>
      </div>
    )
  }
  else {
    return (
      <div className={classes.root}>
        {(loans.length === 0) ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : (
            Array.isArray(loans) && loans.length ? (
              <MUIDataTable
                title={"Due Reports"}
                data={loans}
                columns={columns}
                options={options}
              />
            ) : <Paper style={{ padding: 10 }}>No Due Loans</Paper>
          )}
      </div>
    )
  }
}

export default DueTable 