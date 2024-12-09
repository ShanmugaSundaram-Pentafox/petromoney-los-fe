import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from 'mui-datatables';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import { getOwnersById } from '../../services/transports.service';
import { Box, Image, Text } from '@mantine/core';

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
          <Box
            mt="md"
            p="xl"
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 10,
              height: '60vh',
            }}
          >
            <Image
              src="https://i.imgur.com/A6KRQAV.png"
              w={150}
              h={100}
              radius="md"
            />
            <Box>
              <Text>No data yet!</Text>
              <Text size="sm" sx={{ color: 'rgb(0,0,0,0.4)' }}>
                No data found in this section
              </Text>
            </Box>
          </Box>
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