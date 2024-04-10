import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom';
import { action_id, resources_id } from '../../../config/accessControl';
import { isAllowed } from '../../../utils/cerbos';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { Paper, Tooltip } from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';
import AddNewUserAction from '../../../components/AddNewUser/AddNewUserAction';

const UsersTable = ({ title, data, withRole, currentUser, loading }) => {

  const column = [
    {
      key: 'id',
      header: 'User Id',
      enableColumnFilter: false,
    }, {
      key: 'first_name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'mobile',
      header: 'Mobile Number',
      enableColumnFilter: false,
    }, {
      key: 'email',
      header: 'Email',
      enableColumnFilter: false,
    }, {
      key: 'role_name',
      header: 'Role',
    },
  ]

  const actionColumn = [
    {
      key: 'status',
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
    }, {
      key: 'action',
      header: 'Action',
      enableColumnFilter: false,
      isHeaderDownload: false,
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
    },
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
            ] :
            isAllowed(currentUser?.permissions, resources_id.users, action_id?.users.userStatus) ?
              [
                ...column,
                ...actionColumn
              ] :
              column
        }
        action={
          <AddNewUserAction currentUser={currentUser} />
        }
        title={title}
      />
    </Paper>
  )
}

export default UsersTable
