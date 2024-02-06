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
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const CreditNewRequestTable = ({ currentUser }) => {
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [filterQry, setFilterQry] = useState();
  const [offset, setOffset] = useState(0);
  const columnHelper = createColumnHelper();
  usePageTitle('Credit Reload');
  const { data: tableData = [], refetch } = useQuery(['new-request', offset], () => getCreditReload({ processed: 0, filterQry: filterQry, currentUser: currentUser?.dealership_id, offset: offset }), { refetchOnWindowFocus: false })
  const view = permissionCheck(currentUser.role_name, rulesList.dealer_view)

  const DisplayValue = ({ value, row }) => {
    const handleClick = () => {
      let d = [];
      d.push({
        ...row,
        payment_proof_attachment: typeof (row?.payment_proof_attachment) === 'string' ? JSON.parse(row?.payment_proof_attachment) : (row?.payment_proof_attachment || [])
      })
      setRowData(d[0])
      setStatusModal(true)
    }
    return (
      <div style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => handleClick()}>{value}</div>
    )
  }

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: ({ row }) => <DisplayValue row={row?.original} value={row?.original?.dealership_id} />
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => <DisplayValue row={row?.original} value={row?.original?.name} />
    }),
    columnHelper.accessor('request_id', {
      header: 'Request Id',
    }),
    columnHelper.accessor('product_name', {
      header: 'Scheme',
    }),
    columnHelper.accessor('created_date', {
      header: 'Requested Date',
    }),
    columnHelper.accessor('region', {
      header: 'Region',
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('account_no', {
      header: 'Account Number',
    }),
    columnHelper.accessor('last_modified_by', {
      header: 'Submitted (or) Modified By',
    }),
    columnHelper.accessor('origin', {
      header: 'Origin',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (value) => {
        if (value?.getValue() === 'Declined') {
          return (
            <div><CustomToken label={value?.getValue()} variant='error' icon='cross' /></div>
          )
        }
        else if (value?.getValue() === 'Disbursed') {
          return (
            <div><CustomToken label={value?.getValue()} variant='success' icon='tick' /></div>
          )
        }
        else return <CustomToken label={value?.getValue()} variant='success' />
      }
    }),
  ]

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
          <DataTableViewer
            title={'New Request'}
            rowData={tableData?.data}
            column={column}
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