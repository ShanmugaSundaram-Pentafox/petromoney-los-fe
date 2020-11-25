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
    width: 700
  }
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const TabPanel = ({ children, activeTab, index, ...rest }) => {
  return (
    <div
      role="tabpanel"
      hidden={activeTab !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...rest}
    >
      {activeTab === index && (
        <Box p={2} pt={0}>
          <Paper>
            {children}
          </Paper>
        </Box>
      )}
    </div>
  );
}


const DealershipDetails = ({ currentUser, match }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [dealershipData, setDealershipData] = useState();
  const [dealersData, setDealersData] = useState();
  const [showCreditReport, setShowCreditReport] = useState();
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
      .then((data) => setDealersData(data))
      .catch((e) => null);
  });

  usePageTitle(`${id} - ${dealershipData && (dealershipData.name || '')}`)

  return (
    <div className={classes.root}>
      <div className={classes.tabsWrapper}>
        <Tabs
          orientation="vertical"
          // variant="scrollable"
          value={activeTab}
          onChange={onChangeTab}
          aria-label="Dealership Details Panel"
          className={classes.tabs}
        >
          <Tab label={<InfoBox active={activeTab === 0} number={1} title="Dealership Info" />} {...a11yProps(0)} />
          <Tab label={<InfoBox active={activeTab === 1} number={2} title="Dealers List" />} {...a11yProps(1)} />
          <Tab label={<InfoBox active={activeTab === 2} number={3} title="Sales History" />} {...a11yProps(2)} />
          <Tab label={<InfoBox active={activeTab === 3} number={4} title="Loans List" />} {...a11yProps(3)} />
          <Tab label={<InfoBox active={activeTab === 4} number={5} title="Documents" />} {...a11yProps(4)} />
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
      <Grid container>
        <Grid item md={5} xs={12}>
          {/* <Typography className={classes.title} variant="h4">
            {id} - {dealershipData && dealershipData.name}
          </Typography> */}
        </Grid>
        <Grid item md={7} xs={12} className={classes.titleActionContainer}>
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
        </Grid>
      </Grid>
      {/* <Divider className={classes.bottomSpacing} /> */}
      {/* <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            {dealershipData && (
              <DealershipInfo data={dealershipData} currentUser={currentUser} toggleCreditReport={toggleCreditReport} />
            )}
            <Paper className={classes.topSpacing}>
              <DealershipDoc id={id} currentUser={currentUser} />
            </Paper>
          </Grid>

        <Grid item md={6} xs={12}>
          <Paper className={classes.bottomSpacing}>
            <LoansList id={id} titleAlign="left" currentUser={currentUser} />
          </Paper>
          <Paper className={classes.bottomSpacing}>
            <DealersList id={id} titleAlign="left" currentUser={currentUser} />
          </Paper>
          <Paper className={classes.bottomSpacing}>
            <SalesInfo id={id} titleAlign="left" currentUser={currentUser} column />
          </Paper>
        </Grid>
      </Grid> */}
    </div>
  );
};

export default DealershipDetails;
