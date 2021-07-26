import React, { useMemo, useState } from "react"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography";
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
// import LockIcon from '@material-ui/icons/Lock';
import { Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Tooltip from '@material-ui/core/Tooltip';
import { Drawer } from "@material-ui/core";
import { deleteUser } from '../../../services/users.service';
import { logger } from '../../../config/logger';
import RightDrawer from './RightDrawer'


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
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({});
  const [apiStatus, setApiStatus] = useState({});
  const [userId, setuserId] = useState({});
  const [rowData, setRowData] = useState({});
  const [op, setOp] = React.useState(false);
  const [openModal, setOpenModal] = useState(false)
  const handleClickOpen = (value) => {
    setuserId(value);
  };
  const onRowClick = (id, data) => {
    setRowData(data)
    setOpenModal(true)
  }
  const columns = useMemo(() => {
    const d = [
      {
        label: "User ID",
        name: 'id',
        options: {
          filter: false,
          sort: false,
          // setCellProps: () => ({
          //   align: 'center',
          // })
        }
      },
      {
        label: "Name",
        name: "name",
        options: {
          filter: false,
          sort: true,
          // setCellProps: () => ({
          //   align: 'center',
          // }),
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        },
      },
      {
        label: "Mobile Number",
        name: "mobile",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Email",
        name: "email",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Role",
        name: "role_name",
        options: {
          filter: true,
          sort: true,
        },
      },
    ];
    // const actionColumnData = {
    //   label: "Action",
    //   name: 'id',
    //   options: {
    //     filter: false,
    //     sort: false,
    //     setCellProps: () => ({
    //       align: 'center',
    //       }),
    //       customBodyRender: (value) => {
    //         const d = data.find(item => item.id === value) || {};
    //         return (
    //           <div key={`vi-${value}`}>
    //             <div>
    //               <Button onClick={() => handleClickOpen(value)}>
    //                 <Tooltip title="deactivate" aria-label="add">
    //                   <DeleteOutlinedIcon style={{ width: "20px", color: "#ff6666" }} />
    //                 </Tooltip>
    //               </Button>
    //               {
    //                 d?.id ?
    //                   <RightDrawer key={value} checked={op} userId={value} currentUser={currentUser} data={d} />
    //                   : null
    //               }
    //             </div>
    //           </div>
    //         )
    //       }
    //     }
    // }
    return withRole ? [
      ...d,
      {
        label: "Role",
        name: "role_name",
        options: {
          filter: true,
          sort: true,
        },
      }
    ] : [...d];;
  }, [withRole])

  const options = {
    filter: true,
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    rowsPerPage: 10,
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(data[dataIndex].dealership_id, data[dataIndex])
    }
  }
  return (
    <div>
      {Array.isArray(data) && data.length ? (
        <MUIDataTable
          title={
            <Typography className={classes.title} variant="h4" component="h4">
              {title}
            </Typography>
          }
          data={data}
          columns={columns}
          options={options}
        />
      ) : null}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText className={classes.text}>Are you sure to remove the user..?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" >Cancel</Button>
          <Button onClick={() => deleteUserRecord(userId)} className={classes.button} >yes</Button>
        </DialogActions>
      </Dialog> */}
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <RightDrawer key={rowData.id} userId={rowData.id} currentUser={currentUser} callback={()=>setOpenModal(false)} data={rowData} />
      </Drawer>

    </div>
  )
}

export default UsersTable
