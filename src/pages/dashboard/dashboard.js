import React, { useState } from 'react';
import _countBy from 'lodash/countBy';
import { useMount } from 'react-use';
import { connect } from 'react-redux';
import LoansTable from './components/LoansTable';
import usePageTitle from '../../hooks/usePageTitle';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
// import { InfoBoxContainer, InfoBoxWrapper } from '../../components/CommonComponents/InfoBox';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton';
// import { Tooltip, LabelList,Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, Text } from 'recharts';
import LoanBookTable from '../../components/Tables/LoanBookTable';
import { getLoanStats, getAll_ls1_Metrices, getAll_ls2_Metrices } from '../../services/loans.service';
import { SummaryTile, PieChartData, BarChartData } from './components/MetricsComponents';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import { Typography } from '@material-ui/core';
import { yellow } from '@material-ui/core/colors';


const DataCharts = styled.div`
  /* padding: 20px 24px 8px; */
  border-radius: 2px;
  width: 100%;

  svg {
    border-radius: 6px;
  }
`;
const Dashboard = ({ currentUser, dashboardView }) => {
  usePageTitle('Dashboard');
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [ls1_metrices, setLs1Metrices] = useState({});
  const [ls2_metrices, setLs2Metrices] = useState([]);
  const [daysChartData, setdaysChartData] = useState(['Days', 'Amount']);
  const [totalForRegion, setTotalForRegion] = useState(0)
  const [selectedStatsCard, setSelectedStatsCard] = useState("Submitted");

  const handleClick = (name) => {
    setSelectedStatsCard(name)
  }
  useMount(() => {
    getLoanStats()
      .then(data => {
        // const data = _countBy(res, item => {
        //   return item.status?.toLowerCase()
        // });
        let cdata = [
          { name: 'Submitted', count: data.submitted_count },
          { name: 'Pending Approval', count: data.loan_approval_count || 0 },
          { name: 'Pending Disbursement Approval', count: data.disbursement_approval_count || 0 },
          { name: 'Approved', count: data.approved_count },
          { name: 'Rejected', count: data.rejected_count },
          { name: 'Disbursed', count: data.disbursed_count },
        ];
        setChartData(cdata);
      })
      .catch(err => {
        console.log(err);
      })

    setTimeout(() => {
      getAll_ls1_Metrices().then(res => {
        const result = res[0] || {};
        setLs1Metrices(result);
        let overallData = [
          ['Days', 'Amount'],
          ['>=90 Days', result.gt90_days],
          ['60-90 Days', result.gt60lt90_days],
          ['30-60 Days', result.gt30lt60_days],
          ['15-30 Days', result.gt15lt30_days],
          ['4-15 Days', result.gt4lt15_days],
          ['<=3 Days', result.lt3_days]
        ]
        setdaysChartData(overallData);
      }).catch(err => {

      })

      getAll_ls2_Metrices().then(res => {
        const result = res;
        let total = 0;
        const dataSource = result.map((item, index) => {
          total += item.od_amount;
          return [item.cust_region, item.od_amount]
        });
        dataSource.length && dataSource.unshift(['Region', 'Amount']);
        setTotalForRegion(total);
        setLs2Metrices(dataSource);
      })
    }, 4000)
  });

  // const CustomizedAxisTick = ({ x, y, payload }) => {
  //   return (
  //     <Text x={x} y={y} fill='#666' width={70} fontSize='12' fontWeight='bold' textAnchor="middle" verticalAnchor="start">{payload.value}</Text>
  //   )
  // }

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {
            Array.isArray(chartData) && dashboardView === "LOS" && (
              <Box p={2} borderRadius={4} bgcolor="background.paper">
                <Typography variant="h5">Loans' Statistics</Typography>
                <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="wrap">
                  {
                    chartData.map((item, i) => (
                      <DashCard key={i} noBorder={i === chartData.length - 1} value={item.count} text={item.name} selected={item.name === selectedStatsCard} action={() => handleClick(item.name)} />
                    ))
                  }
                </Box>
              </Box>
            )
          }
          {
            dashboardView === "LMS" ? (
              <Box p={2} borderRadius={4} bgcolor="background.paper">
                <Typography variant="h5">Credit Book</Typography>
                <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row">
                  <DashCard text="Date (Opening)" value={ls1_metrices.opening ? moment(new Date(ls1_metrices.opening)).format('DD MMM, YYYY') : '-'} />
                  <DashCard text="Loan Book (in Crs)" value={Number(ls1_metrices.loan_book)?.toFixed(2)} />
                  <DashCard text="Overdue (in Crs)" value={Number(ls1_metrices.overdue)?.toFixed(2)} />
                  <DashCard text="Due (in Crs)" value={Number(ls1_metrices.due)?.toFixed(2)} />
                  <DashCard noBorder text="Current (in Crs)" value={Number(ls1_metrices.current1)?.toFixed(2)} />
                </Box>
              </Box>
            ) : null
          }
        </Grid>
        {/* {
          dashboardView === "LMS" && (
            <Grid item md={6}>
              <DataCharts>
                {Object.keys(ls1_metrices).length ? <SummaryTile ls1Data={ls1_metrices}/> : <Paper style={{ padding: 10 }}>No Data Found</Paper> }
              </DataCharts>
            </Grid>
          )
        } */}
        {/* <Grid item md={6}>
          <DataCharts>
            {
              chartData.length ? (
                <InfoBoxWrapper style={{ width: '100%'}}>
                  <p>Loans</p>
                  <BarChart
                    width={540}
                    height={260}
                    data={chartData}
                    style={{ fontSize: '14px'}}
                    label
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} tick={<CustomizedAxisTick />} height={40} />
                    <YAxis type="number" domain={[0, 200]}/>
                    <Tooltip />
                    <Bar dataKey="count" fill="rgb(66, 133, 244)" barSize={30}>
                      <LabelList position="top" />
                    </Bar>
                  </BarChart>
                </InfoBoxWrapper>
              ) : null
            }
          </DataCharts>
        </Grid> */}
        {
          dashboardView === "LMS" && (<>
            <Grid item md={6}>
              <DataCharts>
                {ls2_metrices.length ? <PieChartData ls2Data={ls2_metrices} totalForRegion={totalForRegion} /> : <Paper style={{ padding: 10 }}>No Data Found. Check if EOD has been completed</Paper>}
              </DataCharts>
            </Grid>
            <Grid item md={6}>
              <DataCharts>
                <BarChartData daysChartData={daysChartData} />
              </DataCharts>
            </Grid>
            <Grid item xs={12}>
              <LoanBookTable title={"Loan Book"} currentUser={currentUser} />
            </Grid>
          </>
          )
        }
      </Grid>

      {
        dashboardView === "LOS" && (
          <LoansTable currentUser={currentUser} value={selectedStatsCard} />
        )
      }

    </div>
  );
}

const mapStateToProps = ({ common }) => ({ dashboardView: common.dashboardView });

export default connect(mapStateToProps)(Dashboard);