import { Tabs, Badge, Skeleton } from '@mantine/core';
import React, { useEffect, useRef } from 'react';
// import {
//   STATUS_COLORS,
//   STATUS_VALUE_SELECTOR,
// } from "../../../utils/StatusTable";
import { getListOfStatusWithCount } from '../../services/deferralDeviation.service';
import { useQuery } from 'react-query';
import { useSearchParam } from 'react-use';

// show count of status if status is found in this list
// const SHOW_STATUS_COUNT_LIST = ["draft", "review", "approval"];

const tabStyle = ({ color }) => ({
  tab: {
    '&:is([aria-selected=true])': {
      color,
      fontWeight: 600,
      backgroundColor: '#f9f9f9',
    },
    '&:not([aria-selected=true])': {
      color: '#9b9b9b',
      '&: after': {
        content: '\'\'',
        display: 'block',
        margin: 'auto',
        height: '2px',
        width: '0px',
        background: 'transparent',
        transition: 'width .5s ease, background-color .5s ease',
        position: 'absolute',
        top: 0,
        bottom: '-41px',
        borderRadius: '5px',
      },
      '&: hover: after': {
        width: '100%',
        background: 'gray',
      },
    },
  },
})

/**
 * 1. Parse the url search param to get the status and entity
 *    - use this data (except status) to call the status list api. 
 * 2. Get status list from API and list them as tabs
 * 3. Use the first list item from status list and mark it as active tab
 * 4. Whenever the active tab changes, Pass the active tab name to url search param as "status"
 * 5. Move "closed" status at the last position
 * @module_name {string} - name of the module 
 * @returns StatusTab component
 */
const StatusList = ({ module_name = 'imd' }) => {
  // used to set the search params
  const [searchParams, setSearchParams] = useSearchParam();
  //   const { moduleCount, addModuleCount, clearModuleCount } = useModuleRecordCountStore();
  const currentTabItem = useRef({});

  // get the list of active status by sending the module name
  const statusQuery = useQuery({
    queryKey: ['data-status-list'],
    queryFn: () => getListOfStatusWithCount(),
    cacheTime: 0,
    // onError: (error) => {
    //   clearModuleCount();
    // },
    select: (data) => {
      const closedStatusPosition = data?.findIndex((item) => item?.module_status === 'closed');

      // send the closed status to last if its not already in last position
      if (closedStatusPosition !== data.length - 1 && closedStatusPosition !== -1) {
        const closedItem = data[closedStatusPosition];
        data.splice(closedStatusPosition, 1);
        data?.push(closedItem);
      }

      return {
        list: data,
        totalItems: data?.length,
      };
    },
  });

  const currentStatus = searchParams.get('status');
  // this effect is used to handle the search params
  useEffect(() => {
    currentTabItem.current = statusQuery?.data?.list?.find((item) => item?.module_status === searchParams.get('status'));
    if (!statusQuery.isLoading && !statusQuery?.data?.totalItems && currentStatus !== 'none') {
      setSearchParams({
        ...searchParams,
        status: 'none'
      });
    }
    else if (!statusQuery.isFetching && !currentTabItem.current) {
      currentTabItem.current = statusQuery?.data?.list?.[0];
      if (currentTabItem.current) {
        searchParams.set('status', currentTabItem.current?.module_status)
        setSearchParams(searchParams);
      }
    }
    // if(statusQuery?.data?.totalItems && (moduleCount?.module_name !== module_name || moduleCount?.count !== currentTabItem.current?.number_of_records)) {
    //   addModuleCount({
    //     module_name,
    //     count: currentTabItem.current?.number_of_records,
    //   });
    // }
  }, [statusQuery])

  if (!statusQuery?.data?.totalItems && statusQuery?.isLoading) {
    return (
      <Tabs
        value={'tab1'}
        styles={tabStyle({ color: 'gray' })}
      >
        <Tabs.List>
          {[1, 2, 3, 4, 5]?.map((item, index) => (
            <Tabs.Tab
              key={index}
              color={'gray'}
              value={'tab' + item}
            >
              <Skeleton height={18} width={80} />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    )
  }

  return (
    <Tabs
      value={searchParams.get('status')}
      onTabChange={(e) => {
        searchParams.set('status', e);
        setSearchParams(searchParams)
      }}
    //   styles={tabStyle({ color: STATUS_COLORS[currentTabItem.current?.module_status] })}
    >
      <Tabs.List>
        {statusQuery?.data?.list?.map((item) => (
          <Tabs.Tab
            key={item?.module_status}
            // color={STATUS_COLORS[item?.module_status]}
            rightSection={
              <Badge>
                {item?.number_of_records}
              </Badge>
            }
            value={item?.module_status}
          >
            {item?.current_status}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export default StatusList;
