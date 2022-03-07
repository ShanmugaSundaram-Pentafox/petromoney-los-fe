import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react'

const ProcessedCallRequest = ({callbackProcessed}) => {

  const columns = useMemo(() => {
    return [
      {
        name: 'dealer_id',
        label: 'Cust Code',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value}</div>
          }
        }
      },
      {
        name: 'dealer_name',
        label: 'Cust Name',
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div>{value?.toUpperCase()} {tableMeta.rowData[2]?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'region_value',
        label: 'Region',
        options: { filter: false }
      },
      {
        name: 'mobile',
        label: 'Mobile',
        options: { filter: false }
      },
      {
        name: 'remarks',
        label: 'Remarks',
        options: { filter: false }
      },
      {
        name: 'created_date',
        label: 'Requested On',
        options: { filter: false }
      },
      {
        name: 'processed_date',
        label: 'Processed On',
        options: { filter: false }
      },
      {
        name: 'processed_by',
        label: 'Processed By',
        options: { filter: false }
      },
    ];
  });

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  return (
    <div>
      <MUIDataTable
        title={'Processed'}
        columns={columns}
        options={options}
        data={callbackProcessed}
      />
    </div>
  )
}

export default ProcessedCallRequest
