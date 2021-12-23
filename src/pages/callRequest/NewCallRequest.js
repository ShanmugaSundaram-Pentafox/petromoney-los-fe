import { Button } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle';


const NewCallRequest = () => {
  // const classes = useStyles()
  usePageTitle('Call Request');
  const [tableData, setTableData] = useState()

  // useMount(() => {
  //   fetch('http://localhost:3333/data')
  //   .then(res => res.json())
  //   .then(setTableData)
  // })


  const columns = useMemo(() => {
    return [
      {
        name: 'dealership_id',
        label: 'Cust Code',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value}</div>
          }
        }
      },
      {
        name: 'f_name',
        label: 'Cust Name',
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div>{value?.toUpperCase()} {tableMeta.rowData[2]?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'l_name',
        options: {
          display: false
        }
      },
      {
        name: 'region',
        label: 'Region',
        options: { filter: false }
      },
      {
        name: 'mobile',
        label: 'Mobile',
        options: { filter: false }
      },
      {
        name: 'call',
        label: 'Action',
        setCellProps: () => ({
          align: 'right',
        }),
        options: { 
          filter: false,
          customBodyRender: () => {
            return <Button variant='outlined' size='small' color='secondary'>Resolve</Button>
          }
        }
      }
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
      {/* // <div className={classes.root}> */}
      <MUIDataTable
        title={'New Request'}
        columns={columns}
        options={options}
        data={tableData}
      />
    </div>
  )
}

export default NewCallRequest
