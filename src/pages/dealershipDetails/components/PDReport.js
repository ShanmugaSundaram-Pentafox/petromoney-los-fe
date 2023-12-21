import { Grid, Typography, Drawer } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import LoaderButton from '../../../components/CommonComponents/Button/LoaderButton';
import EmptySidewrapper from '../../../components/CommonComponents/EmptySidewrapper';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { ReactComponent as AssetIcon } from '../../../icons/assets.svg';
import { ReactComponent as ChequeIcon } from '../../../icons/BankChequeIcon.svg';
import { ReactComponent as BankIcon } from '../../../icons/bankIcon.svg';
import { ReactComponent as BunkIcon } from '../../../icons/bunk.svg';
import { ReactComponent as BusinessIcon } from '../../../icons/business.svg';
import { ReactComponent as ContactsIcon } from '../../../icons/contacts.svg';
import { ReactComponent as CreditIcon } from '../../../icons/credits_pd.svg';
import { ReactComponent as IncomeIcon } from '../../../icons/income.svg';
import { ReactComponent as InfrastructureIcon } from '../../../icons/infrastructure.svg';
import { ReactComponent as LoanIcon } from '../../../icons/loan.svg';
import { ReactComponent as OtherIcon } from '../../../icons/other_icons.svg';
import { ReactComponent as OutletIcon } from '../../../icons/outlet.svg';
import { ReactComponent as ReferenceIcon } from '../../../icons/reference.svg';
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
  return (

    <div>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Typography style={{ width: '70%' }} variant="h4" align={textAlign} className={classes.WrapperTitle} >Personal Discussion Report</Typography>
          <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.pdReport}>
            <LoaderButton
              variant='contained' size='small' className={classes.btnSuccess} onClick={handleDownload} isLoading={loading}
              loadingText='Loading...'
            >Report</LoaderButton>
          </CheckAllowed>
        </div>


        <Grid container spacing={1} className={classes.root}>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.omcView}>
              <Tooltip title="click to edit OMC details">
                <div className={classes.content} onClick={() => setOpenOmcForm(true)}>
                  <BunkIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >OMC details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.businessView}>
              <Tooltip title="click to edit Business details">
                <div className={classes.content} onClick={() => setOpenBusinessForm(true)}>
                  <BusinessIcon width={30} className={classes.icons} />
                  <Typography variant="h6" align='center' className={classes.title} >Business details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.outletView}>
              <Tooltip title="click to edit Outlet details">
                <div className={classes.content} onClick={() => setOpenOutletForm(true)}>
                  <OutletIcon width={30} className={classes.icons} />
                  <Typography variant="h6" align='center' className={classes.title} >Outlet details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.infrastructureView}>
              <Tooltip title="click to edit Infrastructure details">
                <div className={classes.content} onClick={() => setOpenInfrastructureForm(true)}>
                  <InfrastructureIcon width={30} className={classes.icons} />
                  <Typography variant="h6" align='center' className={classes.title} >Infrastructure details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.assetView}>
              <Tooltip title="click to edit Asset details">
                <div className={classes.content} onClick={() => setOpenAssetForm(true)}>
                  <AssetIcon width={30} />
                  <Typography variant="h5" align='center' className={classes.title} >Asset details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankView}>
              <Tooltip title="click to edit Bank details">
                <div className={classes.content} onClick={() => setOpenBankingForm(true)}>
                  <BankIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Bank details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.loanView}>
              <Tooltip title="click to edit Loan details">
                <div className={classes.content} onClick={() => setOpenLoanForm(true)}>
                  <LoanIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Loan Details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.incomeExpenceView}>
              <Tooltip title="click to edit income details">
                <div className={classes.content} onClick={() => setOpenIncomeForm(true)}>
                  <IncomeIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Income/Expenses Details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.thirdPartyView}>
              <Tooltip title="click to edit reference details">
                <div className={classes.content} onClick={() => setOpenReferenceForm(true)}>
                  <ReferenceIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Third party verification</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.otherView}>
              <Tooltip title="click to edit other details">
                <div className={classes.content} onClick={() => setOpenOtherForm(true)}>
                  <OtherIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Other Details</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.creditPdView}>
              <Tooltip title="click to edit other details">
                <div className={classes.content} onClick={() => setOpenCreditPdForm(true)}>
                  <CreditIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Credit PD</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.callLogView}>
              <Tooltip title="click to Call">
                <div className={classes.content} onClick={() => setOpenPhonecall(true)}>
                  <ContactsIcon width={30} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Call logs</Typography>
                </div>
              </Tooltip>
            </CheckAllowed>
          </Grid>
          <Grid item md={2}>
            <Tooltip title="click to add cheque">
              <div className={classes.content} onClick={() => setOpenChequeDrawer(true)}>
                <ChequeIcon width={40} className={classes.icons} />
                <Typography variant="h5" align='center' className={classes.title} >Cheque</Typography>
              </div>
            </Tooltip>
          </Grid>
        </Grid>
      </div>

      <Drawer
        anchor="right"
        open={openOmcForm}
        onClose={() => setOpenOmcForm(false)}
        variant="temporary"
      >
        {
          externalView && !omcEdit ?
            <EmptySidewrapper title="OMC Details" callback={handleEdit} /> :
            <AddOmcDetailsForm dealer_id={id} isEdit={omcEdit ? null : 'Edit'} callback={handleEdit} currentUser={currentUser} data={omcData} editable={externalView} />
        }
      </Drawer>
      <Drawer
        anchor="right"
        open={openOutletForm}
        onClose={() => setOpenOutletForm(false)}
        variant="temporary"
      >
        {
          externalView && !outletData ?
            <EmptySidewrapper title="Outlet Details" callback={handleEdit} /> :
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
            <EmptySidewrapper title="Business Details" callback={handleEdit} /> :
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
            <EmptySidewrapper title="Infrastructure Details" callback={handleEdit} /> :
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
        open={true}
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
    </div >
  );

}
export default PersonalDiscussionReport;