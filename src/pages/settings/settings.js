import { Box, Space, Title } from '@mantine/core';
import React from 'react';
import ConfigurationsMaster from './ConfigurationsMaster';
// import usePageTitle from '../../hooks/usePageTitle';

const Settings = ({ currentUser }) => {
  // usePageTitle('Settings');
  return (
    <Box> 
      <Title order={3}>Master</Title>
      <Space h="md" />
      {/* <MasterData currentUser={currentUser} /> */}
      <Space h="xl" />
      <Title order={3}>Configurations</Title>
      <Space h="md" />
      <ConfigurationsMaster currentUser={currentUser} />
    </Box>
  );
};

export default Settings;
