import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import RenewalFilter from './RenewalFilter';
import RenewalTable from './renewalTable/RenewalTable';
import usePageTitle from '../../hooks/usePageTitle';
import { getStatusWiseRecordCount } from '../../services/renewal.service';
import LoanStats from '../dashboard/components/LoanStats';

const currencyFormat = (value) => {
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(value)
  return money;
}

const RenewalList = ({ currentUser }) => {
  usePageTitle('Renewal Loans');
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [selectedStatsCard, setSelectedStatsCard] = useState('draft');
  const [filterQry, setFilterQry] = useState();

  const handleClick = (name) => {
    getStatusWiseRecordCount(filterQry)
      .then(res => {
        const cdata = res?.map((item) => {
          return { name: item?.status, count: item?.record_count };
        });
        setChartData(cdata);
      })
      .catch(err => {
        console.log(err);
      })
    setSelectedStatsCard(name)
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RenewalFilter
            filterQry={setFilterQry}
            setChartData={setChartData}
            setTotalLoans={setTotalLoans}
            filterType='renewal'
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
      <RenewalTable currentUser={currentUser} value={selectedStatsCard} filterQry={filterQry} />
    </div>
  );
}

export default RenewalList;