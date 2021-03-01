import React, { useMemo, useState } from "react"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import LockIcon from '@material-ui/icons/Lock';
import { Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from '@material-ui/core/Tooltip';
import {deleteUser} from '../../../services/users.service';
import { logger } from '../../../config/logger';
import RightDrawer from './RightDrawer'


const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
  button: {
    backgroundColor: '#CE2029',
    color:'white',
    '&hover': {
      color: 'black',
    }
  },
  head: {
    fontSize :'24px',
    fontWeight :700,
  },
  text: {
    fontWeight:700,
  },
}))
const UsersTable = ({ title, data, withRole }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({});
  const [apiStatus, setApiStatus] = useState({});
  const [userId,setuserId] = useState({});

  const [op , setOp ] = React.useState(false);
 

  const handleClickOpen = (value) => {
    setuserId(value);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const deleteUserRecord = (userId) => {
  setOpen(false);
    setLoading(true);
      deleteUser(userId)
      .then(({ message }) => {
        setLoading(false);
        setApiStatus({ status: 'success', message });
        setTimeout(() => {
          setConfirmDelete(userId)
        }, 700);
      })
      .catch(e => {
        setLoading(false);
        setApiStatus({status: 'error', message: e});
        logger(e);
      })

  }
  const columns = useMemo(() => {
    const d = [
      {
        label: "Name",
        name: "name",
        options: {
          filter: false,
          sort: true,
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
      
    ];
    const actionColumnData ={
      label:"Action",
      name: 'id',
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({
          align: 'center',
        }),
        customBodyRender: (value) => {
          return (
            <div>
              <div>
                <Button onClick={() =>handleClickOpen(value)}>
                  <Tooltip title="deactivate" aria-label="add">
                    <DeleteOutlinedIcon style={{ width: "20px", color: "#ff6666" }} />
                  </Tooltip>
                </Button>
                <RightDrawer checked={op} userId={value} data={data.find(item => item.id === value)} />
              </div>
            </div>
          )
        }
      }
    }
    return withRole ? [
      ...d,
      {
        label: "Role",
        name: "role_name",
        options: {
          filter: true,
          sort: true,
        },
      },actionColumnData,
    ] : [...d, actionColumnData];;
  }, [withRole])

  const options = {
    filter: withRole ? true : false,
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    rowsPerPage: 10,
    isRowSelectable: () => false,
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
      <Dialog open={open} onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Are you sure"}</DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.text}>you want to delete the user..?{userId}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" >Cancel</Button>
          <Button onClick={() => deleteUserRecord(userId)} className={classes.button} >yes</Button>
        </DialogActions>
      </Dialog>
       
    </div>
  )
}

export default UsersTable
