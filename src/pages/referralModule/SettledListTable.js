import { CircularProgress, Paper, Typography, makeStyles } from '@material-ui/core';
import moment from 'moment/moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
}));
const SettledListTable = ({ loans, loading }) => {

  const classes = useStyles();
  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('dealership_name', {
      header: 'Dealership Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('loan_disbursed_date', {
      header: 'Disbursed Date',
      cell: (value) => <span>{moment(value?.getValue()).format('DD/MM/YYYY')}</span>
    }),
    columnHelper.accessor('created_by', {
      header: 'Created By',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('referred_dealership_id', {
      header: 'Referred By ID',
    }),
    columnHelper.accessor('referred_dealership_name', {
      header: 'Referred By Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('amount', {
      header: 'Bonus Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }),
  ]

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
        <DataTableViewer
          rowData={loans}
          column={column}
          title={'Settled'}
        />
        : (!loading && <Paper style={{ padding: 10 }}>No Records found</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

export default SettledListTable