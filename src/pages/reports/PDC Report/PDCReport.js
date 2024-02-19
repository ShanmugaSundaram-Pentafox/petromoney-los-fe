import React, { useState } from 'react';
import PDCReportTable from './PDCReportTable';
import usePageTitle from '../../../hooks/usePageTitle';
import RenewalFilter from '../../renewal/RenewalFilter';
import { Grid } from '@mantine/core';

const PDCReport = ({ currentUser }) => {
  usePageTitle('PDC Report');
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [filterQry, setFilterQry] = useState();
  return (
    <div style={{ flexGrow: 1 }}>
      <Grid mb={12}>
        <Grid.Col>
          <RenewalFilter
            filterQry={setFilterQry}
            filterType='dpd'
            filters={['period', 'zone', 'region', 'product']}
          />
        </Grid.Col>
      </Grid>
      <PDCReportTable filterQry={filterQry} currentUser={currentUser} />
    </div>
  )
}

export default PDCReport;