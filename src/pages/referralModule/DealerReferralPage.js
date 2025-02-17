import React, { useState } from 'react'
import { useQuery } from 'react-query'
import ReferralTable from './ReferralTable'
import RejectedListTable from './RejectedTable'
import SettledListTable from './SettledListTable'
import { getDealershipReferral, getDealershipReferralRejectedList, getDealershipReferralSettledList } from '../../services/dealerships.service'
import { Badge, Loader, Tabs } from '@mantine/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  tab:{
    border:'1px solid #d3d3d3'
  }
}))


const DealerReferralPage = ({ currentUser }) => {
  const classes = useStyles();
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
      <Tabs.List grow >
        <Tabs.Tab value="new" className={classes.tab}>
          New<Badge variant={selectedTab === 'new' && 'white'} ml={'xs'}>{referralListLoading ? <Loader type='dots' size={'xs'} /> : referralList?.length}</Badge>
        </Tabs.Tab>
        <Tabs.Tab value="settled" className={classes.tab}>
          Settled
        </Tabs.Tab>
        <Tabs.Tab value="rejected" className={classes.tab}>
          Rejected
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='new' mt={'md'} >
        <ReferralTable currentUser={currentUser} loans={referralList} loading={referralListLoading} fetchData={refetchReferralList} />
      </Tabs.Panel>
      <Tabs.Panel value='settled' mt={'md'}>
        <SettledListTable loans={settledList} loading={settledListLoading} fetchData={refetchSettledList} />
      </Tabs.Panel>
      <Tabs.Panel value='rejected' mt={'md'}>
        <RejectedListTable loans={rejectedList} loading={rejectedListLoading} fetchData={refetchRejectedList} />
      </Tabs.Panel>
    </Tabs>
  )
}

export default DealerReferralPage