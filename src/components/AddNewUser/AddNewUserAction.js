import React, { useState } from 'react';
import FormDialog from '../CommonComponents/FormDialog/FormDialog';
import AddNewUserForm from './AddNewUserForm';
import Button from '../CommonComponents/Button/Button';
import { getAllUsers } from '../../services/users.service';
import { useDispatch } from 'react-redux';
import { setAllUsers } from '../../store/dashboard/dashboard.actions';

const AddNewUserAction = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

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
  
  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpenModal(true)}
      >
      Create New User
      </Button>

      <FormDialog
        title="New User Form"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <AddNewUserForm callback={saveUserCallback} />
      </FormDialog>
    </div>
  )
}

export default AddNewUserAction;