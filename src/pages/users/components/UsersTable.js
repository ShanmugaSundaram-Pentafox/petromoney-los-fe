import React, { useMemo, useState } from "react"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from '@material-ui/core/Tooltip';
import {deleteUser} from '../../../services/users.service';
import { logger } from '../../../config/logger';



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


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const deleteUserRecord = data => {
    setLoading(true);
      deleteUser()
      .then(({ message }) => {
        setLoading(false);
        setApiStatus({ status: 'success', message });
        setTimeout(() => {
          setConfirmDelete({})
        }, 700);
      })
      .catch(e => {
        setLoading(false);
        setApiStatus({ status: 'error', message: e });
        logger(e);
      })
    // deleteLoanDisbursementRecord(id, loanData.id, data)
    //   .then(({ message }) => {
    //     setLoading(false);
    //     setApiStatus({ status: 'success', message });
    //     setTimeout(() => {
    //       setConfirmDelete({})
    //     }, 700);
    //   })
    //   .catch(e => {
    //     setLoading(false);
    //     setApiStatus({ status: 'error', message: e });
    //     logger(e);
    //   })

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
      {
        name: 'Action',
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: () => {
            return (
              <div>
                <div>
                  <Button onClick={handleClickOpen}>
                  <Tooltip title="deactivate" aria-label="add">
                  <DeleteOutlinedIcon style={{ width: "20px", color: "#ff6666" }} />
                  </Tooltip>
                  </Button>
                </div>
              </div>
            )
          }
        }
      }
    ];
    return withRole ? [
      ...d,
      {
        label: "Role",
        name: "role_name",
        options: {
          filter: true,
          sort: true,
        },
      },
    ] : d;
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Are you sure"}</DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.text}>you want to delete the user..?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" >Cancel</Button>
          <Button onClick={() => deleteUserRecord(confirmDelete.data)} className={classes.button} >yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UsersTable
