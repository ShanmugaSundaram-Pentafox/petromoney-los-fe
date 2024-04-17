import { Button } from '@mantine/core';
import React, { useState } from 'react';
import AddNewUserForm from './AddNewUserForm';
import { action_id, resources_id } from '../../config/accessControl';
import CheckAllowed from '../../pages/rbac/CheckAllowed';
import { RightSideDrawer } from '../Mantine/RightSideDrawer/RightSideDrawer';


const AddNewUserAction = ({ currentUser, refetchQuery }) => {
  const [openModal, setOpenModal] = useState(false);

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
          callback={refetchQuery}
          action={() => handleClose()}
        />
      </RightSideDrawer>
    </div>
  )
}

export default AddNewUserAction;