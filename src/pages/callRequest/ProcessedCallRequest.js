import { createColumnHelper } from '@tanstack/react-table';
import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react'
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const ProcessedCallRequest = ({ callbackProcessed, isLoading }) => {

  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('dealer_id', {
      header: 'Customer Code',
      cell: (value) => <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.getValue()}</div>
    }),
    columnHelper.accessor('dealer_name', {
      header: 'Cust Name / Request',
      cell: (value) => <div>{value?.getValue()?.toUpperCase()}</div>
    }),
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.getValue()}</div>
    }),
    columnHelper.accessor('dealership_name', {
      header: 'Dealership Name',
    }),
    columnHelper.accessor('region_value', {
      header: 'Region',
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile',
    }),
    columnHelper.accessor('created_date', {
      header: 'Requested On',
    }),
    columnHelper.accessor('processed_by', {
      header: 'Processed By',
    }),
  ]

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  return (
    <div>
      <DataTableViewer
        rowData={callbackProcessed}
        column={column}
        filter={false}
        title={'Processed'}
        loading={isLoading}
      />
    </div>
  )
}

export default ProcessedCallRequest
