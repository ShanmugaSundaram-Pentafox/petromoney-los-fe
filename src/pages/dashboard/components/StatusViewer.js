import { Badge, Group, Tabs, Text, Tooltip } from '@mantine/core';
import React from 'react';
import classes from './LoansStats.module.css';
import Currency, { ConvertCurrencyWithUnit } from '../../../components/Number/Currency';
import { STATUS, STATUS_COLOR } from '../../../utils/mainStatus';

const StatusViewer = ({ selectedStatsCard, handleClick, chartData = [] }) => {
  const activeData = chartData?.filter(i => i?.count)

  return (
    <>
      <Tabs value={selectedStatsCard} onChange={handleClick}
        classNames={classes}
        style={{ zIndex: 98 }}
        mb={'sm'}
      >
        <Tabs.List>
          {activeData?.map((item, i) => (
            <Tabs.Tab
              key={`${item.name} ${i}`}
              value={item?.name}
              style={{
                position: 'relative',
                color: selectedStatsCard === item?.name && STATUS_COLOR[STATUS[item?.name] || 'Submitted']
              }}
              color={STATUS_COLOR[STATUS[item?.name] || 'Submitted']}
            >
              <Group gap={4}>
                {item?.name}
                {
                  ['Disbursed', 'Rejected']?.includes(item?.name)
                    ? null
                    : <Badge color={STATUS_COLOR[STATUS[item?.name] || 'Submitted']} size='xs' variant='light'>{item?.count}</Badge>
                }
              </Group>
              {['Pending Approval', 'Approved', 'Disb. Approval', 'Disb. Approved']?.includes(item?.name) ?
                <Tooltip label={<Currency value={item?.amount} />} color='gray' withArrow position='bottom'>
                  <Badge
                    style={{
                      position: 'absolute', top: 25, left: '50%', zIndex: 99,
                      transform: 'translate(-50%, 0)'
                    }}
                    color='#e1f3ef'
                    size='xs'
                    // variant='light'
                    mt={'4px'}
                  >
                    <Text style={{ fontSize: '10px' }} fw={500} c={'gray'}>
                      <ConvertCurrencyWithUnit amount={item.amount} />
                    </Text>
                  </Badge>
                </Tooltip>
                : null
              }
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs >
    </>
  )
}

export default StatusViewer;
