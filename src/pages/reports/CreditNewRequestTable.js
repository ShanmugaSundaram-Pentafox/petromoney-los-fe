import { Button, Grid, Tooltip, Drawer  } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { classes } from 'istanbul-lib-coverage';
import MUIDataTable from 'mui-datatables';
import React, { useState, useMemo } from 'react';
import { useMount } from 'react-use';
import CreditReloadForm from './CreditReloadForm';
import CreditReloadRemarks from './CreditReloadRemarks';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import {
  getTypeOfAccount,
} from '../../services/users.service';

const CreditNewRequestTable = ({ data, currentUser, view }) => {
  const [accountType, setAccountType] = useState();
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  usePageTitle('Credit Reload');

  useMount(() => {
    getTypeOfAccount()
      .then((data) => {
        setLoading(false);
        setAccountType(
          data.map(({ id, type_of_account }) => ({
            label: type_of_account,
            id: id,
          }))
        );
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      })
  });
  const columns = useMemo(() => {
    return [
      {
        name: 'dealership_id',
        label: 'Dealership ID',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value}</div>
          }
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'request_id',
        label: 'Request ID',
        options: { filter: false }
      },
      {
        name: 'created_date',
        label: 'Requested Date',
        options: { filter: false }
      },
      {
        name: 'region',
        label: 'Region',
        options: { filter: false }
      },
      {
        name: 'amount', label: 'Amount',
        options: {
          filter: false,
          customBodyRender: (value) => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'type_of_account',
        label: 'Account Type'
      },
      {
        name: 'last_modified_by',
        label: 'Submitted or Modified by',
        options: {
          customBodyRender: (value, tableMeta) => {
            return <div>{value}</div>
          }
        }
      },
      {
        name: 'origin',
        label: 'Origin',
        options: {
          customBodyRender: (value, tableMeta) => {
            return <div>{value?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          customBodyRender: (value, tableMeta) => {
            if (value === 'Declined') {
              return (
                <Tooltip title={tableMeta.rowData[7]}>
                  <div><CustomToken label={value} variant='error' icon='cross' /></div>
                </Tooltip>
              )
            }
            else if (value === 'Disbursed') {
              return (
                <Tooltip title={tableMeta.rowData[7]}>
                  <div><CustomToken label={value} variant='success' icon='tick' /></div>
                </Tooltip>
              )
            }
            else if(tableMeta?.rowData[11])
              return <CustomToken label="Withheld" variant='warn' />
            else return <CustomToken label={value} variant='success' /> 
          },
          filter: false
        }
      },
      { name: 'remarks', options: { display: 'excluded', filter: false }},
      { name: 'role_name', options: { display: 'excluded', filter: false }},
      { name: 'is_withheld', options: { display: 'excluded', filter: false}}
    ];
  }, [data]);
  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
    setRowProps: (row, dataIndex) => {
      if(row[12]){
        return{ style: {backgroundColor: '#ffec9bba'}}
      }
    },
    customToolbar: () => {
      return (
        <Button
          color='primary'
          variant='contained'
          onClick={() => setOpenModal(true)}
        >
          Add
        </Button>
      );
    },
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex === 0 || cellMeta.colIndex === 1) {
        let d = [];
        d.push({
          ...data[cellMeta.dataIndex],
          payment_proof_attachment: typeof (data[cellMeta.dataIndex]?.payment_proof_attachment) === 'string' ? JSON.parse(data[cellMeta.dataIndex]?.payment_proof_attachment) : (data[cellMeta.dataIndex]?.payment_proof_attachment || [])
        })
        setRowData(d[0])
        setStatusModal(true)
      }
    },
  };
  return (
    <div className={classes.root}>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant='rect' width='100%' height={400} />
        </Grid>
      ) : (
        <MUIDataTable
          title={'New Request'}
          columns={columns}
          options={options}
          data={data}
        />
      )}
      <Drawer
        anchor='right'
        open={statusModal}
        onClose={() => setStatusModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser} view={view}/>
        }
      </Drawer>
      <Drawer
        anchor='right'
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadForm
            callback={() => setOpenModal(false)}
            data={accountType}
            currentUser={currentUser}
            view={view}
          />
        }
      </Drawer>
    </div>
  )
}
export default CreditNewRequestTable;