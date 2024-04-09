import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import { getOwnersById } from '../../services/transports.service';

const TransportOwnerTable = ({ id, onRowClick }) => {
  const { data: ownerData = [], isLoading } = useQuery(['owner-info', id], () => getOwnersById(id), {refetchOnWindowFocus: false})

  const columns = useMemo(() => { 
    return [
      {
        label: 'Owner Id',
        name: 't_owner_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/owners/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Name',
        name: 'first_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Mobile',
        name: 'mobile',
        options: {
          filter: true,
          filterWidth: '100%',
          sort: true,
          customBodyRender: value => {
            return (
              <div>
                {value ? value : '-'}
              </div>
            )
          }
        }
      },
    ]
  }, [ownerData]);

  const options = {
    selectableRows: 'none',
    print: false,
    filter: false,
    search: false,
    download: false,
    viewColumns: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
    selectableRowsHeader: false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(ownerData[dataIndex].dealership_id, ownerData[dataIndex])
    },

  };

  return (
    <div >
      {Array.isArray(ownerData) && ownerData.length ? (
        <MUIDataTable
          data={ownerData}
          columns={columns}
          options={options}
        />
      ) : (
        !isLoading && (
          <Paper className="min-h-32 flex items-center justify-center">
            No Owners found
          </Paper>
        )
      )}

      {isLoading && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}
    </div>
  )
}

export default TransportOwnerTable;