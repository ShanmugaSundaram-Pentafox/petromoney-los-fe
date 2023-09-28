import { CircularProgress, Paper, Typography, makeStyles } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { dateCustomSort } from '../../utils/commonFunctions.util';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
}));
const SettledListTable = ({loans, loading}) => {
  
  const classes = useStyles();
  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership Id',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Dealership Name',
        name: 'name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Referred by Id',
        name: 'referred_dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <>{value}</>
        }
      },
      {
        label: 'Referred by Name',
        name: 'referred_dealership_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Bonus Amount',
        name: 'current_eligible_bonus',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value ? value : '-'} />
        }
      },
    ]
  }, [loans]);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    },
    viewColumns: false,
    print: false,
    filter: false,
  };

  return (
    <div>
      {Array.isArray(loans) && loans.length ?
        <MUIDataTable
          title={<Typography className={classes.title} variant="h4" component="h4">{'Settled'}</Typography>}
          data={loans}
          columns={columns}
          options={options}
        /> : (!loading && <Paper style={{ padding: 10 }}>No Records found</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

export default SettledListTable