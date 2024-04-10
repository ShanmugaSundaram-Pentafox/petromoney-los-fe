import { Box, Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import ReferralTable from './ReferralTable'
import RejectedListTable from './RejectedTable'
import SettledListTable from './SettledListTable'
import { getDealershipReferral, getDealershipReferralRejectedList, getDealershipReferralSettledList } from '../../services/dealerships.service'
import { PaperWrapper } from '../reports/CreditReload'
import { Badge, Loader, Tabs } from '@mantine/core'

const DealerReferralPage = ({ currentUser }) => {

  const [selectedTab, setSelectedTab] = useState('new')

  const { data: referralList = [], isLoading: referralListLoading, refetch: refetchReferralList } = useQuery(
    ['new-request'],
    () => getDealershipReferral(),
    {
      enabled: Boolean(selectedTab === 'new'),
      refetchOnWindowFocus: false
    }
  );

  const { data: settledList = [], isLoading: settledListLoading, refetch: refetchSettledList } = useQuery(
    ['settled-request'],
    () => getDealershipReferralSettledList(),
    {
      enabled: Boolean(selectedTab === 'settled'),
      refetchOnWindowFocus: false
    }
  );

  const { data: rejectedList = [], isLoading: rejectedListLoading, refetch: refetchRejectedList } = useQuery(
    ['rejected-request'],
    () => getDealershipReferralRejectedList(),
    {
      enabled: Boolean(selectedTab === 'rejected'),
      refetchOnWindowFocus: false
    }
  );

  return (
    <Tabs value={selectedTab} onChange={setSelectedTab} variant="pills" >
      <Tabs.List grow>
        <Tabs.Tab value="new">
          New<Badge variant={selectedTab === 'new' && 'white'} ml={'xs'}>{referralListLoading ? <Loader type='dots' size={'xs'} /> : referralList?.length}</Badge>
        </Tabs.Tab>
        <Tabs.Tab value="settled">
          Settled
        </Tabs.Tab>
        <Tabs.Tab value="rejected">
          Rejected
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='new'>
        <ReferralTable currentUser={currentUser} loans={referralList} loading={referralListLoading} fetchData={refetchReferralList} />
      </Tabs.Panel>
      <Tabs.Panel value='settled'>
        <SettledListTable loans={settledList} loading={settledListLoading} fetchData={refetchSettledList} />
      </Tabs.Panel>
      <Tabs.Panel value='rejected'>
        <RejectedListTable loans={rejectedList} loading={rejectedListLoading} fetchData={refetchRejectedList} />
      </Tabs.Panel>
    </Tabs>
  )
}

export default DealerReferralPage