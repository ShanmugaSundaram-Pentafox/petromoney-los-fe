import { Flex, Title } from '@mantine/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
// import { withStyles } from "@material-ui/core/styles"
// import MuiAccordion from "@material-ui/core/Accordion"
// import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
// import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import { Button } from '../../../components/Mantine/Button/Button';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import TransportOwnerTable from '../../../components/Tables/TransportOwnerTable';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import CheckAllowed from '../../rbac/CheckAllowed';
import AddNewTransportsOwnerForm from '../../transports/components/AddNewTransportsOwnerForm';
import { IconPlus } from '@tabler/icons-react';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  wrapper: {
    padding: 8,
    // width: '50vw',
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  footer: {
    paddingTop: 8,
    textAlign: 'right'
  },
  tableRow: {
    cursor: 'pointer'
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
  },
  transportFormWrapper: {
    padding: theme.spacing(2),
  },
  transWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  ownerWrapper: {
    flex: 1,
    overflowY: 'auto'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  stepTitle: {
    '& .MuiStepLabel-label.MuiStepLabel-active': {
      fontSize: 15,
      fontWeight: 600
    }
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  }

}))
const DealershipTransport = ({ id, currentUser, titleAlign }) => {
  const [openModal, setOpenModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [rowData, setRowData] = useState({})
  const classes = useStyles()


  const editable = permissionCheck(currentUser.role_name, rulesList.external_view)
  const handleEdit = () => {
    setOpenModal(!openModal)
  }
  const showOwnerEditForm = (id, data) => {
    setFormType('Edit')
    setRowData(data)
    setOpenModal(!openModal)
  }


  return (
    <>
      <Flex align="center" justify="space-between" mb="lg">
        <Title order={3}>Transport Owner</Title>

        <CheckAllowed currentUser={currentUser} resource={resources_id?.transporters} action={action_id.transporters.addOwner}>
          <Button
            leftSection={<IconPlus size={18} />}
            size='xs'
            onClick={() => {
              setOpenModal(true)
              setRowData({})
              setFormType('Add')
            }}
          >
            Add Owner
          </Button>
        </CheckAllowed>
      </Flex>

      <TransportOwnerTable id={id} onRowClick={showOwnerEditForm} />

      <RightSideDrawer
        size="lg"
        opened={openModal}
        onClose={() => {
          setRowData({})
          setOpenModal(false)
        }}
        title="Owner Information"
      >
        <AddNewTransportsOwnerForm
          dealer_id={id}
          rowData={rowData}
          isAdd={formType}
          callback={handleEdit}
          currentUser={currentUser} editable={editable}
        />
      </RightSideDrawer>
    </>
  )
}
export default DealershipTransport;