import { Badge, Box, Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import ReferralTable from './ReferralTable'
import RejectedListTable from './RejectedTable'
import SettledListTable from './SettledListTable'
import { getDealershipReferral, getDealershipReferralRejectedList, getDealershipReferralSettledList } from '../../services/dealerships.service'
import { PaperWrapper } from '../reports/CreditReload'

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
    ['settled-request'],
    () => getDealershipReferralRejectedList(),
    {
      enabled: Boolean(selectedTab === 'rejected'),
      refetchOnWindowFocus: false
    }
  );

  return (
    <>
      <PaperWrapper>
        <Box borderRadius={4} bgcolor="background.paper">
          <Grid container>
            <Grid onClick={() => { setSelectedTab('new') }} className={selectedTab === 'new' ? 'inactive' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={4}>
              <Badge badgeContent={referralList?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                <div>New</div>
              </Badge>
            </Grid>
            <Grid onClick={() => { setSelectedTab('settled') }} style={{ textAlign: 'center', padding: 16 }} className={selectedTab === 'settled' ? 'inactive' : 'active'} item md={4}>
              <div>Settled</div>
            </Grid>
            <Grid onClick={() => { setSelectedTab('rejected') }} style={{ textAlign: 'center', padding: 16 }} className={selectedTab === 'rejected' ? 'inactive' : 'active'} item md={4}>
              <div>Rejected</div>
            </Grid>
          </Grid>
        </Box>
      </PaperWrapper>
      {selectedTab === 'new' &&
        <ReferralTable currentUser={currentUser} loans={referralList} loading={referralListLoading} fetchData={refetchReferralList}  />
      }
      {selectedTab === 'settled' &&
        <SettledListTable loans={settledList} loading={settledListLoading} fetchData={refetchSettledList}  />
      }
      {selectedTab === 'rejected' &&
        <RejectedListTable loans={rejectedList} loading={rejectedListLoading} fetchData={refetchRejectedList}  />
      }
    </>
  )
}

export default DealerReferralPage