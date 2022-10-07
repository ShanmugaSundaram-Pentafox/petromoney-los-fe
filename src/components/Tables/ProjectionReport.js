import { Grid, makeStyles, Paper, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import React, {useState} from 'react'
import { useMount } from 'react-use'
import { LineChart } from '../../pages/dashboard/components/MetricsComponents'
import { getProjectionReport, getVivProjectionReport } from '../../services/loans.service'

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
}))

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

const ProjectionReport = ({currentUser}) => {
  const classes = useStyles();
  const [LineChartData, setLineChartData] = useState();
  const [vivLineChartData, setVivLineChartData] = useState();
  const [projectionTableData, setProjectionTableData] = useState();
  const [vivProjectionTableData, setVivProjectionTableData] = useState();

  useMount(() => {
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
    getVivProjectionReport()
      .then(data => {
        setVivProjectionTableData(data)
        let testData = data.reduce((temp, item, i) => {
          if (i === 0) {
            temp[i] = ['Date', 'Due Amount', { role: 'tooltip', type: 'string', p: { html: true }}];
          }
          temp[i+1] = [`${item.due_date.split('-')[0]}/${item.due_date.split('-')[1]}`,item.due_amount ,CustomToolTip(item.due_date, item.short_day, item.due_amount, item.short_amount)]
          return temp
        }, [])
        setVivLineChartData(testData);
      })
      .catch(e => console.log(e))
  });

  return (
    <div>
      {
        <>
          <Grid item md={12} style={{marginBottom: 20}}>
            <Paper>
              <LineChart chartData={LineChartData} title="Projection Graph - Green Malabar Finance Ventures Limited" xAxis="Date" />
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
          <Grid item md={12} style={{marginBottom: 20}}>
            <Paper>
              <LineChart chartData={vivLineChartData} title="Projection Graph - Vivriti Capital Private limited" xAxis="Date" />
              <div className={classes.horizondalTable}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.tableHead}><strong>Date</strong></TableCell>
                      {
                      vivProjectionTableData?.map((item, i) => {
                        return(
                          <TableCell key={i} className={classes.item}>{item.due_date}</TableCell>
                        )
                      })
                      }
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableHead}><strong>Day</strong></TableCell>
                      {
                      vivProjectionTableData?.map((item, i) => {
                        return(
                          <TableCell key={i} className={classes.item}>{item.day}</TableCell>
                        )
                      })
                      }
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableHead}><strong>Due Amount</strong></TableCell>
                      {
                      vivProjectionTableData?.map((item, i) => {
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
    </div>
  )
}

export default ProjectionReport