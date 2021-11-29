// import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Drawer from '@material-ui/core/Drawer';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/styles';
import { toInteger } from 'lodash-es/foo';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';


import { useMount } from 'react-use';
import CreditReportSideWrapper from './components/CreditReportSideWrapper';
import DealershipInfo from './components/DealershipInfo';
import DealershipTransport from './components/DealershipTransport';
import DealersList from './components/DealersList';
import Deviations from './components/Deviations';
import DealershipDoc from './components/DocList';
import FleetOperatorsDetails from './components/FleetOperatorsDetails';
import LoansList from './components/LoansList';
import PersonalDiscussionReport from './components/PDReport';
import SolarEnquiryForm from './components/SolarEnquiryForm';
import StatementAnalysis from './components/StatementAnalysis';
import InfoBox from '../../components/CommonComponents/InfoBox';
import { tabA11yProps, TabPanel } from '../../components/CommonComponents/Tabs/TabPanel';
import LeegalityLayout from '../../components/Leegality/LeegalityLayout';

import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import { getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById, getDealershipLoansById } from '../../services/dealerships.service';
import SalesInfo from '../dashboard/components/SalesInfo';

const useStyles = makeStyles((theme) => ({

  tabsWrapper: {
    display: 'flex',
    flexGrow: 1,
    marginTop: 20,
  },
  tabs: {
    borderRight: 'none',
    minWidth: 180,
  },
  solarTabs: {
    paddingLeft: 16,
    // borderLeft: '0.5px solid rgba(0,0,0,0.25)'
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  titleActionContainer: {
    textAlign: 'right',
  },
  topSpacing: {
    marginTop: theme.spacing(2),
  },
  bottomSpacing: {
    marginBottom: theme.spacing(2),
  },
  sidePanelWrapper: {
    width: '60vw'
  },
  solarPanelWrapper: {
    width: '80vw',
    backgroundColor: '#e5e5e5',
  },
}));



const DealershipDetails = ({ currentUser, match }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [solarTab, setSolarTab] = useState(-1);
  const [dealershipData, setDealershipData] = useState();
  const [dealersData, setDealersData] = useState();
  const [mainApplicant, setMainApplicant] = useState({})
  const [showCreditReport, setShowCreditReport] = useState();
  const [showSolarForm, setShowSolarForm] = useState();
  const [leegalityModalVisible, setLeegalityModalVisible] = useState(false);
  const [dealerLoanData, setDealerLoanData] = useState();
  const history = useHistory();
  const financialReport_permission = permissionCheck(currentUser.role_name, rulesList.financial_view);

  const tabs = [
    'Dealership',
    'Dealers',
    'Bank Statement Analysis',
    'Deviations',
    'Sales History',
    'Loans List',
    'Personal Discussion',
    'Document Checklist',
    'Transporters',
    'Fleet Operators'
  ];
  
  if (financialReport_permission){
    tabs.splice(2,0,'Financial Report')
  }

  const {
    url,
    params: { id },
  } = match;

  const onChangeTab = (e, newTab) => {
    setActiveTab(newTab);
    history.replace(`?t=${newTab}`)
  }

  const onChangeSolarTab = (e, newTab) => {
    setSolarTab(newTab);
  }

  const toggleCreditReport = () => {
    setShowCreditReport(!showCreditReport);
  }

  useMount(() => {
    const queryString = window.location.hash;
    const test = queryString.split('='); 
    setActiveTab(toInteger(test[1]))
    getDealershipById(id)
      .then((data) => setDealershipData(data))
      .catch((e) => null);
    getDealershipLoansById(id)
      .then(data => setDealerLoanData(data))
      .catch(e => null)
    getDealersByDealershipId(id)
      .then((data) => {
        setDealersData(data);
        const ap = data.find(item => item.is_main_applicant);
        setMainApplicant(ap);
      })
      .catch((e) => null);
  });
  let cardData = [
    { label: 'Dealership ID', value: dealershipData?.id },
    { label: 'Business name', value: dealershipData?.name },
    { label: 'Dealer name', value: mainApplicant?.first_name },
    { label: 'Mobile', value: mainApplicant?.mobile },
    { label: 'Email', value: mainApplicant?.email }
  ]
  usePageTitle(`${id} - ${dealershipData && (dealershipData.name || '')} `, true, cardData)
  return (
    <div>
      {/* <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <InfoCard
            title={"Dealership Info"}
            userInitial={dealershipData?.name?.charAt(0)}
            name={dealershipData?.name}
            caption={id}
            content={dealershipData?.address}
          />
        </Grid>
        {
          mainApplicant?.first_name ? (
            <Grid item xs={6} sm={4}>
              <InfoCard
                title={"Main Dealer Info"}
                userInitial={`${mainApplicant?.first_name?.charAt(0)}`}
                name={`${mainApplicant?.first_name} ${mainApplicant?.last_name || ''}`}
                description={`+91 ${mainApplicant?.mobile}`}
                content={`${mainApplicant?.email || ''}`}
              />
            </Grid>
          ) : null
        } */}
      {/* <Grid item xs={6} sm={4}>
          <InfoCard 
            title={" "}
            userInitial={`V`}
            name={`AppVault`}
            description={`Sign applications`}
            onClick={() => {
              setLeegalityModalVisible(true)
            }}
          />
        </Grid> */}
      {/* </Grid> */}
      <div className={classes.tabsWrapper}>
        <div>
          <Collapse in={!showSolarForm}>
            <Tabs
              orientation="vertical"
              // variant="scrollable"
              value={activeTab}
              onChange={onChangeTab}
              aria-label="Dealership Details Panel"
              className={classes.tabs}
            >
              {
                tabs.map((title, i) => {
                  return(<Tab key={i} label={<InfoBox active={activeTab === i} number={i+1} title={title} />} {...tabA11yProps(i)} />)
                })
              }
              {/* <Tab label={<InfoBox active={activeTab === 0} title="Dealership" />} {...tabA11yProps(0)} />
              <Tab label={<InfoBox active={activeTab === 1} title="Dealers" />} {...tabA11yProps(1)} />
              {
                financialReport_permission && (
                  <Tab label={<InfoBox active={activeTab === 2} title="Financial Report" />} {...tabA11yProps(2)} />
                )
              }
              <Tab label={<InfoBox active={activeTab === 3} title="Sales History" />} {...tabA11yProps(3)} />
              <Tab label={<InfoBox active={activeTab === 4} title="Loans List" />} {...tabA11yProps(4)} />
              <Tab label={<InfoBox active={activeTab === 5} title="Personal Discussion" />} {...tabA11yProps(5)} />
              <Tab label={<InfoBox active={activeTab === 6} title="Document Checklist" />} {...tabA11yProps(6)} />
              <Tab label={<InfoBox active={activeTab === 7} title="Transporters" />} {...tabA11yProps(7)} />
              <Tab label={<InfoBox active={activeTab === 8} title="Fleet Operators" />} {...tabA11yProps(8)} /> */}
            </Tabs>
          </Collapse>
          {/* <div>
            <div onClick={() => {
              setActiveTab(-1);
              setSolarTab(0);
              setShowSolarForm(true);
            }}>
              <InfoBox title="Solar Enquiry Form" />
            </div>
            <Collapse in={showSolarForm}>
              <Tabs
                orientation="vertical"
                // variant="scrollable"
                value={solarTab}
                onChange={onChangeSolarTab}
                aria-label="Solar Enquiry Form"
                className={[classes.tabs, classes.solarTabs]}
              >
                <Tab label={<InfoBox active={solarTab === 0} number={1} title="Dealer Info" />} {...tabA11yProps(0)} />
                <Tab label={<InfoBox active={solarTab === 1} number={2} title="Project Details" />} {...tabA11yProps(1)} />
                <Tab label={<InfoBox active={solarTab === 2} number={3} title="Roof Details" />} {...tabA11yProps(2)} />
                <Tab label={<InfoBox active={solarTab === 3} number={4} title="Electrical Assessments" />} {...tabA11yProps(3)} />
                <Tab label={<InfoBox active={solarTab === 4} number={5} title="Load Profile" />} {...tabA11yProps(4)} />
              </Tabs>
              <div onClick={() => {
                setActiveTab(0);
                setSolarTab(-1);
                setShowSolarForm(false);
              }}>
                <InfoBox title="Go Back" />
              </div>
            </Collapse>
          </div> */}
        </div>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Dealership')}>
          {dealershipData && (
            <DealershipInfo data={dealershipData} currentUser={currentUser} toggleCreditReport={toggleCreditReport} />
          )}
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Dealers')}>
          <DealersList id={id} titleAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Deviations')}>
          <Deviations id={id} />
          {/* <DeviationsTable id={id}/> */}
        </TabPanel>
        {
          financialReport_permission && (
            <TabPanel activeTab={activeTab} index={tabs.indexOf('Financial Report')}>
              <CreditReportSideWrapper dealershipId={id} data={{}} currentUser={currentUser} />
            </TabPanel>
          )
        }
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Sales History')}>
          <SalesInfo id={id} titleAlign="left" currentUser={currentUser} column />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Loans List')}>
          <LoansList id={id} titleAlign="left" currentUser={currentUser} dealerData={dealerLoanData} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Personal Discussion')}>
          <PersonalDiscussionReport id ={id} textAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Document Checklist')}>
          <DealershipDoc id={id} currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Transporters')}>
          <DealershipTransport id={id} textAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Fleet Operators')}>
          <FleetOperatorsDetails id={id} textAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Bank Statement Analysis')}>
          <StatementAnalysis id={id} textAlign="left" currentUser={currentUser} />
        </TabPanel>
        <SolarEnquiryForm
          dealershipId={id}
          mainApplicant={mainApplicant}
          solarTab={solarTab}
          onChangeTab={setSolarTab}
          currentUser={currentUser}
          onClose={() => setShowSolarForm(false)}
        />
      </div>

      {/* <Drawer
        anchor="right"
        open={false}
        variant="temporary"
        PaperProps={{
          style: { backgroundColor: '#e5e5e5' }
        }}
      >
        <div className={classes.solarPanelWrapper}>
          <SolarEnquiryForm
            dealershipId={id}
            data={{}}
            dealershipData={dealershipData}
            currentUser={currentUser}
            onClose={() => setShowSolarForm(false)}
          />
        </div>
      </Drawer> */}

      <Drawer
        anchor="right"
        open={showCreditReport}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <CreditReportSideWrapper
            dealershipId={id}
            data={{}}
            currentUser={currentUser}
            onClose={toggleCreditReport}
          />
        </div>
      </Drawer>

      <Dialog
        fullScreen
        scroll="paper"
        open={leegalityModalVisible}
        onClose={() => setLeegalityModalVisible(false)}
      >
        <DialogContent>
          <LeegalityLayout />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeegalityModalVisible(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setLeegalityModalVisible(false)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DealershipDetails;
