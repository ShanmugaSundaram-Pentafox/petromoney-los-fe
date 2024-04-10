import { Paper } from '@mantine/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import React, { useState } from 'react';
import styled from 'styled-components';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import Currency from '../../components/Number/Currency';
import { action_id, resources_id } from '../../config/accessControl';
import CreditDashboardFilter from '../dashboard/components/CreditDashboardFilter';
import CheckAllowed from '../rbac/CheckAllowed';

export const TableFooter = ({ offset, stats, handleIncrease, handleDecrease }) => {
  return (
    <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      {
        stats?.count && (
          <>
            <label>Rows per page : 25</label>
            <label style={{ marginLeft: 20 }}>{offset + 1} - {Math.ceil(stats?.count / 25)}</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div onClick={!offset == 0 ? handleDecrease : null}>
                <ChevronLeftRoundedIcon style={{ fontSize: 34, color: 'hsl(0,0%,75%)', cursor: 'pointer' }} />
              </div>
              <div onClick={(stats?.count > 25 && (offset + 1 < Math.ceil(stats?.count / 25))) ? handleIncrease : null}>
                <ChevronRightRoundedIcon style={{ fontSize: 34, color: 'hsl(0,0%,75%)', cursor: 'pointer' }} />
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export const PaperWrapper = styled.div`
margin-bottom:10px;
font-size:16px;
background-color: #f1f1f1;

.active {
    background-color: #f1f1f1;
    color: #b2b2b2;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }

.inactive {
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  }
`;

const CreditReload = ({ currentUser, filterQry, filterList, handleDownload, filterType, stats, refetch, fileData, downloadLoading, searchLoading }) => {
  const [chartData, setChartData] = useState()
  return (
    <div style={{ marginBottom: 10 }}>
      <CreditDashboardFilter
        currentUser={currentUser}
        refetch={refetch}
        filterQry={filterQry}
        setChartData={setChartData}
        filters={filterList}
        filterType={filterType}
        handleDownload={handleDownload}
        fileData={fileData}
        downloadLoading={downloadLoading}
        searchLoading={searchLoading}
      />
      {
        (filterType !== 'processed') && (
          <CheckAllowed currentUser={currentUser} resource={resources_id.creditReload} action={action_id.creditReload.dealer_search}>
            <Paper shadow="xs" p="lg" radius="lg" my="lg">
              <dl className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
                <DashCard 
                  text="Zone" 
                  value={chartData?.count?.length === 1 ? chartData?.count[0]?.label : `${chartData?.count[0]?.label} & ${chartData?.count?.length - 1} more` || '-'} 
                />
                <DashCard 
                  text={'No.of. New Request'} 
                  value={stats?.count || '-'} 
                />
                <DashCard  
                  text={'Total.Req. Amount'} 
                  value={<Currency value={stats?.amount} /> || '-'} 
                  amount={stats?.amount} 
                />
              </dl>
            </Paper>
          </CheckAllowed>
        )
      }
    </div>
  );
};

export default CreditReload;
