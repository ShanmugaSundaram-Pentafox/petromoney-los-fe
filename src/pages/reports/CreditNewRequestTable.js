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
import { Button, Drawer, Grid, Skeleton } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/24/solid';

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
      if (tableData?.data?.[dataIndex]?.reload_type === 'express') {
        return { style: { backgroundColor: '#ff21161a' } }
      }
    },
    customToolbar: () => {
      return (
        // Credit Reload create action
        isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.create) ?
          <Button
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
        <Grid>
          <Grid.Col>
            <Skeleton width='100%' height={400} />
          </Grid.Col>
        </Grid>
      ) : (
        <>
          <CreditReload refetch={refetch} currentUser={currentUser} filterQry={setFilterQry} filterList={['zone', 'region', 'product', 'type', 'period']} filterType={'new'} stats={tableData?.stats} />
          <DataTableViewer
            title={'New Request'}
            rowData={tableData?.data}
            column={column}
            action={(isAllowed(currentUser?.permissions, resources_id?.creditReload, action_id?.creditReload?.create) ?
              <Button
                size='xs'
                onClick={() => setOpenModal(true)}
                leftSection={<PlusIcon className='w-4 h-4' />}
              >
                Add
              </Button> : null
            )}
          />
        </>
      )}
      <Drawer
        position='right'
        opened={statusModal}
        onClose={() => setStatusModal(false)}
        styles={{ root: { position: 'absolute', zIndex: 9999 } }}
      >
        {
          <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser} view={view} />
        }
      </Drawer>
      <Drawer
        position='right'
        opened={openModal}
        title={'Credit Reload Form'}
        onClose={() => setOpenModal(false)}
        styles={{ root: { position: 'absolute', zIndex: 9999 } }}
      >
        <CreditReloadForm
          callback={() => setOpenModal(false)}
          currentUser={currentUser}
          opened={openModal}
          view={view}
        />
      </Drawer>
    </div>
  )
}
export default CreditNewRequestTable;