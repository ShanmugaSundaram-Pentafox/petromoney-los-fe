import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import styled from 'styled-components';
import DashboardFilter from './components/DashboardFilter';
import LoansTable from './components/LoansTable';
import LoanStats from './components/LoanStats';
import { PieChartData, BarChartData, GroupChartData } from './components/MetricsComponents';
import Currency from '../../../src/components/Number/Currency';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import LoanBookTable from '../../components/Tables/LoanBookTable';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import { getDealerDetails } from '../../services/dealers.service';
import { getAll_ls1_Metrices, getAll_ls2_Metrices, getAllOmcDpd, getAllRegionDpd } from '../../services/loans.service';
import { isAllowed } from '../../utils/cerbos';
import { action_id, resources_id } from '../../config/accessControl';
import CheckAllowed from '../rbac/CheckAllowed';
// import { getAll_ls1_Metrices, getAll_ls2_Metrices, getAllOmcDpd, getAllRegionDpd } from '../../services/loans.service';

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
  dataChart: {
    padding: 10,
    borderRadius: 5,
  },
  noData: {
    padding: 10
  },
  tableHead: {
    '&.MuiTableCell-root.MuiTableCell-body': {
      backgroundColor: '#eee',
      position: 'sticky',
      left: 0
    },
    fontSize: 10
  },
  item: {
    fontSize: 10
  },
  horizondalTable: {
    width: '100%',
    overflow: 'auto',
    marginTop: 15
  },
  filterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    border: '1px solid hsl(0, 0%, 90%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    minHeight: 32,
    boxSizing: 'border-box',
    padding: '0 4px',
  },
  filterItem: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 4,
    marginRight: 2,
    padding: '4px 10px',
    minWidth: 50,
    textAlign: 'center',
    border: 'none',
    backgroundColor: 'hsl(0, 0%, 100%)',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      backgroundColor: 'hsl(0, 0%, 95%)',
    },
    '&.active': {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
    '&.disabled': {
      backgroundColor: 'hsl(0, 0%, 80%)',
      padding: '4px 8px',
      marginTop: 6,
      borderRadius: 8,
    },
    '&:last-child': {
      marginRight: 0,
      '&::after': {
        display: 'none',
      }
    }
  },
  creditBookHeader: {
    display: 'flex', alignItems: 'center'
  },
  label: {
    color: 'hsl(0,0%,75%)'
  },
  creditView: {
    display: 'flex', alignItems: 'center'
  }
}))
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
  const classes = useStyles();
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [ls1_metrices, setLs1Metrices] = useState({});
  const [ls2_metrices, setLs2Metrices] = useState([]);
  const [daysChartData, setdaysChartData] = useState(['Days', 'Amount']);
  const [totalForRegion, setTotalForRegion] = useState(0)
  const [selectedStatsCard, setSelectedStatsCard] = useState('Submitted');
  const [selectedReportStatsCard, setSelectedReportStatsCard] = useState('Due');
  const [dealerDetail, setDealerDetail] = useState({});
  const [dealerChartData, setDealerChartData] = useState([]);
  const [omcData, setOmcData] = useState([]);
  const [RegionData, setRegionData] = useState([]);
  const [filterQry, setFilterQry] = useState();
  const [creditBook, setCreditBook] = useState(permissionCheck(currentUser.role_name, rulesList.external_view) ? 'External' : 'Petromoney')

  const handleClick = (name) => {
    setSelectedStatsCard(name)
    setSelectedReportStatsCard(name)
  }

  const onCreditBookChange = type => {
    setCreditBook(type)
  }

  useEffect(() => {
    getAllOmcDpd(creditBook)
      .then((res) => {
        const result = arrangeData(res)
        setOmcData(result)
      })
      .catch(e => {
        console.log(e);
      })

    getAllRegionDpd(creditBook)
      .then((res) => {
        const result = arrangeData(res)
        setRegionData(result)
      })
      .catch(e => {
        console.log(e);
      })

    getAll_ls1_Metrices(creditBook)
      .then(res => {
        const result = res[0] || {};
        setLs1Metrices(result);
        let overallData = [
          ['Days', 'Amount', { role: 'tooltip', type: 'string', p: { html: true } }, { role: 'style' }, { role: 'annotation' }],
          ['<=3 Days', result.lt3_days, currencyFormat(result.lt3_days), '#81B214', currencyFormat(result.lt3_days)],
          ['4-15 Days', result.gt4lt15_days, currencyFormat(result.gt4lt15_days), '#5C7AEA', currencyFormat(result.gt4lt15_days)],
          ['15-30 Days', result.gt15lt30_days, currencyFormat(result.gt15lt30_days), '#8236CB', currencyFormat(result.gt15lt30_days)],
          ['30-60 Days', result.gt30lt60_days, currencyFormat(result.gt30lt60_days), '#FF9300', currencyFormat(result.gt30lt60_days)],
          ['60-90 Days', result.gt60lt90_days, currencyFormat(result.gt60lt90_days), '#FF6767', currencyFormat(result.gt60lt90_days)],
          ['>=90 Days', result.gt90_days, currencyFormat(result.gt90_days), '#E02401', currencyFormat(result.gt90_days)],
        ]
        setdaysChartData(overallData);
      })
      .catch(err => {
        console.log(err)
      })

    getAll_ls2_Metrices(creditBook)
      .then(res => {
        const result = res;
        let total = 0;
        const colors = ['#4cba6b', '#5899DA', '#E8743B', '#19A979', '#ED4A7B', '#945ECF', '#13A4B4', '#525DF4', '#BF399E', '#6C8893', '#EE6868', '#2F6497', '#f5b04d', '#8a3800', '#008B73', '#42C1AA', '#00A8D2', '#6929c4', '#4589ff']
        const dataSource = result.map((item, index) => {
          total += item.od_amount;
          return [item.cust_region, item.od_amount, colors[index], currencyFormat(item.od_amount)]
        });
        dataSource.length && dataSource.unshift(['Region', 'Amount', { role: 'style' }, { role: 'annotation' },]);
        setTotalForRegion(currencyFormat(total));
        setLs2Metrices(dataSource);
      })
      .catch(err => {
        console.log(err)
      })
  }, [creditBook]);
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
              {
                dashboardView === 'LOS' && (
                  <Grid item xs={12}>
                    <DashboardFilter 
                      filterQry={setFilterQry}
                      setChartData={setChartData}
                      setTotalLoans={setTotalLoans}
                      filterType='Dashboard'
                      filters={['zone', 'region', 'product', 'period']}
                    />
                  </Grid>
                )
              }
              <Grid item xs={12}>
                {
                  dashboardView === 'LOS' && (
                    <LoanStats
                      selectedStatsCard={selectedStatsCard}
                      handleClick={handleClick}
                      chartData={chartData}
                      totalLoans={totalLoans}
                    />
                  )
                }
                {
                  dashboardView === 'LMS' ? (
                    <Box p={2} borderRadius={4} bgcolor="background.paper">
                      <div className={classes.creditBookHeader}>
                        <Typography variant="h5" style={{width: 120}}>Credit Book</Typography>
                        {
                          // Access control for show and hide external charts switch in LMS
                          <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'vivriti'}>
                            <div className={classes.creditView}>
                              <Box>
                                <div className={classes.filterWrapper}>
                                  <div role="button" className={`${classes.filterItem} ${creditBook === 'Petromoney' && 'active'}`} onClick={() => onCreditBookChange('Petromoney')} onKeyDown>Petromoney</div>
                                  <div role="button" className={`${classes.filterItem} ${creditBook === 'External' && 'active'}`} onClick={() => onCreditBookChange('External')} onKeyDown>Vivriti</div>
                                </div>
                              </Box>
                            </div>
                          </CheckAllowed>
                        }
                      </div>
                      <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row">
                        <DashCard text="Date (Opening)" value={ls1_metrices.opening ? format(new Date(ls1_metrices.opening?.split(' ')?.[0]), 'dd MMM, yyyy') : '-'} />
                        <DashCard text="Loan Book (in Crs)" value={Number(ls1_metrices.loan_book)?.toFixed(2)} />
                        <DashCard text="Overdue (in Crs)" value={Number(ls1_metrices.overdue)?.toFixed(2)} />
                        <DashCard text="Due (in Crs)" value={Number(ls1_metrices.due)?.toFixed(2)} />
                        <DashCard noBorder text="Current (in Crs)" value={Number(ls1_metrices.current1)?.toFixed(2)} />
                      </Box>
                    </Box>
                  ) : null
                }
              </Grid>
              {
                dashboardView === 'LMS' && (<>
                  <Grid item md={12}>
                    <DataCharts>
                      {ls2_metrices.length ? <PieChartData ls2Data={ls2_metrices} totalForRegion={totalForRegion} /> : <Paper className={classes.noData}>No Data Found. Check if EOD has been completed</Paper>}
                    </DataCharts>
                  </Grid>
                  <div style={{ width: '50%' }}>
                    <Grid item md={12} style={{ margin: '10px' }}>
                      <DataCharts>
                        <BarChartData daysChartData={daysChartData} title='DPD Wise' yAxis='Amount' />
                      </DataCharts>
                    </Grid>
                    <Grid item md={12} style={{ margin: '10px', marginTop: 17 }}>
                      <DataCharts>
                        {
                          omcData.length ? (
                            <GroupChartData chartData={omcData} title={'OMC Vs DPD Wise'} height='300px' xAxis='Amount' yAxis='OMCs' />
                          ) : (
                            <Paper className={classes.noData}>
                              <Typography variant='h7'>No Data Found. Check if EOD has been completed</Typography>
                            </Paper>
                          )
                        }
                      </DataCharts>
                    </Grid>
                  </div>
                  <Grid item xs={6}>
                    <DataCharts>
                      {
                        RegionData.length ? (
                          <GroupChartData chartData={RegionData} title={'Region Vs DPD Wise'} height='650px' xAxis='Amount' yAxis='Region' />
                        ) : (
                          <Paper className={classes.noData}>
                            <Typography variant='h7'>No Data Found. Check if EOD has been completed</Typography>
                          </Paper>
                        )
                      }
                    </DataCharts>
                  </Grid>
                  <Grid item xs={12}>
                    <LoanBookTable title={'Loan Book'} currentUser={currentUser} view={creditBook} />
                  </Grid>
                </>
                )
              }
            </Grid>
            {
              dashboardView === 'LOS' && (
                <LoansTable currentUser={currentUser} value={selectedStatsCard} filterQry={filterQry}/>
              )
            }
          </>
        )
      }
    </div>
  );
}

const mapStateToProps = ({ common }) => ({ dashboardView: common.dashboardView });

export default connect(mapStateToProps)(Dashboard);