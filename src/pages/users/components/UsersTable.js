import React, { useEffect, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom';
import { action_id, resources_id } from '../../../config/accessControl';
import { isAllowed } from '../../../utils/cerbos';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { Paper, Tooltip } from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';
import AddNewUserAction from '../../../components/AddNewUser/AddNewUserAction';
import { useDebouncedState } from '@mantine/hooks';
import { useQuery } from 'react-query';
import { getUsersData } from '../../../services/users.service';
import usePageTitle from '../../../hooks/usePageTitle';

const UsersTable = ({ title, withRole, currentUser, refetchQuery, apiFilter, setApiFilter }) => {
  usePageTitle('Users');
  const [page, setPage] = useState(1)
  const [search, setSearch] = useDebouncedState('', 500);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [dateObj, setDateObj] = useState({ from: new Date(), to: new Date() });
  const apiFilterHeader = [
    {name:'role_id', label: 'Role', apiUrl: 'user/roles', data: null, type: 'select',},
    {name:'status', label: 'Status', apiUrl: null, data: [{label: 'Active', value: '1'},{label: 'Inactive', value: '0'}], type: 'select'}
  ];
  const { data: usersData = [], isFetching } = useQuery(['users-data', search, dateObj, page, apiFilter], () => getUsersData({ search, dateObj, page, apiFilter }), {
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    page != 1 && setPage(1)
  }, [search,dateObj])

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
        useAPIPagination
        title={title}
        totalNoOfRecords={usersData?.total_records}
        rowData={usersData?.data}
        loading={isFetching}
        page={page}
        setPage={setPage}
        apiFilter={apiFilter}
        setApiFilter={setApiFilter}
        apiFilterHeader={apiFilterHeader}
        totalNoOfPages={usersData?.total_pages}
        apiSearch={setSearch}
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
          <AddNewUserAction currentUser={currentUser} refetchQuery={usersData?.refetch} />
        }
      />
    </Paper>
  )
}

export default UsersTable
