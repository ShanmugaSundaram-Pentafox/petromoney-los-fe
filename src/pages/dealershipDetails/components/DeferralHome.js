import React, { useState, useEffect } from 'react';
import { Skeleton, Tabs, Badge, Text, Flex, Button, Modal } from '@mantine/core';
import { useQuery } from 'react-query';
import { getStatsData } from '../../../services/deferralDeviation.service';
import DeferralTable from './DeferralDeviationTables/DeferralTable';
import { IconPlus } from '@tabler/icons-react';
import DeferralForm from './DeferralDeviationTables/DeferralForm';
const tabStyle = ({ color }) => ({
  tab: {
    '&:is([aria-selected=true])': {
      color,
      fontWeight: 600,
      backgroundColor: '#f9f9f9',
    },
    '&:not([aria-selected=true])': {
      color: '#9b9b9b',
      '&: after': {
        content: '\'\'',
        display: 'block',
        margin: 'auto',
        height: '2px',
        width: '0px',
        background: 'transparent',
        transition: 'width .5s ease, background-color .5s ease',
        position: 'absolute',
        top: 0,
        bottom: '-41px',
        borderRadius: '5px',
      },
      '&: hover: after': {
        width: '100%',
        background: 'gray',
      },
    },
  },
})


const DeferralHome = ({ id,dealershipName }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [ openModal,setOpenModal] = useState(false);

  // const [selectedDate, setSelectedDate] = useState(data?.dob && parse(data?.dob, 'dd-MM-yyyy', new Date()))

  const { data: statusList, isLoading, refetch } = useQuery({
    queryKey: ['get-deferral-stats'],
    queryFn: () => getStatsData(id, 'deferral'),
    refetchOnWindowFocus: false
  });


  useEffect(() => {
    if (statusList && statusList.length > 0) {
      setActiveTab(statusList[0].current_status);
    }
  }, [statusList]);
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <Tabs
        value={'tab1'}
      >
        <Tabs.List>
          {[1, 2, 3, 4, 5]?.map((item, index) => (
            <Tabs.Tab
              key={index}
              color={'gray'}
              value={'tab' + item}
            >
              <Skeleton height={18} width={80} />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    )
  }

  return (
    <>
      <Flex align="center" justify="flex-end" mb="lg">
        {/* <Title order={3}>Deferral</Title> */}
        {/* <CheckAllowed currentUser={currentUser} resource={resources_id?.fleetOperator} action={action_id?.fleetOperator?.add}> */}
        <Button
          onClick={() => setOpenModal(true)}
          leftSection={<IconPlus size={18} />}
        >
          Add Deferral
        </Button>
        {/* </CheckAllowed> */}
      </Flex>
      <Modal size={'lg'} opened={openModal} onClose={()=> {setOpenModal(false)}} title="Create Deferral Data" centered>
        <DeferralForm refetch={refetch} dealershipName={dealershipName} dealershipId={id} close={()=>setOpenModal(false)} />
      </Modal>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
      // styles={tabStyle({ color: STATUS_COLORS[activeTab] })}
      >
        <Tabs.List mb={8}>
          {
            statusList?.map((item) => {
              let st = (item?.current_status).charAt(0).toUpperCase() + (item?.current_status).slice(1);
              return (
                <Tabs.Tab
                  key={item?.current_status}
                  // color={STATUS_COLORS[item?.current_status]}
                  rightSection={
                    <Badge variant='light'>
                      {item?.number_of_records}
                    </Badge>
                  }
                  value={item?.current_status}
                >
                  <Text style={{ fontWeight: 400, color: 'rgb(155, 155, 155)' }}>{st}</Text>
                </Tabs.Tab>
              );
            })
          }
        </Tabs.List>
        {
          statusList?.map((item) => {
            return (
              (activeTab === item.current_status) && (
                <>
                  <Tabs.Panel value={item?.current_status} >
                    <DeferralTable dealershipId={id} status={item?.current_status} refetchStats={refetch} />
                  </Tabs.Panel>
                </>
              )
            );
          })
        }
      </Tabs>
    </>
  );
}

export default DeferralHome;