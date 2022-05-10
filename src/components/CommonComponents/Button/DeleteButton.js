import { Button, Dialog, DialogContent, DialogContentText, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import React from 'react'

const useStyles = makeStyles(theme => ({
  redBtn: {
    color: 'rgb(255,59,48)',
    borderColor: 'rgb(255,59,48)',
    marginLeft: 6
  },
  redBtnIcon: {
    marginLeft: 6,
    '&:hover': {
      color: 'rgb(255,59,48)'
    }
  },
}))

const DeleteButton = ({style, label='Delete', alertText='Do you really want to delete?', deleteAction, deleteModal, setDeleteModal, id, buttonType='button', autoHide=false, ...props}) => {
  const classes = useStyles();
  return (
    <>
      {
        buttonType === 'button' &&
          <Button variant='outlined' size='small' style={style} className={classes.redBtn} onClick={() => setDeleteModal(id ? {id:id} : true)} {...props}>{label}</Button>
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
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          <div style={{textAlign: 'center', marginBottom: 16}}>
            <InfoCircleOutlined style={{fontSize: 48, color: 'rgb(255,59,48)', margin: 16, marginBottom: 20}} />
            <Typography variant='h3'>Are you sure?</Typography>
          </div>
          <DialogContentText style={{textAlign: 'center'}}>{alertText}</DialogContentText>
        </DialogContent>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 19}}>
          <Button size='medium' variant='outlined' onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant='contained' size='medium' style={{backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 16}} onClick={deleteAction}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteButton