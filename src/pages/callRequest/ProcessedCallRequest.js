import React from 'react'
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Paper } from '@mantine/core';

const ProcessedCallRequest = ({ callbackProcessed, isLoading }) => {

  const column = [
    {
      key: 'dealer_id',
      header: 'Customer Code',
      cell: (value) => <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.getValue()}</div>
    }, {
      key: 'dealer_name',
      header: 'Cust Name / Request',
      cell: (value) => <div>{value?.getValue()?.toUpperCase()}</div>
    }, {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.getValue()}</div>
    }, {
      key: 'dealership_name',
      header: 'Dealership Name',
    }, {
      key: 'region_value',
      header: 'Region',
    }, {
      key: 'mobile',
      header: 'Mobile',
    }, {
      key: 'created_date',
      header: 'Requested On',
    }, {
      key: 'processed_by',
      header: 'Processed By',
    },
  ]

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  return (
    <Paper>
      <DataTableViewer
        rowData={callbackProcessed}
        column={column}
        filter={false}
        title={'Processed'}
        loading={isLoading}
      />
    </Paper>
  )
}

export default ProcessedCallRequest
