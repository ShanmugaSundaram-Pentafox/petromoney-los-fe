// import { useMount } from 'react-use';
import { Grid, Box, Badge } from '@material-ui/core';
// import { getAllWithheldLoans } from '../../services/withheld.services';
import React, { useState } from 'react';
import styled from 'styled-components';
import ResolvedTable from './ResolvedTable';
import UnresolvedTable from './UnResolvedTable';
import usePageTitle from '../../hooks/usePageTitle';


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
`;

const BlacklistTable = ({currentUser}) => {
  // const [loading, setLoading] = useState(false);
  const [resolvedData, setResolvedData] = useState([])
  const [unresolvedData, setUnresolvedData] = useState([])
  const [selectedTab, setSelectedTab] = useState('unresolved');
  usePageTitle('Withheld loan', true)

  // useMount(() => {
  //   getAllWithheldLoans()
  //     .then((data) => {
  //       setResolvedData(data.resolved)
  //       setUnresolvedData(data.unresolved)
  //     })
  //     .catch((e) => {
  //       setLoading(false)
  //       console.log(e);
  //     })
  // })

  return (
    <>
      <PaperWrapper>
        <Box borderRadius={4} bgcolor="background.paper">
          <Grid container>
            <Grid onClick={() => { setSelectedTab('unresolved')}} style={{ textAlign: 'center', padding: 16, borderRight: '1px dashed gray' }} className={selectedTab === 'unresolved' ? ' ' : 'active'} item md={6}>
              <Badge badgeContent={unresolvedData?.length} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                <div>Unresolved</div>
              </Badge>
            </Grid>
            <Grid onClick={() => { setSelectedTab('resolved') }} className={selectedTab === 'resolved' ? ' ' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={6}>
              <Badge badgeContent={resolvedData?.length} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                <div>Resolved</div>
              </Badge>
            </Grid>
          </Grid>
        </Box>
      </PaperWrapper>
      {
        selectedTab === 'unresolved' ? <UnresolvedTable currentUser={currentUser} /> : <ResolvedTable />
      }
    </>
  )
}
export default BlacklistTable;