import { Button } from '@mantine/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AddNewUserForm from './AddNewUserForm';
import { action_id, resources_id } from '../../config/accessControl';
import CheckAllowed from '../../pages/rbac/CheckAllowed';
import { getAllUsers } from '../../services/users.service';
import { setAllUsers } from '../../store/dashboard/dashboard.actions';
import { RightSideDrawer } from '../Mantine/RightSideDrawer/RightSideDrawer';


const AddNewUserAction = ({ currentUser }) => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const saveUserCallback = () => {
    getAllUsers()
      .then(data => {
        dispatch(setAllUsers(data));
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e);
      });

    setOpenModal(false);
  }
  const handleClose = () => {
    setOpenModal(false)

  }

  return (
    <div>
      <CheckAllowed currentUser={currentUser} resource={resources_id?.users} action={action_id?.users.userCreate}>
        <Button
          color={'blue'}
          onClick={() => setOpenModal(true)}
          size={'xs'}
        >
          Create New User
        </Button>
      </CheckAllowed>

      <RightSideDrawer
        opened={openModal}
        size="lg"
        onClose={() => setOpenModal(false)}
        title="Add New User Form"
      >
        <AddNewUserForm
          callback={saveUserCallback}
          action={() => handleClose()}
        />
      </RightSideDrawer>
    </div>
  )
}

export default AddNewUserAction;