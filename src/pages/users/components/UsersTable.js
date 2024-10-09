import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom';
import { action_id, resources_id } from '../../../config/accessControl';
import { isAllowed } from '../../../utils/cerbos';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { Paper, Tooltip } from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';
import AddNewUserAction from '../../../components/AddNewUser/AddNewUserAction';
import { downloadUserData } from '../../../services/users.service';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { getSignedUrl } from '../../../services/common.service';
import { useQuery } from 'react-query';

const UsersTable = ({ title, data, withRole, currentUser, loading, refetchQuery }) => {
  const usersDownloadQuery = useQuery({
    queryKey: 'user-download',
    queryFn: () => downloadUserData(),
    onSuccess: (res) => {
      getSignedUrl(res?.data)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          displayNotification({ message: e, variant: 'error' });
        })
    },
    onError: (e) => {
      displayNotification({ message: e, variant: 'error' })
    },
    enabled: Boolean(false),
    retry: Boolean(false),
  });

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
        excelDownload
        downloadQuery={{ query: usersDownloadQuery?.refetch, isLoading: usersDownloadQuery?.isFetching }}
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
          <AddNewUserAction currentUser={currentUser} refetchQuery={refetchQuery} />
        }
        title={title}
      />
    </Paper>
  )
}

export default UsersTable
