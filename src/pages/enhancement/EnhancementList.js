import React, { useState } from 'react';
import EnhancementTable from './EnhancementTable'
import usePageTitle from '../../hooks/usePageTitle';
import { getEnhancementStatusList, getStatusWiseRecordCount } from '../../services/enhancement.service';
import RenewalFilter from '../renewal/RenewalFilter';
import { Grid } from '@mantine/core';
import LoanStatsMin from '../dashboard/components/LoanStatsMin';

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
            let result = [...cdata]
            result?.splice((cdata?.indexOf(cdata?.find(i => i?.name === 'approved')) + 1), 0, { name: 'Disb. Approval', count: res.find((el) => el.status === 'disbursement_approval')?.record_count })
            setChartData(result);
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
      <Grid gutter={'md'}>
        <Grid.Col span={12}>
          <RenewalFilter
            filterQry={setFilterQry}
            setChartData={setChartData}
            setTotalLoans={setTotalLoans}
            filterType='enhancement'
            filters={['zone', 'region', 'product', 'period']}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <LoanStatsMin
            selectedStatsCard={selectedStatsCard}
            handleClick={handleClick}
            chartData={chartData}
            totalLoans={totalLoans}
          />
        </Grid.Col>
      </Grid>
      <EnhancementTable currentUser={currentUser} value={selectedStatsCard} filterQry={filterQry} statusList={chartData} statsChange={handleClick} />
    </div>
  );
}

export default EnhancementList;