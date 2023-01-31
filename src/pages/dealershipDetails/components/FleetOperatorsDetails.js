import { Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import Button from '../../../components/CommonComponents/Button/Button';
import FleetOperatorsTable from '../../../components/Tables/FleetOperatorsTable';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import CheckAllowed from '../../rbac/CheckAllowed';
import AddNewFleetOperatorForm from '../../transports/components/AddNewFleetOperatorForm';

const useStyles = makeStyles((theme) => ({

  wrapper: {
    padding: 8,
    // width: '50vw',
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8
  },
}))
const FleetOperatorsDetails = ({ id, currentUser, titleAlign }) => {
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({})
  const classes = useStyles()
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);


  const handleEdit = () => {
    setOpenModal(!openModal)
    setEdit(false)
    setData({});
  }
  const handleClick = (e, row) => {
    setData(row)
    setOpenModal(true)
    setEdit(true)

  }

  return (
    <div>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Typography style={{ width: '70%' }} variant="h5" align={titleAlign} className={classes.title}>Fleet Operator</Typography>
          <CheckAllowed currentUser={currentUser} resource={resources_id?.fleetOperator} action={action_id?.fleetOperator?.add}>
            <Button
              color="primary"
              variant="contained"
              size='small'
              onClick={() => setOpenModal(true)}
            >
              Add Fleet Operator
            </Button>
          </CheckAllowed>
        </div>
        <div>
          <FleetOperatorsTable id={id} dealersClickRow={handleClick} />
        </div>
      </div>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={handleEdit}
        variant="temporary"
      >
        {
          !edit ? (
            <AddNewFleetOperatorForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} editable={editable} />
          ) : (
            <AddNewFleetOperatorForm data={data} dealer_id={id} callback={handleEdit} currentUser={currentUser} editable={editable} />
          )
        }
      </Drawer>
    </div>
  )
}
export default FleetOperatorsDetails;