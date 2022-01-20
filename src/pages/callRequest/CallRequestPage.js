import { Box, Grid, Badge } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import NewCallRequest from './NewCallRequest';
import ProcessedCallRequest from './ProcessedCallRequest';
import { getCallbackRequest } from '../../services/callrequest.service';

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

  const { data: callbackData = [], isLoading } = useQuery('new-request', () => getCallbackRequest(0), {refetchOnWindowFocus: false})
  const { data: callbackProcessed = [] } = useQuery('processed-request', () => getCallbackRequest(1), {refetchOnWindowFocus: false})

  return (
    <>
      {
        isLoading ?
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Skeleton variant='rectangular' height={60} />
            </Grid>
            <Grid item md={6}>
              <Skeleton variant='rectangular' height={60} />
            </Grid>
            <Grid item md={12}>
              <Skeleton variant='rectangular' height={400} />
            </Grid>
          </Grid>
          :
          <>
            <PaperWrapper>
              <Box borderRadius={4} bgcolor="background.paper">
                <Grid container>
                  <Grid onClick={() => { setSelectedTab('new') }} className={selectedTab === 'new' ? 'inactive' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={6}>
                    <Badge badgeContent={callbackData?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                      <div>New Requests</div>
                    </Badge>
                  </Grid>
                  <Grid onClick={() => { setSelectedTab('processed') }} style={{ textAlign: 'center', padding: 16 }} className={selectedTab === 'processed' ? 'inactive' : 'active'} item md={6}>
                    <div>Processed</div>
                  </Grid>
                </Grid>
              </Box>
            </PaperWrapper>
            {
              selectedTab === 'new' ? (
                <NewCallRequest callbackData={callbackData} />
              ) : (
                <ProcessedCallRequest callbackProcessed={callbackProcessed} />
              )
            }
          </>
      }
    </>
  )
}

export default CallRequestPage
