import { Drawer, Tooltip } from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles'
import MUIDataTable from 'mui-datatables'
import React, { useMemo, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom';
import RightDrawer from './RightDrawer'
import { action_id, resources_id } from '../../../config/accessControl';
import { isAllowed } from '../../../utils/cerbos';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },

  button: {
    backgroundColor: '#CE2029',
    color: 'white',
    '&hover': {
      color: 'black',
    }
  },
  head: {
    fontSize: '24px',
    fontWeight: 700,
  },
  text: {
    fontWeight: 700,
  },
}))
const UsersTable = ({ title, data, withRole, currentUser }) => {
  const classes = useStyles()
  const [rowData, setRowData] = useState({});
  const [openModal, setOpenModal] = useState(false)
  const columnHelper = createColumnHelper();

  const column = [
    columnHelper.accessor('id', {
      header: 'User Id',
    }),
    columnHelper.accessor('first_name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile Number',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('role_name', {
      header: 'Role',
    }),
  ]

  const actionColumn = [
    columnHelper.accessor('action', {
      header: 'Status',
      cell: ({ row }) => {
        return (
          <div key={`vi-${row?.original?.status}`}>
            {
              row?.original?.status === 'Active' ? (
                <Tooltip title='Active'>
                  <CheckCircleTwoToneIcon style={{ color: green[200] }} />
                </Tooltip>
              ) : (
                <Tooltip title='Inactive'>
                  <CheckCircleTwoToneIcon style={{ color: grey[500] }} />
                </Tooltip>
              )
            }
          </div>
        )
      }
    }),
    columnHelper.accessor('action', {
      header: 'Profile',
      cell: ({ row }) => {
        return (
          <RouterLink to={{
            pathname: `/user/${row?.original?.id}`,
            params: row?.original
          }}>
            <div key={`vi-${row?.original?.id}`} style={{ cursor: 'pointer' }}>
              <EditIcon fontSize='small' style={{ color: grey[500] }} />
            </div>
          </RouterLink>
        )
      }
    }),
  ]

  //   const actionColumnData = [{
  //   {
  //     label: 'Profile',
  //     name: 'id',
  //     options: {
  //       filter: true,
  //       sort: true,
  //       setCellProps: () => ({
  //         style: { minWidth: '10px', maxWidth: '10px' },
  //         align: 'center',
  //       }),
  //       customBodyRender: (value, r) => {
  //         return (
  //           <RouterLink to={{
  //             pathname: `/user/${value}`,
  //             params: data[r.rowIndex]
  //           }}>
  //             <div key={`vi-${value}`} style={{ cursor: 'pointer' }}>
  //               <EditIcon fontSize='small' style={{ color: grey[500] }} />
  //             </div>
  //           </RouterLink>
  //         )
  //       }
  //     },
  //   }
  //   ]
  //   return withRole ? [
  //     ...d,
  //     {
  //       label: 'Role',
  //       name: 'role_name',
  //       options: {
  //         filter: true,
  //         sort: true,
  //       },
  //     }
  //   ] :
  //     isAllowed(currentUser?.permissions, resources_id.users, action_id?.users.userStatus) ?
  //       [...d, ...actionColumnData] : [...d]
  // }, [withRole])

  const options = {
    filter: true,
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 10,
    isRowSelectable: () => false,
    // onRowClick: (rowData, { dataIndex }) => {
    //   isAllowed(currentUser?.permissions, resources_id.users, action_id?.users.userEdit) &&
    //     onRowClick(data[dataIndex].dealership_id, data[dataIndex])
    // }
  }
  return (
    <div>
      {Array.isArray(data) && data.length ? (
        // <MUIDataTable
        //   title={
        //     <Typography className={classes.title} variant="h4" component="h4">
        //       {title}
        //     </Typography>
        //   }
        //   data={data}
        //   columns={columns}
        //   options={options}
        // />
        <DataTableViewer
          rowData={data}
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
      ) : null}
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <RightDrawer key={rowData.id} userId={rowData.id} currentUser={currentUser} callback={() => setOpenModal(false)} data={rowData} />
      </Drawer>

    </div>
  )
}

export default UsersTable
