import { Grid } from '@material-ui/core';
import { Badge } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useState } from 'react';
import { useMount } from 'react-use';
import styled from 'styled-components';
import CreditNewRequestTable from './CreditNewRequestTable';
import CreditProcessedTable from './CreditProcessedTable';
import {
  getCreditReport
} from '../../services/users.service';

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

const useStyes = makeStyles((theme) => ({
  root: {},
}));

const CreditReload = ({ currentUser }) => {
  const [tableData, setTableData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('new');

  useMount(async () => {
    setLoading(true)
    getCreditReport(0)
      .then((data) => {
        setTableData(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
    getCreditReport(1)
      .then((data) => {
        setProcessedData(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  });
  return (
    <>
      <PaperWrapper>
        <Box borderRadius={4} bgcolor="background.paper">
          <Grid container>
            <Grid onClick={() => { setSelectedTab('new') }} className={selectedTab === 'new' ? 'inactive' : 'active'} style={{ textAlign: 'center', padding: 16 }} item md={6}>
              <Badge badgeContent={tableData?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
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
        selectedTab === 'processed' ? <CreditProcessedTable data={processedData} currentUser={currentUser} /> : <CreditNewRequestTable data={tableData} currentUser={currentUser} />
      }
    </>
  );
};

export default CreditReload;
