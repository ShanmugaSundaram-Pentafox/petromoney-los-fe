import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import PDCReportTable from './PDCReportTable';
import usePageTitle from '../../../hooks/usePageTitle';
import RenewalFilter from '../../renewal/RenewalFilter';

const PDCReport = ({ currentUser }) => {
  usePageTitle('PDC Report');
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [filterQry, setFilterQry] = useState();
  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ marginBottom: 12 }}>
        <Grid item xs={12}>
          <RenewalFilter
            filterQry={setFilterQry}
            filterType='dpd'
            filters={['period', 'zone', 'region', 'product']}
          />
        </Grid>
      </Grid>
      <PDCReportTable filterQry={filterQry} currentUser={currentUser} />
    </div>
  )
}

export default PDCReport;