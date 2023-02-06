import { Box } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import React, { useState } from 'react';
import styled from 'styled-components';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import Currency from '../../components/Number/Currency';
import CreditDashboardFilter from '../dashboard/components/CreditDashboardFilter';

export const TableFooter = ({ offset, stats, handleIncrease, handleDecrease }) => {
  return (
    <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <label>Rows per page : 25</label>
      <label style={{ marginLeft: 20 }}>{offset + 1} - {(!stats || stats?.count > 25) ? 1 : stats?.count / 25}</label>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={!offset == 0 ? handleDecrease : null}>
          <ChevronLeftRoundedIcon style={{ fontSize: 34, color: 'hsl(0,0%,75%)', cursor: 'pointer' }} />
        </div>
        <div onClick={stats?.count > 25 ? handleIncrease : null}>
          <ChevronRightRoundedIcon style={{ fontSize: 34, color: 'hsl(0,0%,75%)', cursor: 'pointer' }} />
        </div>
      </div>
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

const CreditReload = ({ currentUser, filterQry, filterList, handleDownload, filterType, stats, refetch }) => {
  const [chartData, setChartData] = useState()
  return (
    <div style={{ marginBottom: 10 }}>
      <CreditDashboardFilter currentUser={currentUser} refetch={refetch} filterQry={filterQry} setChartData={setChartData} filters={filterList} filterType={filterType} handleDownload={handleDownload} />
      {
        (currentUser?.role_id !== 13 && filterType !== 'processed') && (
          <Box p={2} borderRadius={4} bgcolor="background.paper" style={{ marginBottom: 10, marginTop: 10 }}>
            <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row">
              <DashCard text="Zone" value={chartData?.count?.length === 1 ? chartData?.count[0]?.label : `${chartData?.count[0]?.label} & ${chartData?.count?.length - 1} more` || '-'} />
              <DashCard text={'No.of. New Request'} value={stats?.count || '-'} />
              <DashCard noBorder text={'Total.Req. Amount'} value={<Currency value={stats?.amount} /> || '-'} amount={stats?.amount} />
            </Box>
          </Box>
        )
      }
    </div>
  );
};

export default CreditReload;
