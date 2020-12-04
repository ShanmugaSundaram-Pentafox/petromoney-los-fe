import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
// import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
// import Divider from "@material-ui/core/Divider";
// import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Drawer from '@material-ui/core/Drawer';
import DealershipInfo from "./components/DealershipInfo";
import { useMount } from "react-use";
import { getDealershipById } from "../../services/dealerships.service";
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

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  tabsWrapper: {
    display: 'flex',
    flexGrow: 1,
  },
  tabs: {
    borderRight: 'none',
    minWidth: 180,
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
  const [dealershipData, setDealershipData] = useState();
  const [dealersData, setDealersData] = useState();
  const [mainApplicant, setMainApplicant] = useState({})
  const [showCreditReport, setShowCreditReport] = useState();
  const [showSolarForm, setShowSolarForm] = useState();
  const {
    url,
    params: { id },
  } = match;

  const onChangeTab = (e, newTab) => {
    setActiveTab(newTab);
  }

  const toggleCreditReport = () => {
    setShowCreditReport(!showCreditReport);
  }

  useMount(() => {
    getDealershipById(id)
      .then((data) => setDealershipData(data))
      .catch((e) => null);

    getDealersByDealershipId(id)
      .then((data) => {
        setDealersData(data);
        const ap = data.find(item => item.is_main_applicant);
        setMainApplicant(ap);
      })
      .catch((e) => null);
  });

  usePageTitle(`${id} - ${dealershipData && (dealershipData.name || '')}`, true)

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <InfoCard
            title={"Dealership Info"}
            userInitial={dealershipData?.name?.charAt(0)}
            name={dealershipData?.name}
            caption={id}
            content={dealershipData?.address}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          {
            mainApplicant?.first_name ? (
              <InfoCard 
                title={"Main Dealer Info"}
                userInitial={`${mainApplicant?.first_name?.charAt(0)}`}
                name={`${mainApplicant?.first_name} ${mainApplicant?.last_name || ''}`}
                description={`+91 ${mainApplicant?.mobile}`}
                content={`${mainApplicant?.email}`}
              />
            ) : null
          }
        </Grid>
      </Grid>
      <div className={classes.tabsWrapper}>
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
          <div onClick={() => setShowSolarForm(true)}>
            <InfoBox title="Solar Enquiry Form" />
          </div>
        </Tabs>
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
          <LoansList id={id} titleAlign="left" currentUser={currentUser} />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={4}>
          <DealershipDoc id={id} currentUser={currentUser} />
        </TabPanel>
      </div>

      <Drawer
        anchor="right"
        open={showSolarForm}
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
      </Drawer>
      
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
    </div>
  );
};

export default DealershipDetails;
