import { Grid } from '@mantine/core';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import { useQuery } from 'react-query';
import LoanStats from './components/LoanStats';
import LoansTable from './components/LoansTable';
import {
  getLoanStatusCount,
  getLoansByLosStatus,
} from '../../services/loans.service';

const Dashboard = ({ currentUser }) => {
  const [chartData, setChartData] = useState([]);
  const [totalLoans, setTotalLoans] = useState(0);
  const [selectedStatsCard, setSelectedStatsCard] = useState('');

  // 🔹 1️⃣ Status Count Query
  const { isLoading: statusLoading } = useQuery(
    ['los-loan-status-count'],
    getLoanStatusCount,
    {
      onSuccess: (res) => {
        const statusCounts = res?.status_counts || [];
        const total = res?.total_loans || 0;

        const formattedData = statusCounts.map((item) => ({
          name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          count: item.count,
        }));

        setChartData(formattedData);
        setTotalLoans(total);

        if (!selectedStatsCard && formattedData.length) {
          const firstWithData = formattedData.find((item) => item.count > 0);

          if (firstWithData) {
            setSelectedStatsCard(firstWithData.name);
          } else {
            // fallback to first if all counts are 0
            setSelectedStatsCard(formattedData[0].name);
          }
        }
      },
    }
  );

  // 🔹 2️⃣ Loans By Status Query
  const {
    data: tableData = [],
    isLoading: tableLoading,
  } = useQuery(
    ['los-loans-by-status', selectedStatsCard],
    () => getLoansByLosStatus(selectedStatsCard),
    {
      enabled: !!selectedStatsCard,
      keepPreviousData: true,
    }
  );

  const handleClick = (name) => {
    setSelectedStatsCard(name);
  };

  useMount(() => {});

  return (
    <>
      <Grid>
        <Grid.Col>
          <LoanStats
            selectedStatsCard={selectedStatsCard}
            handleClick={handleClick}
            chartData={chartData}
            totalLoans={totalLoans}
            loading={statusLoading}
          />
        </Grid.Col>
      </Grid>

      <LoansTable
        currentUser={currentUser}
        value={selectedStatsCard}
        loading={tableLoading}
        data={tableData}
      />
    </>
  );
};

export default Dashboard;