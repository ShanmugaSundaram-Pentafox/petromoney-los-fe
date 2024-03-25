import { Box, Flex, SimpleGrid, Text, Title } from '@mantine/core';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { IconAddressBook, IconCashBanknote, IconUser, IconBuildingBank, IconServer2, IconCube, IconMoneybag, IconCreditCard, IconInfoHexagon, IconPercentage, IconOutlet, IconUsersGroup, IconReport } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import EmptySideDrawer from '../../../components/CommonComponents/EmptySideDrawer';
import { Button } from '../../../components/Mantine/Button/Button';
import { Tooltip } from '../../../components/Mantine/Tooltip/Tooltip';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getSignedUrl } from '../../../services/common.service';
import { getDealershipById } from '../../../services/dealerships.service';
import { downloadPDReport, getAssetDetailsById, getBusinessDetailsbyID, getInfrastructureDetailsById, getOmcDetailsById, getOtherDetailsbyID, getOutletDetailsById, getReferenceDetailsbyID } from '../../../services/PDReport.services';
import CheckAllowed from '../../rbac/CheckAllowed';
import AddAssetDetailsForm from '../PDRForms/AddAssetDetailsForm';
import AddBankingDetailsForm from '../PDRForms/AddBankingDetailsForm';
import AddBusinessDetailsForm from '../PDRForms/AddBusinessDetailsForm';
import AddCreditPdForm from '../PDRForms/AddCreditPdForm';
import AddIncomeDetailsForm from '../PDRForms/AddIncomeDetailsForm';
import AddInfrastructureDetailsForm from '../PDRForms/AddInfrastructureDetailsForm';
import AddLoanDetailsForm from '../PDRForms/AddLoanDetailsForm';
import AddNewOutletDetailsForm from '../PDRForms/AddNewOutletDetailsForm';
import AddOmcDetailsForm from '../PDRForms/AddOmcDetailsForm';
import AddOtherDetailsForm from '../PDRForms/AddOtherDetailsForm';
import AddReferenceForm from '../PDRForms/AddReferenceForm';
import Cheque from '../PDRForms/Cheque';
import VoiceCall from '../PDRForms/VoiceCall';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 4,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  WrapperTitle: {
    fontSize: 18,
    marginBottom: 12
  },

  wrapper: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    paddingLeft: 8,
    marginBottom: 8
  },
  content: {
    textAlign: 'center',
    borderRadius: 6,
    paddingTop: 16,
    paddingBottom: 12,
    cursor: 'pointer',
    transition: 'all 0.35s',
    '&:hover': {
      backgroundColor: '#e6e6e6',
    },
  },
  icons: {
    textAlign: 'center',
  },
  phone: {
    fontSize: '40px',
    color: 'gray',
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  dialogBox: {
    width: '100%',
    paddingTop: 10,
  },
  frame: {
    '&.MuiDialogContent-root': {
      '&.MuiDialogContent-dividers': {
        backgroundColor: 'pink',
        overflow: 'hidden'
      }
    }
  }
}))

const PersonalDiscussionReport = ({ id, currentUser, textAlign }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false)
  const [openOmcForm, setOpenOmcForm] = useState(false)
  const [openBusinessForm, setOpenBusinessForm] = useState(false)
  const [openOutletForm, setOpenOutletForm] = useState(false)
  const [openInfrastructureForm, setOpenInfrastructureForm] = useState(false)
  const [openAssetForm, setOpenAssetForm] = useState(false)
  const [openBankingForm, setOpenBankingForm] = useState(false)
  const [openOtherForm, setOpenOtherForm] = useState(false)
  const [openLoanForm, setOpenLoanForm] = useState(false)
  const [openReferenceForm, setOpenReferenceForm] = useState(false);
  const [openIncomeForm, setOpenIncomeForm] = useState(false)
  const [omcEdit, setOmcEdit] = useState(false)
  const [omcData, setOmcData] = useState()
  const [outletData, setOutletData] = useState(false)
  const [referenceData, setReferenceData] = useState([])
  const [addlData, setAddlData] = useState([])
  const [infrastructureDetails, setInfrastructureDetails] = useState()
  const [assetDetails, setAssetDetails] = useState()
  const [businessData, setBusinessData] = useState();
  const [openCreditPdForm, setOpenCreditPdForm] = useState();
  const [fileCode, setFileCode] = useState()
  const [openDialog, setOpenDialog] = useState(false)
  const [dealershipData, setDealershipData] = useState()
  const [openPhonecall, setOpenPhonecall] = useState(false)
  const [openChequeDrawer, setOpenChequeDrawer] = useState(false)

  const handleEdit = () => {
    setOpenOmcForm(false)
    setOpenBusinessForm(false)
    setOpenOutletForm(false)
    setOpenInfrastructureForm(false)
    setOpenAssetForm(false)
    setOpenBankingForm(false)
    setOpenOtherForm(false)
    setOpenLoanForm(false)
    setOpenReferenceForm(false)
    setOpenIncomeForm(false)
    setOpenCreditPdForm(false)
    setOpenPhonecall(false)
  }
  useMount(() => {
    getOmcDetailsById(id)
      .then(data => {
        setOmcData(data[0])
        if (data[0].agreement_executed_on || data[0].agreement_valid_till || data[0].communication_mode || data[0].sales_officer_name || data[0].sales_officer_mobile) {
          setOmcEdit(true)
        }
      })
      .catch((e) => {
        console.log(e);
      })
    getOutletDetailsById(id)
      .then(data => {
        setOutletData(data[0])
      })
      .catch((e) => {
        console.log(e);
      })
    getInfrastructureDetailsById(id)
      .then(data => {
        setInfrastructureDetails(data[0])
      })
      .catch((e) => {
        console.log(e);
      })
    getBusinessDetailsbyID(id)
      .then(data => {
        setBusinessData(data[0])
      })
      .catch((e) => {
        console.log(e);
      })
    getAssetDetailsById(id)
      .then(data => {
        setAssetDetails(data)
      })
      .catch((e) => {
        console.log(e);
      })
    getReferenceDetailsbyID(id)
      .then(data => {
        setReferenceData(data)
      })
      .catch((e) => {
        console.log(e);
      })
    getOtherDetailsbyID(id)
      .then(data => {
        setAddlData(data)
      })
      .catch((e) => {
        console.log(e);
      })
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })
  const handleDownload = () => {
    setLoading(true)
    downloadPDReport(id)
      .then(res => {
        if (res?.file) {
          getSignedUrl(res?.file)
            .then((res) => {
              window.open(res?.url, '_blank');
            })
            .catch(e => {
              enqueueSnackbar(e, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'error',
              });
            })
        }
        setOpenDialog(true)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }
  const credit_permission = permissionCheck(currentUser.role_name, rulesList.credit_view);
  const sales_permission = permissionCheck(currentUser.role_name, rulesList.pdr_view);
  const externalView = permissionCheck(currentUser.role_name, rulesList.external_view);
  const phonecall_permission = permissionCheck(currentUser.role_name, rulesList.phone_call);


  const PDReportLists = [
    {
      name: 'OMC details',
      icon: <IconUser size={32} stroke={1.25} />,
      onClick: () => setOpenOmcForm(true),
      action: action_id?.personalDiscussion?.omcView
    },
    {
      name: 'Business details',
      icon: <IconBuildingBank size={32} stroke={1.25} />,
      onClick: () => setOpenBusinessForm(true),
      action: action_id?.personalDiscussion?.businessView
    },
    {
      name: 'Outlet details',
      icon: <IconOutlet size={32} stroke={1.25} />,
      onClick: () => setOpenOutletForm(true),
      action: action_id?.personalDiscussion?.outletView
    },
    {
      name: 'Infrastructure details',
      icon: <IconServer2 size={32} stroke={1.25} />,
      onClick: () => setOpenInfrastructureForm(true),
      action: action_id?.personalDiscussion?.infrastructureView
    },
    {
      name: 'Asset details',
      icon: <IconCube size={32} stroke={1.25} />,
      onClick: () => setOpenAssetForm(true),
      action: action_id?.personalDiscussion?.assetView
    },
    {
      name: 'Bank details',
      icon: <IconCreditCard size={32} stroke={1.25} />,
      onClick: () => setOpenBankingForm(true),
      action: action_id?.personalDiscussion?.bankView
    },
    {
      name: 'Loan Details',
      icon: <IconMoneybag size={32} stroke={1.25} />,
      onClick: () => setOpenLoanForm(true),
      action: action_id?.personalDiscussion?.loanView
    },
    {
      name: 'Income/Expenses Details',
      icon: <IconCashBanknote size={32} stroke={1.25} />,
      onClick: () => setOpenIncomeForm(true),
      action: action_id?.personalDiscussion?.incomeExpenceView
    },
    {
      name: 'Third party verification',
      icon: <IconUsersGroup size={32} stroke={1.25} />,
      onClick: () => setOpenReferenceForm(true),
      action: action_id?.personalDiscussion?.thirdPartyView
    },
    {
      name: 'Other Details',
      icon: <IconInfoHexagon size={32} stroke={1.25} />,
      onClick: () => setOpenOtherForm(true),
      action: action_id?.personalDiscussion?.otherView
    },
    {
      name: 'Credit PD',
      icon: <IconPercentage size={32} stroke={1.25} />,
      onClick: () => setOpenCreditPdForm(true),
      action: action_id?.personalDiscussion?.creditPdView
    },
    {
      name: 'Call logs',
      icon: <IconAddressBook size={32} stroke={1.25} />,
      onClick: () => setOpenPhonecall(true),
      action: action_id?.personalDiscussion?.callLogView
    },
    {
      name: 'Cheque',
      icon: <IconCashBanknote size={32} stroke={1.25} />,
      onClick: () => setOpenChequeDrawer(true)
    }
  ]
  console.log('omc data ->>>>>>>>>>>>>>>>>',omcData)
  return (
    <>
      <Flex align="center" justify="space-between" mb="lg">
        <Title order={3}>Personal Discussion Report</Title>

        <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.pdReport}>
          <Button
            onClick={handleDownload}
            leftSection={<IconReport size={18} />}
            loading={loading}
            loaderProps={{ type: 'dots' }}
          >
            Report
          </Button>
        </CheckAllowed>
      </Flex>

      <SimpleGrid cols={{ base: 3, sm: 4, md: 5, lg: 6 }} spacing="sm">
        {PDReportLists.map((list, index) => {
          return (
            <div key={list.name + index}>
              {list.action ? (
                <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={list.action}>
                  <Tooltip position="bottom" label={`click to edit ${list.name}`}>
                    <Box
                      className="h-28 bg-gray-50 hover:bg-gray-200 flex flex-col items-center justify-between px-2 py-6 rounded-lg cursor-pointer transition-transform transform hover:-translate-y-0.5 duration-500"
                      onClick={list.onClick}
                    >
                      {list.icon}
                      <Text size="xs" fw="bold" ta="center" lineClamp={1}>{list.name}</Text>
                    </Box>
                  </Tooltip>
                </CheckAllowed>
              ) : (
                <Tooltip position="bottom" label={`click to edit ${list.name}`}>
                  <Box
                    className="h-28 bg-gray-50 hover:bg-gray-200 flex flex-col items-center justify-between px-2 py-6 rounded-lg cursor-pointer transition-transform transform hover:-translate-y-0.5 duration-500"
                    onClick={list.onClick}
                  >
                    {list.icon}
                    <Text size="xs" fw="bold" ta="center" lineClamp={1}>{list.name}</Text>
                  </Box>
                </Tooltip>
              )}
            </div>
          )
        })}
      </SimpleGrid>
      {console.log(omcData)}
      {/* Right Side Drawer Starts Here */}
      {externalView && !omcEdit ? (
        <EmptySideDrawer
          title="OMC Details"
          callback={handleEdit}
        />
      ) : (
        <AddOmcDetailsForm
          open={openOmcForm}
          onClose={() => setOpenOmcForm(false)}
          dealer_id={id}
          isEdit={omcData ? true : false}
          callback={handleEdit}
          currentUser={currentUser}
          data={omcData}
          editable={externalView}
        />
      )}
      {/* Right Side Drawer Ends Here */}

      <Drawer
        anchor="right"
        open={openOutletForm}
        onClose={() => setOpenOutletForm(false)}
        variant="temporary"
      >
        {
          externalView && !outletData ?
            <EmptySideDrawer title="Outlet Details" callback={handleEdit} /> :
            <AddNewOutletDetailsForm dealer_id={id} isEdit={outletData ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={outletData} editable={externalView} />
        }
      </Drawer>
      <Drawer
        anchor="right"
        open={openBusinessForm}
        onClose={() => setOpenBusinessForm(false)}
        variant="temporary"
      >
        {
          externalView && !businessData ?
            <EmptySideDrawer title="Business Details" callback={handleEdit} /> :
            <AddBusinessDetailsForm dealer_id={id} isEdit={businessData ? null : 'Edit'} callback={handleEdit} data={businessData} currentUser={currentUser} editable={externalView} />
        }
      </Drawer>
      <Drawer
        anchor="right"
        open={openInfrastructureForm}
        onClose={() => setOpenInfrastructureForm(false)}
        variant="temporary"
      >
        {
          externalView && !infrastructureDetails ?
            <EmptySideDrawer title="Infrastructure Details" callback={handleEdit} /> :
            <AddInfrastructureDetailsForm dealer_id={id} isEdit={infrastructureDetails ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={infrastructureDetails} editable={externalView} />
        }
      </Drawer>
      <Drawer
        anchor="right"
        open={openAssetForm}
        onClose={() => setOpenAssetForm(false)}
        variant="temporary"
      >
        <AddAssetDetailsForm dealer_id={id} isEdit={assetDetails ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={assetDetails} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openBankingForm}
        onClose={() => setOpenBankingForm(false)}
        variant="temporary"
      >
        <AddBankingDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openOtherForm}
        onClose={() => setOpenOtherForm(false)}
        variant="temporary"
      >
        <AddOtherDetailsForm dealer_id={id} isEdit={addlData ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={addlData} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openLoanForm}
        onClose={() => setOpenLoanForm(false)}
        variant="temporary"
      >
        <AddLoanDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openReferenceForm}
        onClose={() => setOpenReferenceForm(false)}
        variant="temporary"
      >
        <AddReferenceForm dealer_id={id} isEdit={referenceData ? null : 'Edit'} data={referenceData} callback={handleEdit} currentUser={currentUser} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openIncomeForm}
        onClose={() => setOpenIncomeForm(false)}
        variant="temporary"
      >
        <AddIncomeDetailsForm dealer_id={id} isEdit='Edit' callback={handleEdit} currentUser={currentUser} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openCreditPdForm}
        onClose={() => setOpenCreditPdForm(false)}
        variant="temporary"
      >
        <AddCreditPdForm dealer_id={id} isEdit='Edit' data={dealershipData} callback={handleEdit} currentUser={currentUser} editable={externalView} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openPhonecall}
        variant="temporary"
      >
        <VoiceCall id={id} callback={handleEdit} currentUser={currentUser} />
      </Drawer>
      <Drawer
        anchor="right"
        open={openChequeDrawer}
        onClose={() => setOpenChequeDrawer(false)}
        variant="temporary"
      >
        <Cheque dealershipId={id} callback={() => setOpenChequeDrawer(false)} currentUser={currentUser} dealershipData={dealershipData} />
      </Drawer>
    </>
  );
}
export default PersonalDiscussionReport;