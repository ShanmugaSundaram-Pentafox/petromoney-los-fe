import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import usePageTitle from '../../hooks/usePageTitle';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import StatsCard from '../../components/CommonComponents/Cards/StatsCard';
import ChartCard from '../../components/CommonComponents/ChartCard/ChartCard';
import { VictoryChart, VictoryPie } from 'victory';
import { CHART_COLORS } from '../../config/constants';

const Solar = ({}) => {
  usePageTitle('Solar Dashboard')
  return (
    <div>
      <Grid container direction="row" spacing={2} justify="space-between">
        <Grid item>
          <Typography variant="h4">Welcome!</Typography>
          <Typography variant="p">This is the dashboard for solar modules</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <StatsCard
                value={150}
                text={"No. of Data Received"}
              />
            </Grid>
            <Grid item>
              <StatsCard
                value={110}
                text={"Completed"}
              />
            </Grid>
            <Grid item>
              <StatsCard
                value={40}
                text={"Pending"}
              />
            </Grid>
            <Grid item>
              <StatsCard
                value={<small>26<sup>th</sup> Nov</small>}
                text={"Last updated"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box pt={3} />
      <Grid container spacing={2}>
        <Grid item sm={6}>
          <ChartCard
            title="Enquiry Forms"
            // chartCaption="No. of Received"
            actionButton={{
              label: "View all",
              onClick: () => null
            }}
            labels={[
              { label: 'Completed', value: 45 },
              { label: 'Assigned', value: 10 },
              { label: 'Rejected', value: 32 },
              { label: 'Processing', value: 19 },
            ]}
          >
              <VictoryPie
                innerRadius={75}
                colorScale={CHART_COLORS}
                labels={[]}
                data={[
                  { y: 45 },
                  { y: 10 },
                  { y: 32 },
                  { y: 19 },
                ]}
              />
          </ChartCard>
        </Grid>
        <Grid item sm={6}>
          <ChartCard
            title="Vendor Supplier"
            actionButton={{
              label: "View all",
              onClick: () => null
            }}
            labels={[
              { label: 'Completed', value: 45 },
              { label: 'Assigned', value: 10 },
              { label: 'Rejected', value: 32 },
            ]}
          >
              <VictoryPie
                innerRadius={75}
                colorScale={CHART_COLORS}
                labels={[]}
                data={[
                  { y: 45 },
                  { y: 10 },
                  { y: 32 },
                ]}
              />
          </ChartCard>  
        </Grid>
        <Grid item sm={6}>
        <ChartCard
            title="Vendor Supplier"
            actionButton={{
              label: "View all",
              onClick: () => null
            }}
            labels={[
              { label: 'Completed', value: 45 },
              { label: 'Assigned', value: 10 },
              { label: 'Rejected', value: 32 },
            ]}
          >
              <VictoryPie
                innerRadius={75}
                colorScale={CHART_COLORS}
                labels={[]}
                data={[
                  { y: 45 },
                  { y: 10 },
                  { y: 32 },
                ]}
              />
          </ChartCard> 
        </Grid>
        <Grid item sm={6}>
        <ChartCard
            title="Vendor Supplier"
            actionButton={{
              label: "View all",
              onClick: () => null
            }}
            labels={[
              { label: 'Completed', value: 45 },
              { label: 'Assigned', value: 10 },
              { label: 'Rejected', value: 32 },
            ]}
          >
              <VictoryPie
                innerRadius={75}
                colorScale={CHART_COLORS}
                labels={[]}
                data={[
                  { y: 45 },
                  { y: 10 },
                  { y: 32 },
                ]}
              />
          </ChartCard>
        </Grid>
        <Grid item sm={6}>

        </Grid>
        <Grid item sm={6}>

        </Grid>
      </Grid>
    </div>
  )
}

export default Solar;