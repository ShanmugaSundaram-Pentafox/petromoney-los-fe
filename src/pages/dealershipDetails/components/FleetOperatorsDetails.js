import { Flex, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Button } from '../../../components/Mantine/Button/Button';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import FleetOperatorsTable from '../../../components/Tables/FleetOperatorsTable';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import CheckAllowed from '../../rbac/CheckAllowed';
import AddNewFleetOperatorForm from '../../transports/components/AddNewFleetOperatorForm';

const FleetOperatorsDetails = ({ id, currentUser, titleAlign }) => {
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({})
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
    <>
      <Flex align="center" justify="space-between" mb="lg">
        <Title order={3}>Fleet Operator</Title>

        <CheckAllowed currentUser={currentUser} resource={resources_id?.fleetOperator} action={action_id?.fleetOperator?.add}>
          <Button
            leftSection={<IconPlus size={18} />}
            size='xs'
            onClick={() => setOpenModal(true)}
          >
            Add Fleet Operator
          </Button>
        </CheckAllowed>
      </Flex>

      <FleetOperatorsTable id={id} dealersClickRow={handleClick} />

      <RightSideDrawer
        opened={openModal}
        size="lg"
        onClose={handleEdit}
        title="Fleet Operator Information"
      >
        {!edit ? (
          <AddNewFleetOperatorForm
            dealer_id={id}
            isEdit='Edit'
            callback={handleEdit}
            currentUser={currentUser}
            editable={editable}
          />
        ) : (
          <AddNewFleetOperatorForm
            data={data}
            dealer_id={id}
            callback={handleEdit}
            currentUser={currentUser}
            editable={editable}
          />
        )}
      </RightSideDrawer>
    </>
  )
}
export default FleetOperatorsDetails;