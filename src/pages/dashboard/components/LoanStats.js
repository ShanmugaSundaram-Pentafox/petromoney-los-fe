import { Paper, Text, Title } from '@mantine/core';
import React from 'react';
import DashCard from '../../../components/CommonComponents/Cards/DashCard';

const LoanStats = ({ selectedStatsCard, handleClick, chartData, totalLoans }) => {
  return (
    <Paper shadow="0" p="lg">
      <>
        <Text fz={'md'} mb="sm" className="text-gray-500">
          Loans&apos; Statistics ({totalLoans ?? null})
        </Text>

        {chartData.length ? (
          <dl className="grid grid-cols-3 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-4 lg:grid-cols-8">
            {chartData?.map((item, i) => {
              return (
                <>
                  {item.name || item.count ? (
                    <DashCard
                      key={item.name + i}
                      selected={item.name === selectedStatsCard}
                      text={item.name}
                      value={item.count}
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

export default LoanStats;
