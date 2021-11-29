import { Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import Button from '../../../components/CommonComponents/Button/Button';
import FleetOperatorsTable from '../../../components/Tables/FleetOperatorsTable';
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
          <Button
            color="primary"
            variant="contained"
            size='small'
            onClick={() => setOpenModal(true)}
          >
            Add Fleet Operator
          </Button>
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
            <AddNewFleetOperatorForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} />
          ) : (
            <AddNewFleetOperatorForm data={data} dealer_id={id} callback={handleEdit} currentUser={currentUser} />
          )
        }
      </Drawer>
    </div>
  )
}
export default FleetOperatorsDetails;