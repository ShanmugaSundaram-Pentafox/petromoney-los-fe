import { Grid } from '@mantine/core';
import React, { useRef, useState } from 'react';
import { useMount } from 'react-use';
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
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestIdRef = useRef(0);

  const handleClick = async (name) => {
    const newRequestId = Date.now();
    requestIdRef.current = newRequestId;

    setSelectedStatsCard(name);
    setTableData([]);
    setLoading(true);

    try {
      const data = await getLoansByLosStatus(name);

      if (requestIdRef.current === newRequestId) {
        setTableData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (requestIdRef.current === newRequestId) {
        setLoading(false);
      }
    }
  };

  useMount(() => {
    setLoading(true);

    getLoanStatusCount()
      .then((res) => {
        const statusCounts = res?.status_counts || [];
        const total = res?.total_loans || 0;

        const formattedData = statusCounts.map((item) => ({
          name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          count: item.count,
        }));

        setChartData(formattedData);
        setTotalLoans(total);

        // Auto-load first status
        if (formattedData.length) {
          handleClick(formattedData[0].name);
        }
      })
      .finally(() => setLoading(false));
  });

  return (
    <>
      <Grid>
        <Grid.Col>
          <LoanStats
            selectedStatsCard={selectedStatsCard}
            handleClick={handleClick}
            chartData={chartData}
            totalLoans={totalLoans}
            loading={loading}
          />
        </Grid.Col>
      </Grid>

      <LoansTable
        currentUser={currentUser}
        value={selectedStatsCard}
        loading={loading}
        data={tableData}
      />
    </>
  );
};

export default Dashboard;