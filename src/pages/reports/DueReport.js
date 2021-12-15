import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getReport } from '../../services/users.service';

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
  },
  opac: {
    color: 'rgb(0,0,0,0.4)'
  }
}));

const DueTable = () => {
  const classes = useStyles();

  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)

  useMount(async () => {
    setLoading(true)
    getReport()
      .then((data) => {
        setLoading(false);
        setLoans(data.due)
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  })
  usePageTitle('Report')
  const columns = useMemo(() => {
    return [
      {
        name: 'applicant_code',
        label: 'Applicant Code',
        options: {
          filter: false,
        }
      },
      {
        name: 'prospectcode',
        label: 'Prospect Code',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'applicant_name',
        label: 'Applicant Name',
        options: {
          filter: false,
        }
      },
      {
        name: 'omc',
        label: 'OMC',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'disb_date',
        label: 'Disbursed Date',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'prin_due',
        label: 'Print Due',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'cust_code',
        label: 'Dealership ID',
        options: {
          filter: false,
        }
      },
      { name: 'cust_region',label: 'Customer Region' },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'disb_amt',
        label: 'Disburse Amt',
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
      }
    ]
  }, []);
  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30]
  };

  return (
    <div className={classes.root}>
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={'Loan Due Reports'}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No due Reports found</Paper>
      }
    </div>
  )
}

export default DueTable