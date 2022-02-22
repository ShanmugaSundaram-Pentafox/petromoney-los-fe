import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import React from 'react'

const useStyles = makeStyles(theme => ({
  redBtn: {
    color: '#f05454e6',
    borderColor: '#f05454e6',
    marginLeft: 6
  },
  redBtnIcon: {
    marginLeft: 6,
    '&:hover': {
      color: '#f05454e6'
    }
  },
}))

const DeleteButton = ({style, label='Delete', alertText='Do you really want to delete?', deleteAction, deleteModal, setDeleteModal, id, buttonType='button', autoHide=false}) => {
  const classes = useStyles();
  return (
    <>
      {
        buttonType === 'button' &&
          <Button variant='outlined' size='small' style={style} className={classes.redBtn} onClick={() => setDeleteModal(id ? {id:id} : true)}>{label}</Button>
      }
      {
        buttonType === 'icon' &&
          <Tooltip title={label}>
            <IconButton 
              className={classes.redBtnIcon}
              onClick={() => setDeleteModal(id ? {id:id} : true)}
            >
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>
      }
      <Dialog
        open={id ? deleteModal?.id === id : deleteModal}
        onClose={() => setDeleteModal(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>{alertText}</DialogContentText>
        </DialogContent>
        <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center',marginBottom: 15, marginLeft: 20}}>
          <Button variant='contained' size='small' style={{backgroundColor: '#f05454e6', color: 'white'}} onClick={deleteAction}>
            Delete
          </Button>
          <Button size='small' onClick={() => setDeleteModal(false)}>Cancel</Button>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteButton