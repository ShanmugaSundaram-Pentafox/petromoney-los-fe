import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import Currency from '../../components/Number/Currency';
import { getTestReport } from '../../services/users.service';


const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: 20
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
  style: {
    '&.MuiPaper-root': {
      backgroundColor: '#ffe2e2',
      border: '2px solid #ffb7b7'
    },
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: '#ffb7b7'
    }
  }
}));
const OverDueTable = ({ id, onRowClick, style }) => {

  const classes = useStyles();
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false);
  useMount(async () => {
    getTestReport(id)
      .then((data) => {
        setLoans(data.overdue)
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  })
  const columns = useMemo(() => {
    return [
      { name: 'prospectcode', label: 'Loan ID' },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        },
        customBodyRender: value => {
          return <div>
            {value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}
          </div>
        }
      },
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
    isRowSelectable: () => true,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(loans[dataIndex].dealership_id, loans[dataIndex])
    },
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 20, 25,   30],
  };
  return (
    <div className={classes.root}>
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : Array.isArray(loans) ? (
          <MUIDataTable
            title={'Overdue Reports'}
            data={loans}
            columns={columns}
            options={options}
            style={style}
            className={style === 'red' && classes.style}
          />
        ) : <Paper style={{ marginTop: 10, padding: 10 }}>No overdue Reports found</Paper>
      }
    </div>
  )
}

export default OverDueTable;