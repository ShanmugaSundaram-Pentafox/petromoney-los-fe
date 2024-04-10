import moment from 'moment/moment';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Paper } from '@mantine/core';

const SettledListTable = ({ loans, loading }) => {

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Dealership Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'loan_disbursed_date',
      header: 'Disbursed Date',
      cell: (value) => <span>{moment(value?.getValue()).format('DD/MM/YYYY')}</span>
    }, {
      key: 'created_by',
      header: 'Created By',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'referred_dealership_id',
      header: 'Referred By ID',
    }, {
      key: 'referred_dealership_name',
      header: 'Referred By Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'amount',
      header: 'Bonus Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    },
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
    <Paper>
      <DataTableViewer
        rowData={loans}
        filter={false}
        column={column}
        loading={loading}
        title={'Settled'}
        excelDownload
      />
    </Paper>
  )
}

export default SettledListTable