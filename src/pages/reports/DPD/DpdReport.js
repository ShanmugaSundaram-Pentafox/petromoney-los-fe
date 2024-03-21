import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import DpdReportTable from './DPDReportTable';
import usePageTitle from '../../../hooks/usePageTitle';
import RenewalFilter from '../../renewal/RenewalFilter';

const DPDReport = ({ currentUser }) => {
  usePageTitle('DPD Report');
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [filterQry, setFilterQry] = useState();
  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container spacing={2} style={{ marginBottom: 12 }}>
        <Grid item xs={12}>
          <RenewalFilter
            filterQry={setFilterQry}
            setChartData={setChartData}
            setTotalLoans={setTotalLoans}
            filterType='dpd'
            filters={['period', 'entity']}
          />
        </Grid>
      </Grid>
      <DpdReportTable currentUser={currentUser} filterQry={filterQry} title={'DPD Report'} />
    </div>

  )
}

export default DPDReport;