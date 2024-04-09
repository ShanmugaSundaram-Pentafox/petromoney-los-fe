import { Paper, Text } from '@mantine/core';
import React from 'react';
import DashCard from '../../../components/CommonComponents/Cards/DashCard';

const LoanStatsMin = ({ selectedStatsCard, handleClick, chartData, totalLoans }) => {
  return (
    <Paper shadow="0" p="xs">
      <>
        <Text fz={'md'} mb="sm" className="text-gray-500">
          Loan Statistics {totalLoans ? `(${totalLoans})` : null}
        </Text>

        {chartData.length ? (
          <dl className="grid grid-cols-6 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-6 lg:grid-cols-6">
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
              )
            })}
          </dl>
        ) : null}
      </>
    </Paper>
  )
}

export default LoanStatsMin;
