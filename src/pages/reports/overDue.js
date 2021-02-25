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

const OverDueTable = () => {
  const classes = useStyles();

  const [loans , setLoans]= useState([])
  useMount( async () => {
      var a = await getReport()
      setLoans(a.overdue)
      console.log(a.overdue)
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
        name: 'penal_overdue',
        label: 'Penal Overdue', 
        options: { 
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value}/>
          }
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
            title={"OVER DUE"}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No Disbursed Loans</Paper> 
      }
    </div>
  )
}

export default OverDueTable 