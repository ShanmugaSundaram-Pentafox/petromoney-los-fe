import { Grid, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import { LineChart } from '../../pages/dashboard/components/MetricsComponents';
import { getDpdReportData, getProjectionReport } from '../../services/loans.service';
import Currency from '../Number/Currency';
import { permissionCheck } from '../UserCan/UserCan';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
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
  }
}));

const CustomToolTip = (date, day, amount, shortAmt) => {
  return`
  <div style='padding: 7px; width: 220px'>
    <h3>${date} - ${day}</h3>
    <p style='font-size: 12px; margin-top: 3px'>Due Amount: <strong>${currencyFormat(amount)} (${shortAmt} Cr)</strong></p>
  </div>
  `
}

const currencyFormat = (value) => {
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(value)
  return money;
}
const DpdReport = ({ title, currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dpdReportData, setDpdReportData] = useState()
  const [LineChartData, setLineChartData] = useState();
  const [projectionTableData, setProjectionTableData] = useState();
  usePageTitle('Report')

  useMount(() => {
    setLoading(true);
    getDpdReportData()
      .then(data => {
        setDpdReportData(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
    
    getProjectionReport()
      .then(data => {
        setProjectionTableData(data)
        let testData = data.reduce((temp, item, i) => {
          if (i === 0) {
            temp[i] = ['Date', 'Due Amount', { role: 'tooltip', type: 'string', p: { html: true }}];
          }
          temp[i+1] = [`${item.due_date.split('-')[0]}/${item.due_date.split('-')[1]}`,item.due_amount ,CustomToolTip(item.due_date, item.short_day, item.due_amount, item.short_amount)]
          return temp
        }, [])
        setLineChartData(testData);
      })
      .catch(e => console.log(e))
  });

  const columns = useMemo(() => {
    return [
      {
        label: 'Cust Name',
        name: 'customer_name',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Prospect Code',
        name: 'prospectcode',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Applicant Code',
        name: 'applicantcode',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Disbursal Date',
        name: 'disbursaldate',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Due Date',
        name: 'due_date',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'DPD',
        name: 'days_past_due',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            if(value >= 0){
              return(<span style={{color:'#FC4F4F'}}>{value}</span>)
            }else{
              return(<span>{value}</span>)
            }
          }
        }
      },
      {
        label: 'Last Receipt Date',
        name: 'last_receipt_date',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Loan Amount',
        name: 'loanamount',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <strong><Currency value={value}/></strong>
        }
      },
      {
        label: 'Loan Status',
        name: 'loanstatusname',
        options: {
          filter: true,
          sort: true,
        }
      }
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
  };

  return (
    <div className={classes.root}>
      {
        permissionCheck(currentUser.role_name, rulesList.projection_report) &&
          <>
            <Grid item md={12} style={{marginBottom: 20}}>
              <Paper>
                <LineChart chartData={LineChartData} title="Projection Graph" xAxis="Date" />
                <div className={classes.horizondalTable}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className={classes.tableHead}><strong>Date</strong></TableCell>
                        {
                      projectionTableData?.map((item, i) => {
                        return(
                          <TableCell key={i} className={classes.item}>{item.due_date}</TableCell>
                        )
                      })
                        }
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableHead}><strong>Day</strong></TableCell>
                        {
                      projectionTableData?.map((item, i) => {
                        return(
                          <TableCell key={i} className={classes.item}>{item.day}</TableCell>
                        )
                      })
                        }
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableHead}><strong>Due Amount</strong></TableCell>
                        {
                      projectionTableData?.map((item, i) => {
                        return(
                          <TableCell key={i} className={classes.item}>{currencyFormat(item.due_amount)}</TableCell>
                        )
                      })
                        }
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Paper>
            </Grid>
          </>
      }
      {
        Array.isArray(dpdReportData) && dpdReportData.length ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h4" component="h4">Dpd Report ({dpdReportData.length})</Typography>}
            data={dpdReportData}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }} >No Dpd Records</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

export default DpdReport;