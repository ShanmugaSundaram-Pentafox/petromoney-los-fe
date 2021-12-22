import { Box, Grid } from '@material-ui/core';
import React, { useState } from 'react'
import styled from 'styled-components';
import NewCallRequest from './NewCallRequest';
import ProcessedCallRequest from './ProcessedCallRequest';

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
  const [selectedTab, setSelectedTab] = useState('new');


  return (
    <>
      <PaperWrapper>
        <Box borderRadius={4} bgcolor="background.paper">
          <Grid container>
            <Grid onClick={() => { setSelectedTab('new') }} className={selectedTab === 'new' ? 'inactive' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={6}>
              {/* <Badge badgeContent={tableData?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary"> */}
              <div>New Requests</div>
              {/* </Badge> */}
            </Grid>
            <Grid onClick={() => { setSelectedTab('processed') }} style={{ textAlign: 'center', padding: 16 }} className={selectedTab === 'processed' ? 'inactive' : 'active'} item md={6}>
              <div>Processed</div>
            </Grid>
          </Grid>
        </Box>
      </PaperWrapper>
      {
        selectedTab === 'new' ? (
          <NewCallRequest />
        ) : (
          <ProcessedCallRequest />
        )
      }
    </>
  )
}

export default CallRequestPage
