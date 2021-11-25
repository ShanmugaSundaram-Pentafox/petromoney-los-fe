import { Drawer } from '@material-ui/core';
import React, { useState } from 'react';
// import FormDialog from '../CommonComponents/FormDialog/FormDialog';
import { useDispatch } from 'react-redux';
import AddNewUserForm from './AddNewUserForm';
import { getAllUsers } from '../../services/users.service';
import { setAllUsers } from '../../store/dashboard/dashboard.actions';
import Button from '../CommonComponents/Button/Button';


const AddNewUserAction = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  // const classes = useStyles()


  const saveUserCallback = () => {
    getAllUsers()
      .then(data => {
        dispatch(setAllUsers(data));
      })
      .catch(e => {
        console.log(e);
      });

    setOpenModal(false);
  }
  const handleClose = () => {
    setOpenModal(false)

  }

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpenModal(true)}
      >
        Create New User
      </Button>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <AddNewUserForm callback={saveUserCallback} action={() => handleClose()} />
      </Drawer>
      {/* <FormDialog
        title="New User Form"
        open={openModal}
        onClose={() => setOpenModal(false)}
      > */}
      {/* </FormDialog> */}
    </div>
  )
}

export default AddNewUserAction;