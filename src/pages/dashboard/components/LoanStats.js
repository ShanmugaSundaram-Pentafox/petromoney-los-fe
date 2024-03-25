import { Badge, Group, Tabs } from '@mantine/core';
import React from 'react';
import classes from './LoansStats.module.css';

const LoanStats = ({ selectedStatsCard, handleClick, chartData = [], totalLoans }) => {
  console.log(chartData);
  const activeData = chartData?.filter(i => i?.count)
  // const [searchParams, setSearchParams] = useSearchParams();

  return (
    // <Paper shadow="0" p="xs">
    <>
      <Tabs value={selectedStatsCard} onChange={handleClick}
        className={{ tab: classes.tab }}
      >
        <Tabs.List>
          {activeData?.map((item, i) => (
            <Tabs.Tab key={`${item.name} ${i}`} value={item?.name}>
              <Group gap={4}>
                {item?.name}
                {['Disbursed', 'Rejected']?.includes(item?.name) ? null : <Badge size='xs' variant='light'>{item?.count}</Badge>}
              </Group>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* {chartData.length ? (
          <dl className="grid grid-cols-3 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-4 lg:grid-cols-8">
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
        ) : null} */}
    </>
    // </Paper>
  )
}

export default LoanStats;
