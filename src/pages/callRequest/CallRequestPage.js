import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import NewCallRequest from './NewCallRequest';
import ProcessedCallRequest from './ProcessedCallRequest';
import usePageTitle from '../../hooks/usePageTitle';
import { getCallbackRequest } from '../../services/callrequest.service';
import { Badge, Loader, Tabs } from '@mantine/core';

const PaperWrapper = styled.div`
margin-bottom:10px;
font-size:16px;
background-color: #f1f1f1;

.active {
    background-color: #f1f1f1;
    color: #b2b2b2;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }

.inactive {
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  }
`;


const CallRequestPage = () => {
  usePageTitle('Call Request');
  const [selectedTab, setSelectedTab] = useState('new');

  const { data: callbackData = [], isLoading: callBackDataLoading } = useQuery('new-request', () => getCallbackRequest(0), { refetchOnWindowFocus: false })
  const { data: callbackProcessed = [], isLoading: callBackProcessedLoading } = useQuery('processed-request', () => getCallbackRequest(1), { refetchOnWindowFocus: false })

  return (
    <>
      <Tabs value={selectedTab} onChange={setSelectedTab} variant="pills" >
        <Tabs.List grow>
          <Tabs.Tab value="new">
            New Requests<Badge variant={selectedTab === 'new' && 'white'} ml={'xs'}>{callBackDataLoading ? <Loader type='dots' size={'xs'} /> : callbackData?.length > 99 ? '99+' : callbackData?.length}</Badge>
          </Tabs.Tab>
          <Tabs.Tab value="processed">
            Processed
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='new' mt={'md'}>
          <NewCallRequest callbackData={callbackData} isLoading={callBackDataLoading} />
        </Tabs.Panel>
        <Tabs.Panel value='processed' mt={'md'}>
          <ProcessedCallRequest callbackProcessed={callbackProcessed} isLoading={callBackProcessedLoading} />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default CallRequestPage
