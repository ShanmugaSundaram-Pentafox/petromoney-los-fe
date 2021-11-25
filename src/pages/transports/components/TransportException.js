/* eslint-disable no-use-before-define */

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Skeleton from '@material-ui/lab/Skeleton';
import MUIDataTable from 'mui-datatables'
import React, { useMemo, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom'
import { useMount } from 'react-use';
import TextInput from '../../../components/TextInput/TextInput';
import { URL } from '../../../config/serverUrls';
import usePageTitle from '../../../hooks/usePageTitle';
import { getAllDealership } from '../../../services/dealerships.service';
import { getTransportsExceptions } from '../../../services/loans.service';


const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});
const TransportException = ({ currentUser }) => {
  usePageTitle('Transport Exceptions')
  const classes = useStyles();
  const [exceptions, setExceptions] = useState([]);
  const [dealerData, setDealerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState({});

  useMount(() => {
    setLoading(true)
    getTransportsExceptions()
      .then((data) => {
        setExceptions(data)
      })
      .catch((e) => {
        console.log(e);
        setLoading(false)
      });
    getAllDealership()
      .then((data) => {
        setDealerData(data)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e);
        setLoading(false)

      });
  });
  const mapTransports = (rowData, value) => {
    const data = new FormData();
    Object.keys(rowData).forEach(key => {
      data.append(key, rowData[key]);
    })
    data.append('dealership_id', value.id)
    fetch(`${URL.base}transport/owner/${rowData.t_owner_id} `, {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${currentUser.token} `
      }
    })
      .then(res => {
        console.log('result', res)
      })
      .catch(error => {
        console.log('errr', error)

      })

  }

  const columns = useMemo(() => {

    return [
      {
        label: 'Owner ID',
        name: 't_owner_id',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <div>{value}</div>
          },
          setCellProps: () => ({
            align: 'left',
          }),
        },
      },
      {
        label: 'Code',
        name: 'transporter_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
          },
        },
      },

      {
        label: 'Name',
        name: 'transporter_name',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: 'Mobile Number',
        name: 'mobile',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: 'Action',
        name: 'id',
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: (value) => {
            return (
              <div >
                <Autocomplete
                  size="small"
                  options={dealerData}
                  getOptionLabel={(option) => option.id.toString()}
                  id="Choose dealership id"
                  debug
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <TextInput
                        {...params}
                        variant="standard"
                        placeholder="Choose ID"
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  )}
                  onChange={(event, newValue) => {
                    mapTransports(rowData, newValue)

                  }}
                />
              </div>
            );
          }
        }
      }
    ]
  }, [dealerData, rowData])
  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    print: false,
    viewColumns: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      setRowData(exceptions[dataIndex], exceptions[dataIndex])
    },
  }
  return (
    <Grid item md={9}>
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>) : (
          Array.isArray(exceptions) && exceptions.length && dealerData.length ? (

            <MUIDataTable
              title={
                <div className={classes.button}>
                  <Typography className={classes.title} variant="h5" component="h5">
                    Exceptions List
                  </Typography>
                </div>
              }
              data={exceptions}
              columns={columns}
              options={options}
            />

          ) : <Paper style={{ padding: 10 }}>No Transports Exceptions Found</Paper>)
      }

    </Grid >
  );
}
export default TransportException;