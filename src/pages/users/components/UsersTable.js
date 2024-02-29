import React, { useMemo, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom';
import RightDrawer from './RightDrawer'
import { action_id, resources_id } from '../../../config/accessControl';
import { isAllowed } from '../../../utils/cerbos';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { Paper, Tooltip } from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';

const UsersTable = ({ title, data, withRole, currentUser, loading }) => {
  const [rowData, setRowData] = useState({});
  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('id', {
      header: 'User Id',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('first_name', {
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()}</span>
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile Number',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('role_name', {
      header: 'Role',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.replace(/_/g, ' ') : '-'}</span>
    }),
  ]

  const actionColumn = [
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (value) => {
        if (value?.getValue() === 'Active') {
          return (
            <Tooltip label='Active' color='gray' withArrow>
              <IconCheck color={'green'} size={16} />
            </Tooltip>
          )
        } else {
          return (
            <Tooltip label='Inactive' color='gray' withArrow>
              <IconX color={'tomato'} size={16} />
            </Tooltip>
          )
        }
      }
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <RouterLink to={{
            pathname: `/user/${row?.original?.id}`,
            params: row?.original
          }}>
            <div key={`vi-${row?.original?.id}`} style={{ cursor: 'pointer' }}>
              <IconEdit color={'gray'} size={16} />
            </div>
          </RouterLink>
        )
      }
    }),
  ]
  return (
    <Paper>
      <DataTableViewer
        rowData={data}
        loading={loading}
        column={
          withRole ?
            [
              ...column,
              columnHelper.accessor('role_name', {
                header: 'Role',
              })
            ] :
            isAllowed(currentUser?.permissions, resources_id.users, action_id?.users.userStatus) ?
              [
                ...column,
                ...actionColumn
              ] :
              column
        }
        title={title}
      />
    </Paper>
  )
}

export default UsersTable
