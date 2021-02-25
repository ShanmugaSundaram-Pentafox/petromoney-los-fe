import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import { useMount } from 'react-use';
import Paper from '@material-ui/core/Paper';
import Currency from '../../components/Number/Currency';
import { getReport } from '../../services/users.service';
import usePageTitle from '../../hooks/usePageTitle';

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

const DisbursedTable = () => {
  const classes = useStyles();

  const [loans , setLoans]= useState([])
  useMount( async () => {
      var a = await getReport()
      setLoans(a.due)
      console.log(a.due)
  })
  usePageTitle('Due Report')
  const columns = useMemo(() => {
    return [
      { name: 'applicant_code', label: 'Applicant Code'  },
      { name: 'applicant_name', label: 'Applicant Name', minWidth: 100 },
      {
        name: 'cust_code',
        label: 'Customer Code',
        minWidth: 170,
        align: 'right', 
      },
      {
        name: 'cust_region',
        label: 'Customer Region',
        minWidth: 170,
        align: 'right', 
      },
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
            return <Currency value={value}/>
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
            return <Currency value={value}/>
          }
        }
      },
    ]
  }, []);

  const options = { 
    selectableRowsHeader: false,
    selectableRows: 'none', 
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={"DUE"}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No Due Loans</Paper> 
      }
    </div>
  )
}

export default DisbursedTable 