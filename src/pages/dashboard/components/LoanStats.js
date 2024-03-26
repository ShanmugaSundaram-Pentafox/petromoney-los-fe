import { Badge, Group, Tabs } from '@mantine/core';
import React from 'react';
import classes from './LoansStats.module.css';

const LoanStats = ({ selectedStatsCard, handleClick, chartData = [], totalLoans }) => {
  console.log('chart data ------>',chartData)
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
    </>
    // </Paper>
  )
}

export default LoanStats;
