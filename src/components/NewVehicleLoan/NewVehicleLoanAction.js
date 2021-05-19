import React, { useState } from 'react';
import FormDialog from '../CommonComponents/FormDialog/FormDialog';
import NewVehicleLoanForm from './NewVehicleLoanForm';
import Button from '../CommonComponents/Button/Button';

const NewVehicleLoanAction = ({ vehicleId, callback, currentUser }) => {
  const [openModal, setOpenModal] = useState(false);
  
  const onSaveCallback = () => {
    callback();
    setOpenModal(false);
  }
  
  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpenModal(true)}
      >
        Reqeust Loan/Service
      </Button>

      <FormDialog
        title="Request New Loan/Service"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <NewVehicleLoanForm vehicleId={vehicleId} currentUser={currentUser} callback={onSaveCallback} />
      </FormDialog>
    </div>
  )
}

export default NewVehicleLoanAction;