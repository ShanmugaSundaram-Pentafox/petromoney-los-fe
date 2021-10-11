import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TransportTable from '../transports/components/TransportsTable';
import usePageTitle from '../../hooks/usePageTitle';
import VehiclesLoanTable from './components/VehiclesLoanTable';
import { Drawer } from "@material-ui/core";
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import DealerTransportsTable from './components/DealerTransportsTable';
import AddNewTransportsForm from './components/AddNewTransportsForm';
import { Redirect, Route } from 'react-router';

const TransportsPortal = ({ currentUser }) => {
    console.log(currentUser);
  usePageTitle('Transports');
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({})


  const handleClose = () => {
    setOpenModal(!openModal)
  }
  const showEditForm = (id, rowData, status) => {
    setRowData(rowData)
    setOpenModal(true)

  }

  let cardData = [
    { label: 'ID', value: currentUser?.id },
    { label: 'Name', value: `${currentUser?.first_name} ${currentUser?.last_name}` },
    { label: 'Email', value: currentUser?.email },
    { label: 'Mobile', value: currentUser?.mobile },
  ]
  usePageTitle(cardData)

  const editable = permissionCheck(currentUser.role_name, rulesList.dealer_view)
  return (
    <Grid container spacing={2}>
      {
        currentUser?.transporters ? (
            <>
              <Grid item sm={12} md={9}>
                <TransportTable onRowClick={showEditForm} portal={true} transporterId={currentUser.transporters[0].t_owner_id}/>
              </Grid>
            </>
          ):(
            <Redirect to={`/transports/${currentUser?.id}`} />
        )
      }
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
        >
            <AddNewTransportsForm title= {'Edit Transport Details Form'} currentUser={currentUser} id={rowData.t_owner_id} callback={handleClose} data={rowData} />
        </Drawer>

    </Grid>
  );
}

export default TransportsPortal;