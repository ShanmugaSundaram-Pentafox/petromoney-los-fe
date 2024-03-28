import { Grid, Paper, Title } from '@mantine/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import DashboardFilter from './components/DashboardFilter';
import LoansTable from './components/LoansTable';
import Currency from '../../../src/components/Number/Currency';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import { action_id, resources_id } from '../../config/accessControl';
// import usePageTitle from '../../hooks/usePageTitle';
import { getDealerDetails } from '../../services/dealers.service';
import { isAllowed } from '../../utils/cerbos';
import LoanStats from './components/LoanStats';

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
  // usePageTitle('Dashboard');
  const classes = useStyles();
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [selectedStatsCard, setSelectedStatsCard] = useState('Approved');
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
      {currentUser.role_name === 'DEALER' ? (
        <>
          <Paper shadow="xs" p="lg" radius="lg" mb="lg">
            <Title order={3} mb="sm" className="text-gray-700">
              Sanctioned Loan : <Currency value={dealerDetail.sanctioned_loan_amount} />
            </Title>

            {dealerChartData?.length ? (
              <dl className="grid grid-cols-3 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-4 lg:grid-cols-8">
                {dealerChartData?.map((item, i) => {
                  return (
                    <>
                      {item.name || item.count ? (
                        <DashCard
                          key={item.name + i}
                          selected={item.name === selectedStatsCard}
                          text={item.name}
                          value={item.name != 'Active Loans' ? (<Currency value={item.count} />) : item.count}
                          amount={item.amount}
                          action={() => handleClick(item.name)}
                        />
                      ) : null}
                    </>
                  )
                })}
              </dl>
            ) : null}
          </Paper>

          <LoansTable currentUser={currentUser} value={selectedReportStatsCard} />
        </>
      ) : (
        <>
          <Grid gutter={0}>
            <Grid.Col>
              <DashboardFilter
                filterQry={setFilterQry}
                setChartData={setChartData}
                setTotalLoans={setTotalLoans}
                filterType='Dashboard'
                filters={['zone', 'region', 'product', 'period']}
              />
            </Grid.Col>
            <Grid.Col mt={'xs'}>
              <LoanStats
                selectedStatsCard={selectedStatsCard}
                handleClick={handleClick}
                chartData={chartData}
                totalLoans={totalLoans}
              />
            </Grid.Col>
          </Grid>
          <LoansTable
            currentUser={currentUser}
            value={selectedStatsCard}
            handleClick={handleClick}
            chartData={chartData}
            filterQry={filterQry}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;