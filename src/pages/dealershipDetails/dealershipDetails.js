import { Tabs, Badge } from '@mantine/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/styles';
import toInteger from 'lodash-es/toInteger';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import DealershipInfo from './components/DealershipInfo';
import DealershipTransport from './components/DealershipTransport';
import DealersList from './components/DealersList';
import DealershipDoc from './components/DocList';
import FleetOperatorsDetails from './components/FleetOperatorsDetails';
import LoansList from './components/LoansList';
import PersonalDiscussionReport from './components/PDReport';
import ScoreCard from './components/ScoreCard';
import SolarEnquiryForm from './components/SolarEnquiryForm';
import LeegalityLayout from '../../components/Leegality/LeegalityLayout';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../config/accessControl';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import { getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById } from '../../services/dealerships.service';
import { isAllowed } from '../../utils/cerbos';

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
  const [showSolarForm, setShowSolarForm] = useState();
  const [leegalityModalVisible, setLeegalityModalVisible] = useState(false);
  const history = useHistory();
  const financialReport_permission = permissionCheck(currentUser.role_name, rulesList.financial_view);
  const pageData = [
    {
      id: action_id?.dealershipNavigation?.dealership,
      name: 'Dealership',
      value: 'dealership',
    },
    {
      id: action_id?.dealershipNavigation?.dealers,
      name: 'Dealers',
      value: 'dealer',
    },
    {
      id: action_id?.dealershipNavigation?.scoreCard,
      name: 'Score Card',
      value: 'score_card'
    },
    {
      id: action_id?.dealershipNavigation?.loansList,
      name: 'Loans List',
      value: 'loans_list'
    },
    {
      id: action_id?.dealershipNavigation?.personalDiscussion,
      name: 'Personal Discussion',
      value: 'personal_discussion'
    },
    {
      id: action_id?.dealershipNavigation?.docChecklist,
      name: 'Documents',
      value: 'documents'
    },
    {
      id: action_id?.dealershipNavigation?.transporters,
      name: 'Transporters',
      value: 'transporter'
    },
    {
      id: action_id?.dealershipNavigation?.fleetOperator,
      name: 'Fleet Operators',
      value: 'fleet_operators'
    },
  ]

  let tabs = [];

  // Allowed navigations inside dealership 
  for (const page in pageData) {
    if (isAllowed(currentUser?.permissions, resources_id?.dealershipNavigation, pageData[page]?.id)) {
      tabs.push(pageData[page])
    }
  }

  const {
    url,
    params: { id },
  } = match;
  const dealershipData = useQuery(['dealership-info', id], () => getDealershipById(id), { refetchOnWindowFocus: false })
  const mainApplicant = useQuery(['main-applicant-data', id], () => getDealersByDealershipId(id), {
    select: (data) => {
      const ap = data.find(item => item.is_main_applicant);
      return ap;
    },
    refetchOnWindowFocus: false
  })
  const onChangeTab = (newTab) => {
    setActiveTab(newTab);
    history.replace(`?t=${newTab}`)
  }

  useMount(() => {
    const queryString = window.location.hash;
    const test = queryString.split('=');
    setActiveTab(toInteger(test[1]))
  });
  let cardData = [
    { label: 'Dealership ID', value: dealershipData?.data?.id },
    { label: 'Business name', value: dealershipData?.data?.name },
    { label: 'Dealer name', value: mainApplicant?.data?.first_name },
    { label: 'Mobile', value: mainApplicant?.data?.mobile },
    { label: 'Email', value: mainApplicant?.data?.email }
  ]
  usePageTitle(`${id} - ${dealershipData && (dealershipData.name || '')} `, true, cardData)
  return (
    <>
      <Tabs 
        color="indigo"
        variant="pills" 
        orientation="vertical" 
        onChange={onChangeTab} 
        value={activeTab || 'dealership'}
        classNames={{
          root: 'gap-4',
          tabLabel: 'flex grow items-center gap-2',
          panel: 'h-full bg-white p-4 rounded-md'
        }}
      >
        <Tabs.List>
          {tabs.map((item, i) => {
            return (
              <Tabs.Tab 
                key={1} 
                value={item?.value}
              >
                <Badge size="sm" circle variant="white" color="indigo">{i + 1}</Badge> 
                
                {item?.name}
              </Tabs.Tab>
            )
          })
          }
        </Tabs.List>
        
        <Tabs.Panel value={'dealership'}>
          <DealershipInfo data={dealershipData.data} currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'dealers'}>
          <DealersList id={id} titleAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'score_card'}>
          <ScoreCard currentUser={currentUser} dealership_id={id} />
        </Tabs.Panel>
        <Tabs.Panel value={'loans_list'}>
          <LoansList id={id} titleAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'personal_discussion'}>
          <PersonalDiscussionReport id={id} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'documents'}>
          <DealershipDoc id={id} currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'transporters'}>
          <DealershipTransport id={id} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'fleet_operators'}>
          <FleetOperatorsDetails id={id} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
      </Tabs>


      {/* <div className={classes.tabsWrapper}>
        <div>
          <Collapse in={!showSolarForm}>
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={onChangeTab}
              aria-label="Dealership Details Panel"
              className={classes.tabs}
              TabIndicatorProps={{
                style: { display: 'none' }
              }}
            >
              {
                tabs.map((title, i) => {
                  return (<Tab key={1} label={<InfoBox active={activeTab === i} number={i + 1} title={title} />} {...tabA11yProps(i)} />)
                })
              }
            </Tabs>
          </Collapse>
        </div>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Dealership')}>
          {!dealershipData.isLoading && activeTab == tabs.indexOf('Dealership') && (
            <DealershipInfo data={dealershipData.data} currentUser={currentUser} />
          )}
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Dealers')}>
          {
            activeTab == tabs.indexOf('Dealers') &&
              <DealersList id={id} titleAlign="left" currentUser={currentUser} />
          }
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Score Card')}>
          {
            activeTab == tabs.indexOf('Score Card') &&
              <ScoreCard currentUser={currentUser} dealership_id={id} />
          }
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Loans List')}>
          {
            activeTab == tabs.indexOf('Loans List') &&
              <LoansList id={id} titleAlign="left" currentUser={currentUser} />
          }
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Personal Discussion')}>
          {
            activeTab == tabs.indexOf('Personal Discussion') &&
              <PersonalDiscussionReport id={id} textAlign="left" currentUser={currentUser} />
          }
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Documents')}>
          {
            activeTab == tabs.indexOf('Documents') &&
              <DealershipDoc id={id} currentUser={currentUser} />
          }
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Transporters')}>
          {
            activeTab == tabs.indexOf('Transporters') &&
              <DealershipTransport id={id} textAlign="left" currentUser={currentUser} />
          }
        </TabPanel>
        <TabPanel activeTab={activeTab} index={tabs.indexOf('Fleet Operators')}>
          {
            activeTab == tabs.indexOf('Fleet Operators') &&
              <FleetOperatorsDetails id={id} textAlign="left" currentUser={currentUser} />
          }
        </TabPanel>
      </div> */}

      <SolarEnquiryForm
        dealershipId={id}
        mainApplicant={mainApplicant}
        solarTab={solarTab}
        onChangeTab={setSolarTab}
        currentUser={currentUser}
        onClose={() => setShowSolarForm(false)}
      />

      <Dialog
        fullScreen
        scroll="paper"
        open={leegalityModalVisible}
        onClose={() => setLeegalityModalVisible(false)}
      >
        <DialogContent>
          <LeegalityLayout currentUser={currentUser} />
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
    </ >
  );
};

export default DealershipDetails;
