import { Grid, Badge, Box } from '@material-ui/core';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import styled from 'styled-components';
import CreditNewRequestTable from './CreditNewRequestTable';
import CreditProcessedTable from './CreditProcessedTable';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import {
  getCreditReport
} from '../../services/users.service';
import DashboardFilter from '../dashboard/components/DashboardFilter';

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

const CreditReload = ({ currentUser }) => {
  const [tableData, setTableData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('new');
  const [chartData, setChartData] = useState([])

  const view = permissionCheck(currentUser.role_name, rulesList.dealer_view)

  useMount(async () => {
    setLoading(true)
    getCreditReport(0)
      .then((data) => {
        let buffer = []
        if(view){
          data.forEach((item) => item.dealership_id === currentUser.dealership_id && buffer.push(item))
          setTableData(buffer)
        } else {
          setTableData(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
    getCreditReport(1)
      .then((data) => {
        let buffer = []
        if(view){
          data.forEach((item) => item.dealership_id === currentUser.dealership_id && buffer.push(item))
          setProcessedData(buffer)
        } else {
          setProcessedData(data)
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  });
  return (
    <>
      <DashboardFilter filterType='Credit Reload' setChartData={setChartData} filters={['zone', 'region', 'account', 'period']}/>
      <Box p={2} borderRadius={4} bgcolor="background.paper" style={{marginBottom: 10, marginTop: 10}}>
        <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row">
          <DashCard text="Zone" value={chartData[0]?.count?.length === 1 ? chartData[0]?.count[0]?.label : `${chartData[0]?.count[0]?.label} & ${chartData[0]?.count?.length - 1} more` || '-'} />
          {
            chartData.map((item, i) => {
              if(item.name !== 'Zone'){
                return(
                  <DashCard key={i} noBorder={i === chartData.length - 1} text={item.name} value={item.count ? item.count : <Currency value={item.amount}/> || '-'} />
                )
              }
            })
          }
        </Box>
      </Box>
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
        selectedTab === 'processed' ? <CreditProcessedTable data={processedData} currentUser={currentUser} view={view}/> : <CreditNewRequestTable data={tableData} currentUser={currentUser} view={view}/>
      }
    </>
  );
};

export default CreditReload;
