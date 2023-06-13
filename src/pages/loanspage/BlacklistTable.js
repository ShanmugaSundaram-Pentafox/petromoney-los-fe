// import { useMount } from 'react-use';
import { Grid, Box } from '@material-ui/core';
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

const BlacklistTable = ({ currentUser }) => {
  const [selectedTab, setSelectedTab] = useState('unresolved');
  usePageTitle('Withheld loan', true)


  return (
    <>
      <PaperWrapper>
        <Box borderRadius={4} bgcolor="background.paper">
          <Grid container>
            <Grid onClick={() => { setSelectedTab('unresolved') }} style={{ textAlign: 'center', padding: 16, borderRight: '1px dashed gray' }} className={selectedTab === 'unresolved' ? ' ' : 'active'} item md={6}>
              <div>Unresolved</div>
            </Grid>
            <Grid onClick={() => { setSelectedTab('resolved') }} className={selectedTab === 'resolved' ? ' ' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={6}>
              <div>Resolved</div>
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