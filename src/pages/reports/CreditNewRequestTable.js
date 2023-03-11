import { Button, Grid, Tooltip, Drawer } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import MUIDataTable from 'mui-datatables';
import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import CreditReload from './CreditReload';
import CreditReloadForm from './CreditReloadForm';
import CreditReloadRemarks from './CreditReloadRemarks';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../config/accessControl';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import {
  getCreditReload,
} from '../../services/users.service';
import { isAllowed } from '../../utils/cerbos';

const CreditNewRequestTable = ({ currentUser }) => {
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [filterQry, setFilterQry] = useState();
  const [offset, setOffset] = useState(0);
  usePageTitle('Credit Reload');
  const { data: tableData = [], refetch } = useQuery(['new-request', offset], () => getCreditReload({ processed: 0, filterQry: filterQry, currentUser: currentUser?.dealership_id, offset: offset }), { refetchOnWindowFocus: false })
  const view = permissionCheck(currentUser.role_name, rulesList.dealer_view)


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
        name: 'last_modified_by',
        label: 'Submitted or Modified by',
        options: {
          filter: false,
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
          filter: false,
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
            else if (tableMeta?.rowData[13])
              return <CustomToken label="Withheld" variant='warn' />
            else return <CustomToken label={value} variant='success' />
          },
        }
      },
      { name: 'remarks', options: { display: 'excluded', filter: false } },
      { name: 'role_name', options: { display: 'excluded', filter: false } },
      { name: 'is_withheld', options: { display: 'excluded', filter: false } }
    ];
  }, [tableData?.data]);
  const options = {
    print: false,
    selectableRowsHeader: false,
    viewColumns: false,
    selectableRows: 'none',
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 20, 25, 30],
    setRowProps: (row, dataIndex) => {
      if (row[12]) {
        return { style: { backgroundColor: '#ffec9bba' } }
      }
    },
    customToolbar: () => {
      return (
        // Credit Reload create action
        isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.create) ?
          <Button
            color='primary'
            variant='contained'
            onClick={() => setOpenModal(true)}
          >
            Add
          </Button> : null
      )
    },
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex === 0 || cellMeta.colIndex === 1) {
        let d = [];
        d.push({
          ...tableData?.data[cellMeta.dataIndex],
          payment_proof_attachment: typeof (tableData?.data[cellMeta.dataIndex]?.payment_proof_attachment) === 'string' ? JSON.parse(tableData?.data[cellMeta.dataIndex]?.payment_proof_attachment) : (tableData?.data[cellMeta.dataIndex]?.payment_proof_attachment || [])
        })
        setRowData(d[0])
        setStatusModal(true)
      }
    },
  };
  return (
    <div style={{ marginTop: 20 }}>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant='rect' width='100%' height={400} />
        </Grid>
      ) : (
        <>
          <CreditReload refetch={refetch} currentUser={currentUser} filterQry={setFilterQry} filterList={['zone', 'region', 'product', 'period']} filterType={'new'} stats={tableData?.stats} />
          <MUIDataTable
            title={'New Request'}
            columns={columns}
            options={options}
            data={tableData?.data}
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
          <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser} view={view} />
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
            currentUser={currentUser}
            view={view}
          />
        }
      </Drawer>
    </div>
  )
}
export default CreditNewRequestTable;