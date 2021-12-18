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

const OverDueTable = () => {
  const classes = useStyles();
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)

  useMount(async () => {
    setLoading(true)
    getReport()
      .then((data) => {
        setLoading(false);
        setLoans(data.overdue)
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  })
  usePageTitle('Report')
  const columns = useMemo(() => {
    return [
      { name: 'applicant_code', label: 'Applicant Code' },
      {
        name: 'prospectcode',
        label: 'Prospect Code',
        options: {
          filter: false,
          display: false
        }
      },
      { name: 'applicant_name', label: 'Applicant Name' },
      {
        name: 'omc',
        label: 'OMC',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'disb_amt',
        label: 'Disbursed Amount',
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
        name: 'prin_overdue',
        label: 'Print Due',
        options: {
          filter: false,
          display: false
        }
      },
      { name: 'cust_code', label: 'Customer Code' },
      { name: 'cust_region', label: 'Customer Region' },
      {
        name: 'penal_overdue',
        label: 'Penal Overdue',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'int_overdue',
        label: 'Int Overdue',
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
            title={'Loan Overdue Reports'}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No overdue Reports found</Paper>
      }
    </div>
  )
}

export default OverDueTable