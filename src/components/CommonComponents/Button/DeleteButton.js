import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
  redBtn: {
    color: '#f05454e6',
    borderColor: '#f05454e6',
    marginLeft: 6
  }
}))

const DeleteButton = ({style, label='Delete', alertText='Do you really want to delete?', deleteAction, deleteModal, setDeleteModal, id}) => {
  const classes = useStyles();
  return (
    <>
      <Button variant='outlined' size='small' style={style} className={classes.redBtn} onClick={() => setDeleteModal(id ? {id:id} : true)}>{label}</Button>
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
        <DialogActions>
          <Button size='small' onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant='contained' size='small' style={{backgroundColor: '#f05454e6', color: 'white'}} onClick={deleteAction}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteButton