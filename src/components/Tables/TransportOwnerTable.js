import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import { getOwnersById } from '../../services/transports.service';
import { useQuery } from 'react-query';


const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));


const TransportOwnerTable = ({ id, onRowClick }) => {
  const classes = useStyles();
  const { data: ownerData = [], isLoading } = useQuery(['owner-info', id], () => getOwnersById(id))
  // useMount(() => {
  //     if (!ownerData || !ownerData.length) {
  //         setLoading(true);
  //         getOwnersById(id)
  //             .then(data => {
  //                 setOwnerData(data);
  //                 setLoading(false);
  //             })
  //             .catch(e => {
  //                 setLoading(false);
  //             })
  //     }
  // });
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
          filterWidth: "100%",
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
    selectableRowsHeader: false,
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
      {
        Array.isArray(ownerData) && ownerData.length ? (

          <MUIDataTable
            // title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} </Typography> : null}
            data={ownerData}
            columns={columns}
            options={options}
          />
        ) : (
          !isLoading && <Paper style={{ padding: 10 }}>No Owners found</Paper>
        )
      }
      {
        isLoading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}


export default TransportOwnerTable;