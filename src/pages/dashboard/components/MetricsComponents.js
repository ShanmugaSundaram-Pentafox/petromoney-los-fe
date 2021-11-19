import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from '@material-ui/core';
import moment from 'moment';
import CountUp from "react-countup";
import Chart from "react-google-charts";

const useStyles = makeStyles(() => ({
  GridParent: {
    textAlign: 'center',
    marginTop: '16px',
    marginBottom: 16,
  },
  GridContainer: {
    height: '301px',
    maxHeight: '301px'
  },
  dataText: {
    color: 'rgb(77, 144, 147)'
  },
  summary: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    padding: 32,
  },
  testCount: {
    fontSize: "30px",
    color: 'rgb(0, 96, 100)'
  },
  title: {
    paddingTop: 20,
    paddingLeft: 20
  }
}));

export const SummaryTile = (props) => {
  const { ls1Data } = props;
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.GridContainer}>
      <Paper className={classes.summary}>
        <Grid container spacing={2}>
          <Grid item xs={4} className={classes.GridParent}>
            <Typography className={classes.dataText} variant="body2"> Date (Opening)</Typography>
            <div className={classes.testCount}>
              {ls1Data.opening ? moment(new Date(ls1Data.opening)).format('DD MMM, YYYY') : '-'}
            </div>
          </Grid>
          <Grid item xs={4} className={classes.GridParent}>
            <Typography className={classes.dataText} variant="body2">    Loan Book (in Crs)</Typography>
            <div className={classes.testCount}>
              <CountUp decimals={2} end={ls1Data.loan_book} />
            </div>
          </Grid>
          <Grid item xs={4} className={classes.GridParent}>
            <Typography className={classes.dataText} variant="body2"> Overdue (in Crs)</Typography>
            <div className={classes.testCount}>
              <CountUp decimals={2} end={ls1Data.overdue} />
            </div>
          </Grid>
          <Grid item xs={6} className={classes.GridParent}>
            <Typography className={classes.dataText} variant="body2"> Due (in Crs)</Typography>
            <div className={classes.testCount}>
              <CountUp decimals={2} end={ls1Data.due} />
            </div>
          </Grid>
          <Grid item xs={6} className={classes.GridParent}>
            <Typography className={classes.dataText} variant="body2">Current (in Crs)</Typography>
            <div className={classes.testCount}>
              <CountUp decimals={2} end={ls1Data.current1} />
            </div>
            {/* {data['Current (in Crs))']} */}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export const PieChartData = ({
  ls2Data,
  totalForRegion,
}) => {
  const classes = useStyles();
  const options = {
    legend: { position: "none" },
    focusTarget: 'category',
    fontSize: 9.5,
  };
  return (
    <Paper>
      <Typography variant="h5" className={classes.title}>Regionswise Overdue - Total: {totalForRegion}</Typography>
      <Chart
        chartType="ColumnChart"
        width="100%"
        // loader={<div>Loading Chart</div>}
        height="300px"

        // toolbarItems={[
        //     {
        //       type: 'csv',
        //       datasource: 'https://spreadsheets.google.com/tq?key=1jN0iw0usssnsG1_oi-NXtuKfsUsGme09GsFidbqxFYA',
        //     },
        //   ]}
        data={ls2Data}
        options={options}
      />
    </Paper>
  )
}

export const BarChartData = ({
  daysChartData
}) => {
  const classes = useStyles();
  return (
    <Paper>
      <Typography variant="h5" className={classes.title}>DPD Wise</Typography>
      <Chart
        height={'290px'}
        chartType="BarChart"
        // loader={<div>Loading Chart</div>}
        data={daysChartData}
        // toolbarItems={[
        //     {
        //       type: 'csv',
        //       datasource: 'https://spreadsheets.google.com/tq?key=1jN0iw0usssnsG1_oi-NXtuKfsUsGme09GsFidbqxFYA',
        //     },
        //   ]}
        options={{
          legend: { position: "none" },
          // colors: ['rgb(66, 133, 244)'],
          // tooltip: { isHtml: true },
          focusTarget: 'category',
          chartArea: { width: '70%' },
          hAxis: {
            title: `Amount`,
            minValue: 0,
          },
        }}
      />
    </Paper>
  )
}

export const GroupChartData = ({ chartData, title, height, xAxis, yAxis }) => {
  const classes = useStyles();
  return (
    <Paper>
      <Typography variant="h5" className={classes.title}>{title}</Typography>
      <Chart
        height={height}
        chartType="BarChart"
        // loader={<div>Loading Chart</div>}
        data={chartData}
        // toolbarItems={[
        //     {
        //       type: 'csv',
        //       datasource: 'https://spreadsheets.google.com/tq?key=1jN0iw0usssnsG1_oi-NXtuKfsUsGme09GsFidbqxFYA',
        //     },
        //   ]}
        options={{
          chartArea: { width: '60%', height: '85%' },
          tooltip: { isHtml: true },
          focusTarget: 'category',
          fontSize: 11,
          colors: ['#81B214', '#5C7AEA', '#8236CB', '#FF9300', '#FF6767', '#E02401'],
          bar: { groupWidth: '80%' },
          hAxis: {
            title: xAxis,
          },
        }}
      />
    </Paper>
  )
}