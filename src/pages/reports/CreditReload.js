import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import { useMount } from 'react-use';
import {
  getCreditReport
} from '../../services/users.service';
import { Grid } from '@material-ui/core';
import { Badge } from '@material-ui/core';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import CreditProcessedTable from './CreditProcessedTable';
import CreditNewRequestTable from './CreditNewRequestTable';

const PaperWrapper = styled.div`
margin-bottom:10px;
font-size:16px;
background-color: #f1f1f1;

.active {
    background-color: #f1f1f1;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }
`;

const useStyes = makeStyles((theme) => ({
  root: {},
}));

const CreditReload = ({ currentUser }) => {
  const [tableData, setTableData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("processed");

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
            <Grid onClick={() => { setSelectedTab("new") }} className={selectedTab === "new" ? 'active' : ' '} style={{ textAlign: 'center', padding: 16 }} item md={6}>
              <Badge badgeContent={tableData?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                <div>New Requests</div>
              </Badge>
            </Grid>
            <Grid onClick={() => { setSelectedTab("processed") }} style={{ textAlign: 'center', padding: 16, borderRight: '1px dashed gray' }} className={selectedTab === "processed" ? 'active' : ' '} item md={6}>
              <Badge badgeContent={processedData?.length || 0} style={{ paddingTop: 4, paddingRight: 8 }} color="primary">
                <div>Processed</div>
              </Badge>
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
