import React, { useState } from 'react';
import _countBy from 'lodash/countBy';

import { makeStyles } from '@material-ui/styles';
import LoansTable from './components/LoansTable';
import usePageTitle from '../../hooks/usePageTitle';
import Paper from '@material-ui/core/Paper';
import { InfoBoxContainer, InfoBoxWrapper } from '../../components/CommonComponents/InfoBox';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Tooltip, LabelList,Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, Text } from 'recharts';
import LoanBookTable from '../../components/Tables/LoanBookTable';
import { useMount } from 'react-use';
import { getAllLoans, getAll_ls1_Metrices, getAll_ls2_Metrices } from '../../services/loans.service';
import { SummaryTile, PieChartData, BarChartData } from './components/MetricsComponents';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 6,
    margin: 24,
    marginTop: 16,
    // marginBottom: 9,
  }
}));

const DataCharts = styled.div`
  /* padding: 20px 24px 8px; */
  border-radius: 2px;

  svg {
    border-radius: 6px;
  }
`;

const LoansNewTableContainer = styled.div`
  display: flex;
  padding: 12px;
`;

const LoansNewTableWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 50%;
  margin: 0 12px;

  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.33;
    margin-bottom: 16px;
  }
`;

const LoansNewTable = styled.div`
  width: 100%;
  height: 352px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 6px -6px rgba(0,0,0,0.12);
  overflow: hidden;
  overflow-y: scroll;

  .table-content {
    display: flex;
    align-items: center;
    padding: 16px 8px;
    cursor: pointer;

    &:hover {
      background-color: #F7F7F7;
    }

    .content {
      display: flex;
      width: 30%;
      padding: 0 12px;

      &.center {
        justify-content: center;
      }

      &:first-child {
        width: 40%;
      }
    }

    p {
      color: #504E58;
      font-size: 12px;
      line-height: 15px;
      font-weight: 400;
      margin-bottom: 0;

      span {
        display: block;
        color: #000000;
        font-size: 13px;
        line-height: 15px;
        font-weight: 400;
        margin-bottom: 4px;
      }
    }

    .table-pill {
      background-color: #e1f8e5;
      display: inline-block;
      color: #51b37f;
      border-radius: 29px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      min-width: 80px;
      text-align: center;

      &.red {
        color: #d35178;
        background-color: #f7eae8;
      }
    }

    .price-txt {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      margin-left: auto;
    }
  }
`;

const Dashboard = ({ currentUser }) => {
  const classes = useStyles();
  usePageTitle('Dashboard');
  const [chartData, setChartData] = useState([]);
  const [ ls1_metrices, setLs1Metrices ] = useState({});
  const [ ls2_metrices, setLs2Metrices ] = useState([]);
  const [ daysChartData, setdaysChartData ] = useState(['Days', 'Amount']);
  const [ totalForRegion, setTotalForRegion ] = useState(0)

  useMount(() => {
    getAllLoans()
      .then(res => {
        const data = _countBy(res, item => {
          return item.status.toLowerCase()
        });
        let cdata = [
          { name: 'Submitted', count: data.submitted },
          { name: 'Pending Approval', count: data.loan_approval || 0 },
          { name: 'Pending Disbursement Approval', count: data.disbursement_approval || 0 },
          { name: 'Approved', count: data.approved },
          { name: 'Rejected', count: data.rejected },
          { name: 'Disbursed', count: data.disbursed },
        ];
        setChartData(cdata);
      })
      .catch(err => {

      })

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
        const result =  res;
        let total = 0;
        const dataSource = result.map((item, index) => {
          total += item.od_amount;
          return [item.cust_region, item.od_amount]
        });
        dataSource.length && dataSource.unshift(['Region', 'Amount']);
        setTotalForRegion(total);
        setLs2Metrices(dataSource);
      })
  });

  const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
      <Text x={x} y={y} fill='#666' width={70} fontSize='12' fontWeight='bold' textAnchor="middle" verticalAnchor="start">{payload.value}</Text>
    )
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ padding: 12, paddingTop: 0 }} spacing={2}>
        <Grid item md={6}>
          <DataCharts>
            {Object.keys(ls1_metrices).length ? <SummaryTile ls1Data={ls1_metrices}/> : <Paper style={{ padding: 10 }}>No Data Found</Paper> }
          </DataCharts>
        </Grid>
        <Grid item md={6}>
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
        </Grid>
        <Grid item md={6}>
          <DataCharts>
            {ls2_metrices.length ? <PieChartData ls2Data={ls2_metrices} totalForRegion={totalForRegion}/> : <Paper style={{ padding: 10 }}>No Data Found. Check if EOD has been completed</Paper> }
          </DataCharts>
        </Grid>
        <Grid item md={6}>
          <DataCharts>
            <BarChartData daysChartData={daysChartData}/>
          </DataCharts>
        </Grid>
      </Grid>
      <Paper elevation={1} className={classes.tableContainer}>
        <LoanBookTable title={"Loan Book"} currentUser={currentUser}/>
      </Paper>

      <LoansTable currentUser={currentUser} />

    </div>
  );
}

export default Dashboard;