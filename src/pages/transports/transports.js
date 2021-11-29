import { Drawer } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import AddNewTransportsForm from './components/AddNewTransportsForm';
import DealerTransportsTable from './components/DealerTransportsTable';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import TransportTable from '../transports/components/TransportsTable';

const Transport = ({ currentUser }) => {
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

  const editable = permissionCheck(currentUser.role_name, rulesList.dealer_view)
  return (
    <Grid container spacing={2}>
      {
        editable ? (
          <>
            <Grid item sm={12} md={8}>
              <DealerTransportsTable currentUser={currentUser} />
            </Grid>
          </>
        ) : (
          <>
            <Grid item sm={12} md={9}>
              <TransportTable onRowClick={showEditForm} />
            </Grid>
            {/* <Grid item sm={12} md={6}>
              <VehiclesLoanTable  />
            </Grid> */}
            <Drawer
              anchor="right"
              open={openModal}
              onClose={() => setOpenModal(false)}
              variant="temporary"
            >
              <AddNewTransportsForm title= {'Edit Transport Details Form'} currentUser={currentUser} id={rowData.t_owner_id} callback={handleClose} data={rowData} />
            </Drawer>

          </>

        )
      }

    </Grid>
  );
}

export default Transport;