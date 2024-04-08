import { Tabs, Text, Box, Card, Title, Group } from '@mantine/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import DealershipInfo from './components/DealershipInfo';
import DealersList from './components/DealersList';
import DealershipDoc from './components/DocList';
import LoansList from './components/LoansList';
import PersonalDiscussionReport from './components/PDReport';
import ScoreCard from './components/ScoreCard';
import SolarEnquiryForm from './components/SolarEnquiryForm';
import LeegalityLayout from '../../components/Leegality/LeegalityLayout';
import { action_id, resources_id } from '../../config/accessControl';
import { getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById } from '../../services/dealerships.service';
import { isAllowed } from '../../utils/cerbos';
import DeferralTable from './components/DeferralDeviationTables/DeferralTable';
import { IconBriefcase, IconListDetails, IconPinEnd, IconPinInvoke, IconRouteScan, IconScoreboard, IconUserScan, IconUsersGroup } from '@tabler/icons-react';
import DeviationTable from './components/DeferralDeviationTables/DeviationTable';


const DealershipDetails = ({ currentUser, match }) => {
  const [activeTab, setActiveTab] = useState('dealership');
  const [solarTab, setSolarTab] = useState(-1);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [showSolarForm, setShowSolarForm] = useState();
  const [dealershipReadOnly, setDealershipReadOnly] = useState(true);
  const [leegalityModalVisible, setLeegalityModalVisible] = useState(false);
  const history = useHistory();
  // const financialReport_permission = permissionCheck(currentUser.role_name, rulesList.financial_view);

  const pageData = [
    {
      id: action_id?.dealershipNavigation?.dealership,
      name: 'Dealership',
      value: 'dealership',
      icon: IconUserScan
    },
    {
      id: action_id?.dealershipNavigation?.dealers,
      name: 'Dealers',
      value: 'dealer',
      icon: IconUsersGroup
    },
    {
      id: action_id?.dealershipNavigation?.scoreCard,
      name: 'Score Card',
      value: 'score_card',
      icon: IconScoreboard,
    },
    {
      id: action_id?.dealershipNavigation?.loansList,
      name: 'Loans List',
      value: 'loans_list',
      icon: IconListDetails,
    },
    {
      id: action_id?.dealershipNavigation?.personalDiscussion,
      name: 'Personal Discussion',
      value: 'personal_discussion',
      icon: IconRouteScan
    },
    {
      id: action_id?.dealershipNavigation?.docChecklist,
      name: 'Documents',
      value: 'documents',
      icon: IconBriefcase
    },
    // {
    //   id: action_id?.dealershipNavigation?.transporters,
    //   name: 'Transporters',
    //   value: 'transporter'
    // },
    // {
    //   id: action_id?.dealershipNavigation?.fleetOperator,
    //   name: 'Fleet Operators',
    //   value: 'fleet_operators'
    // },
    {
      id: action_id?.dealershipNavigation?.fleetOperator,
      name: 'Deferral',
      value: 'deferral',
      icon: IconPinEnd
    },
    {
      id: action_id?.dealershipNavigation?.fleetOperator,
      name: 'Deviation',
      value: 'deviation',
      icon: IconPinInvoke
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
    setDealershipReadOnly(true);
    history.replace(`?t=${newTab}`)
  }

  useMount(() => {
    const queryString = window.location.hash;
    const test = queryString.split('=');
    setActiveTab(test[1])
  });
  let cardData = [
    { label: 'Dealership ID', value: dealershipData?.data?.id },
    { label: 'Business name', value: dealershipData?.data?.name },
    { label: 'Dealer name', value: mainApplicant?.data?.first_name, },
    { label: 'Mobile', value: mainApplicant?.data?.mobile },
    { label: 'Email', value: mainApplicant?.data?.email }
  ]
  // usePageTitle(`${id} - ${dealershipData && (dealershipData.name || '')} `, true, cardData)

  return (
    <Box style={{ maxWidth: 1200 }}>
      <Group gap={6}>
        <Title my={4} order={2}>{dealershipData?.data?.name}</Title>
        <Text>({dealershipData?.data?.id})</Text>
      </Group>
      <Card radius={'md'} my={'md'} p={0}>
        {typeof cardData !== 'string' && (
          <div className="hidden lg:block py-3">
            <dl className="grid grid-flow-col auto-cols-max overflow-hidden divide-x divide-gray-200">
              {Array.isArray(cardData) && cardData.map((item, i) => (
                <div key={item.name + i} className="px-4">
                  <dt className="text-xs font-normal text-gray-400 mb-[2px]">
                    {item.label}
                  </dt>
                  <dd style={{ minWidth: '150px', fontSize: 14, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'black' }}>
                    {item.value || '-'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Card>

      <Tabs
        // color="blue.1"
        variant="pills"
        orientation="vertical"
        color={'##5a67f500'}
        onChange={onChangeTab}
        value={activeTab}
        defaultValue={'dealership'}
        styles={{
          tab: {
            paddingBottom: 5,
            paddingTop: 5,
          }
        }}
        classNames={{
          root: 'gap-4',
          tabLabel: 'flex grow items-center gap-2',
          panel: 'h-full bg-white p-4 rounded-md',
          list: 'gap-0',
        }}
      >
        <Tabs.List>
          {tabs.map((item, i) => {
            return (
              <Tabs.Tab
                key={1}
                value={item?.value}
                leftSection={<item.icon size={16} color={(item?.value) === activeTab ? '#5a67f5' : '#2b2b2b'} />}
              >
                <Text c={(item?.value) === activeTab ? '#5a67f5' : '#2b2b2b'}>{item?.name}</Text>
              </Tabs.Tab>
            )
          })
          }
        </Tabs.List>

        <Tabs.Panel value={'dealership'}>
          <DealershipInfo viewOnly={dealershipReadOnly} setViewOnly={setDealershipReadOnly} data={dealershipData.data} isLoading={dealershipData?.isLoading} currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'dealer'}>
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
        {/* <Tabs.Panel value={'transporter'}>
          <DealershipTransport id={id} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'fleet_operators'}>
          <FleetOperatorsDetails id={id} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel> */}
        <Tabs.Panel value={'deferral'}>
          <DeferralTable id={id} dealershipName={dealershipData?.data?.name} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
        <Tabs.Panel value={'deviation'}>
          <DeviationTable id={id} dealershipName={dealershipData?.data?.name} textAlign="left" currentUser={currentUser} />
        </Tabs.Panel>
      </Tabs>

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
    </Box>
  );
};

export default DealershipDetails;
