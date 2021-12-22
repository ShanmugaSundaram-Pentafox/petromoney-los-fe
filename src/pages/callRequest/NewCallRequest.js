import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react'
import usePageTitle from '../../hooks/usePageTitle';


const NewCallRequest = () => {
  // const classes = useStyles()
  usePageTitle('Call Request');

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
        name: 'name',
        label: 'Cust Name',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'region',
        label: 'Region',
        options: { filter: false }
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
        // data={data}
      />
    </div>
  )
}

export default NewCallRequest
