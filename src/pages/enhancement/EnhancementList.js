import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import EnhancementTable from './EnhancementTable'
import usePageTitle from '../../hooks/usePageTitle';
import { getEnhancementStatusList, getStatusWiseRecordCount } from '../../services/enhancement.service';
import LoanStats from '../dashboard/components/LoanStats';
import RenewalFilter from '../renewal/RenewalFilter';

const currencyFormat = (value) => {
  const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 }).format(value)
  return money;
}

const EnhancementList = ({ currentUser }) => {
  usePageTitle('Enhanced Loans');
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [totalLoans, setTotalLoans] = useState()
  const [selectedStatsCard, setSelectedStatsCard] = useState('submit');
  const [filterQry, setFilterQry] = useState();

  const handleClick = (name) => {
    getEnhancementStatusList()
      .then((status) => {
        getStatusWiseRecordCount(filterQry)
          .then(res => {
            const cdata = status?.map((item) => {
              const matchingItem = res.find((el) => el.status === item.status);
              return matchingItem ? { name: item?.status, count: matchingItem?.record_count } : { name: item?.status, count: 0 };
            });
            setChartData(cdata);
          })
          .catch(err => {
            console.log(err);
          })
          .catch((err) => console.log('err >>', err))
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
            filterType='enhancement'
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
      <EnhancementTable currentUser={currentUser} value={selectedStatsCard} filterQry={filterQry} />
    </div>
  );
}

export default EnhancementList;