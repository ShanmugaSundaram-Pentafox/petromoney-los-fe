import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
// import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Drawer from '@material-ui/core/Drawer';
import DealershipInfo from "./components/DealershipInfo";
import { useMount } from "react-use";
import { getDealershipById, getDealershipLoansById } from "../../services/dealerships.service";
import { getDealersByDealershipId } from "../../services/dealers.service";
import DealersList from "./components/DealersList";
import LoansList from "./components/LoansList";
import DealershipDoc from "./components/DocList";
import { NavLink as RouterLink } from "react-router-dom";
import SalesInfo from "../dashboard/components/SalesInfo";
import usePageTitle from "../../hooks/usePageTitle";
import CreditReportSideWrapper from "./components/CreditReportSideWrapper";
import InfoBox from "../../components/CommonComponents/InfoBox";
import SolarEnquiryForm from "./components/SolarEnquiryForm";
import { tabA11yProps, TabPanel } from "../../components/CommonComponents/Tabs/TabPanel";
import InfoCard from "../../components/CommonComponents/Cards/InfoCard";
import LeegalityLayout from "../../components/Leegality/LeegalityLayout";
import DealershipTransport from "./components/DealershipTransport";
import FleetOperatorsDetails from "./components/FleetOperatorsDetails";
import styled from 'styled-components';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
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
    textAlign: "right",
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
  const {
    url,
    params: { id },
  } = match;

  const onChangeTab = (e, newTab) => {
    setActiveTab(newTab);
  }

  const onChangeSolarTab = (e, newTab) => {
    setSolarTab(newTab);
  }

  const toggleCreditReport = () => {
    setShowCreditReport(!showCreditReport);
  }

  useMount(() => {
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
  usePageTitle(`${id} - ${dealershipData && (dealershipData.name || '')} `, true,cardData)
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
              <Tab label={<InfoBox active={activeTab === 0} number={1} title="Dealership Info" />} {...tabA11yProps(0)} />
              <Tab label={<InfoBox active={activeTab === 1} number={2} title="Dealers List" />} {...tabA11yProps(1)} />
              <Tab label={<InfoBox active={activeTab === 2} number={3} title="Sales History" />} {...tabA11yProps(2)} />
              <Tab label={<InfoBox active={activeTab === 3} number={4} title="Loans List" />} {...tabA11yProps(3)} />
              <Tab label={<InfoBox active={activeTab === 4} number={5} title="Documents" />} {...tabA11yProps(4)} />
              <Tab label={<InfoBox active={activeTab === 5} number={6} title="Transports" />} {...tabA11yProps(5)} />
              <Tab label={<InfoBox active={activeTab === 6} number={7} title="Fleet Operators" />} {...tabA11yProps(6)} />
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
        <TabPanel activeTab={activeTab} index={0}>
          {dealershipData && (
            <DealershipInfo data={dealershipData} currentUser={currentUser} toggleCreditReport={toggleCreditReport} />
          )}
        </TabPanel>
        <TabPanel activeTab={activeTab} index={1}>
          <DealersList id={id} titleAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={2}>
          <SalesInfo id={id} titleAlign="left" currentUser={currentUser} column />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={3}>
          <LoansList id={id} titleAlign="left" currentUser={currentUser} dealerData={dealerLoanData} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={4}>
          <DealershipDoc id={id} currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={5}>
          <DealershipTransport id={id} textAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={6}>
          <FleetOperatorsDetails id={id} textAlign="left" currentUser={currentUser} />
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
