import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import DashboardFilter from './components/DashboardFilter';
import LoansTable from './components/LoansTable';
import LoanStats from './components/LoanStats';
import Currency from '../../../src/components/Number/Currency';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import { action_id, resources_id } from '../../config/accessControl';
import usePageTitle from '../../hooks/usePageTitle';
import { getDealerDetails } from '../../services/dealers.service';
import { isAllowed } from '../../utils/cerbos';

const currencyFormat = (value) => {
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(value)
  return money;
}

function createCustomHTMLContent({ label, data }) {
  return `
    <div style='padding: 5px; width: 200px'>
      <p style='font-size: 12px;'><strong>${label}</strong></p>
      <table>
        ${data.map(d => `<tr><td>${d.label}</td><td>: <strong> ${d.value === null ? '  -' : currencyFormat(d.value)}</strong></td></tr>`)}
      </table>
    </div>
  `;
}

const arrangeData = (res) => {
  const result = res.reduce((temp, item, i) => {
    if (i === 0) {
      const firstRow = item.data?.map(r => r.label);
      temp[i] = ['', { role: 'tooltip', type: 'string', p: { html: true } }, ...firstRow];
    }
    const dataRow = item.data.map(r => r.value || 0);
    temp[i + 1] = [item.label, createCustomHTMLContent(item), ...dataRow];
    return temp;
  }, [])
  return result;
}

const useStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      [theme.breakpoints.up('md')]: {
        flexWrap: 'nowrap',
      }
    }
  },
}))

const Dashboard = ({ currentUser }) => {
  usePageTitle('Dashboard');
  const classes = useStyles();
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [selectedStatsCard, setSelectedStatsCard] = useState('Submitted');
  const [selectedReportStatsCard, setSelectedReportStatsCard] = useState('Due');
  const [dealerDetail, setDealerDetail] = useState({});
  const [dealerChartData, setDealerChartData] = useState([]);
  const [filterQry, setFilterQry] = useState();

  const handleClick = (name) => {
    setSelectedStatsCard(name)
    setSelectedReportStatsCard(name)
  }


  useMount(() => {
    isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.dashboardDealer) &&
      getDealerDetails()
        .then((data) => {
          setDealerDetail(data);
          let tot_count = 0;
          data.due.map(tot => {
            tot_count += tot.tot_due
          })
          let dData = [
            { name: 'Active Loans', count: data.due.length + data.overdue.length },
            { name: 'Total Due Amount', count: tot_count }
          ]
          setDealerChartData(dData)
        })
        .catch((e) => {
          console.log(e);
        });
  });

  return (
    <div style={{ flexGrow: 1 }}>
      {
        currentUser.role_name === 'DEALER' ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box p={2} borderRadius={4} bgcolor="background.paper">
                  <Typography variant="h5">Sanctioned Loan : <Currency value={dealerDetail.sanctioned_loan_amount} /></Typography>
                  <Box className={classes.card} borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="nowrap">
                    {
                      dealerChartData.map((item, i) => (
                        <DashCard key={i} noBorder={i === dealerChartData.length - 1} value={item.name != 'Active Loans' ? (<Currency value={item.count} />) : item.count} text={item.name} action={() => handleClick(item.name)} />
                      ))
                    }
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <LoansTable currentUser={currentUser} value={selectedReportStatsCard} />
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DashboardFilter
                  filterQry={setFilterQry}
                  setChartData={setChartData}
                  setTotalLoans={setTotalLoans}
                  filterType='Dashboard'
                  filters={['zone', 'region', 'product', 'period']}
                />
              </Grid>
              <Grid item xs={12}>
                <LoanStats
                  selectedStatsCard={selectedStatsCard}
                  handleClick={handleClick}
                  chartData={chartData}
                  totalLoans={totalLoans}
                />
              </Grid>
            </Grid>
            <LoansTable currentUser={currentUser} value={selectedStatsCard} filterQry={filterQry} />
          </>
        )
      }
    </div>
  );
}

export default Dashboard;