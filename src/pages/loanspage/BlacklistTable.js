// import { useMount } from 'react-use';
// import { getAllWithheldLoans } from '../../services/withheld.services';
import React, { useState } from 'react';
import styled from 'styled-components';
import ResolvedTable from './ResolvedTable';
import UnresolvedTable from './UnResolvedTable';
import usePageTitle from '../../hooks/usePageTitle';
import { Tabs } from '@mantine/core';
import { makeStyles } from '@material-ui/styles';


const PaperWrapper = styled.div`

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
`;

const useStyles = makeStyles(theme => ({
  tab:{
    border:'1px solid #d3d3d3'
  }
}))

const BlacklistTable = ({ currentUser }) => {
  const [selectedTab, setSelectedTab] = useState('unresolved');
  usePageTitle('Withheld loan', true)
  const classes = useStyles();


  return (
    <>
      <Tabs value={selectedTab} onChange={setSelectedTab} variant="pills"  >
        <Tabs.List grow >
          <Tabs.Tab value="unresolved" p={'sm'} className={classes.tab}>
            Unresolved
          </Tabs.Tab>
          <Tabs.Tab value="resolved" className={classes.tab}>
            Resolved
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='unresolved' mt={'md'}>
          <UnresolvedTable currentUser={currentUser} />        </Tabs.Panel>
        <Tabs.Panel value='resolved' mt={'md'}>
          <ResolvedTable />        </Tabs.Panel>
      </Tabs>
    </>
  )
}
export default BlacklistTable;