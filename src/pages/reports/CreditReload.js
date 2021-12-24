import { Grid, Badge, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Select from 'react-select'
import { useMount } from 'react-use';
import styled from 'styled-components';
import CreditNewRequestTable from './CreditNewRequestTable';
import CreditProcessedTable from './CreditProcessedTable';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getZones } from '../../services/common.service';
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
  const [selectedZone, setSelectedZone] = useState({label: 'ALL', value: 0});

  const { data: zones = []} = useQuery('zones', () => {return getZones()}, {refetchOnWindowFocus: false})

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
      <Box p={2} borderRadius={4} bgcolor="background.paper" style={{marginBottom: 10}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h5">Credit Statistics</Typography>
          <div>
            <Select options={zones} value={selectedZone} onChange={setSelectedZone}
              styles={{
                control: (provided) => ({
                  ...provided, 
                  borderColor: 'hsl(0, 0%, 90%)',
                  minHeight: 29,
                  marginRight: 10,
                  width: '11rem',
                  '&:hover': {
                    boxShadow: 'none',
                    minHeight: 29,
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  maxHeight: '29px',
                  padding: '0 6px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'initial'
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  maxHeight: '29px',
                  '> div': {
                    padding: 5
                  }
                }),
                indicatorContainer: (provided) => ({
                  ...provided,
                })
              }}
            />
          </div>
        </div>
        <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row">
          <DashCard text="Zone" value={selectedZone?.label || '-'} />
          <DashCard text="No.of. New Request" value={25} />
          <DashCard text="No.of. Processed Request" value={15} />
          <DashCard text="Total.Req. Amount" value={<Currency value={2560000} />} />
          <DashCard text="Total. Processed Amount" value={<Currency value={8560000} />} noBorder={true}/>
          {/* <DashCard text="Due (in Crs)" value={'Test4'} /> */}
          {/* <DashCard noBorder text="Current (in Crs)" value={'Test5'} /> */}
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
