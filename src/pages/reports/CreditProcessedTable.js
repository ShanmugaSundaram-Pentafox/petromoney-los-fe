import { Button, Grid, Tooltip, Drawer } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import MUIDataTable from 'mui-datatables';
import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useMount } from 'react-use';
import CreditReload, { TableFooter } from './CreditReload';
import CreditReloadForm from './CreditReloadForm';
import CreditReloadRemarks from './CreditReloadRemarks';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import {
  getCreditReload,
  getTypeOfAccount,
} from '../../services/users.service';


const CreditProcessedTable = ({ currentUser }) => {
  const [accountType, setAccountType] = useState();
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [filterQry, setFilterQry] = useState();
  const [offset, setOffset] = useState(0);


  usePageTitle('Credit Reload');
  const view = permissionCheck(currentUser.role_name, rulesList.dealer_view)

  const { data = [], refetch, error } = useQuery(['processed-request', offset], () => getCreditReload(1, filterQry, currentUser?.dealership_id, offset), { refetchOnWindowFocus: false,enabled:false })

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
          filter: false,
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value}</div>
          }
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          filter: false,
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
        name: 'product_name',
        label: 'Product',
      },
      {
        name: 'utr',
        label: 'UTR',
        options: {
          filter: false,
          customBodyRender: (value) => {
            return <div>{value || '-'}</div>
          }
        }
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
        name: 'created_by',
        label: 'Created by'
      },
      {
        name: 'last_modified_by',
        label: 'Processed by',
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
                tableMeta?.rowData[11] ? (
                  <Tooltip title={tableMeta.rowData[11]}>
                    <div><CustomToken label={value} variant='error' icon='cross' /></div>
                  </Tooltip>
                ) : (
                  <CustomToken label={value} variant='error' icon='cross' />
                )
              )
            }
            else if (value === 'Disbursed') {
              return (
                tableMeta?.rowData[11] ? (
                  <Tooltip title={tableMeta.rowData[11]}>
                    <div><CustomToken label={value} variant='success' icon='tick' /></div>
                  </Tooltip>
                ) : (
                  <CustomToken label={value} variant='success' icon='tick' />
                )
              )
            }
            else
              return <CustomToken label={value} variant='warn' />
          }
        }
      },
      { name: 'remarks', options: { display: 'excluded', filter: false } },
      { name: 'role_name', options: { display: 'excluded', filter: false } },
      { name: 'is_withheld', options: { display: 'excluded', filter: false } }
    ];
  }, [data?.data]);
  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    filter: false,
    download: false,
    search: false,
    viewColumns: false,
    rowsPerPageOptions: [15, 20, 30],
    setRowProps: (row, dataIndex) => {
      if (row[13]) {
        return { style: { backgroundColor: '#ffec9bba' } }
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
          ...data?.data[cellMeta.dataIndex],
          payment_proof_attachment: typeof (data?.data[cellMeta.dataIndex]?.payment_proof_attachment) === 'string' ? JSON.parse(data?.data[cellMeta.dataIndex]?.payment_proof_attachment) : (data?.data[cellMeta.dataIndex]?.payment_proof_attachment || [])
        })
        setRowData(d[0])
        setStatusModal(true)
      }
    },
  };
  return (
    <div>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant='rect' width='100%' height={400} />
        </Grid>
      ) : (
        <>
          <CreditReload currentUser={currentUser} filterQry={setFilterQry} refetch={refetch} filterList={[]} filterType={'processed'} />
          <MUIDataTable
            title={'Processed'}
            columns={columns}
            options={options}
            data={error ? []:data?.data}
            components={{
              TableFooter: () => <TableFooter offset={offset} handleIncrease={() => setOffset(offset + 1)} handleDecrease={() => setOffset(offset - 1)} />
            }}
          />
        </>
      )}
      <Drawer
        anchor='right'
        open={statusModal}
        onClose={() => setStatusModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser} />
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
export default CreditProcessedTable;