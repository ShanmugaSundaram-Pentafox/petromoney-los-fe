import { Loader, Paper, Text } from '@mantine/core';
import React from 'react';
import DashCard from '../../../components/CommonComponents/Cards/DashCard';

const LoanStats = ({ selectedStatsCard, handleClick, chartData, totalLoans, loading }) => {
  return (
    <Paper shadow="0" p="xs">
      <>
        <Text fz={'md'} mb="sm" className="text-gray-500">
          Loan Statistics {totalLoans ? `(${totalLoans})` : null}
        </Text>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader size="lg" type="dots" />
          </div>
        ) : chartData.length ? (
          <dl className="grid gap-2 rounded-2xl text-center grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            {chartData?.map((item, i) => {
              return (
                <>
                  {item.name || item.count ? (
                    <DashCard
                      key={item.name + i}
                      selected={item.name === selectedStatsCard}
                      text={item.name}
                      value={item.count || 0}
                      amount={item.amount}
                      action={() => handleClick(item.name)}
                    />
                  ) : null}
                </>
              );
            })}
          </dl>
        ) : null}
      </>
    </Paper>
  );
}

export default LoanStats;
