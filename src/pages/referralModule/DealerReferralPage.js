import { Badge, Box, Grid } from '@material-ui/core'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import ReferralTable from './ReferralTable'
import { getDealershipReferral } from '../../services/dealerships.service'
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
    ['new-request'],
    () => getDealershipReferral(),
    {
      enabled: Boolean(selectedTab === 'settled'),
      refetchOnWindowFocus: false
    }
  );

  return (
    <>
      <PaperWrapper>
        <Box borderRadius={4} bgcolor="background.paper">
          <Grid container>
            <Grid onClick={() => { setSelectedTab('new') }} className={selectedTab === 'new' ? 'inactive' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={6}>
              <Badge badgeContent={referralList?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                <div>New</div>
              </Badge>
            </Grid>
            <Grid onClick={() => { setSelectedTab('settled') }} style={{ textAlign: 'center', padding: 16 }} className={selectedTab === 'settled' ? 'inactive' : 'active'} item md={6}>
              <div>Settled</div>
            </Grid>
          </Grid>
        </Box>
      </PaperWrapper>
      {selectedTab === 'new' ?
        <ReferralTable currentUser={currentUser} loans={referralList} loading={referralListLoading} fetchData={refetchReferralList}  />
        : null
      }
    </>
  )
}

export default DealerReferralPage