import { Typography } from '@material-ui/core';
import React from 'react';
import MasterData from './components/MasterData';
import ConfigurationsMaster from './ConfigurationsMaster';
import usePageTitle from '../../hooks/usePageTitle';

const Settings = ({ currentUser }) => {
  usePageTitle('Settings');
  return (
    <div>
      <Typography variant="h3" style={{ marginBottom: 10, fontWeight: 500 }}>
        Master
      </Typography>
      <MasterData currentUser={currentUser} />
      <Typography variant="h3" style={{ margin: '20px 0 10px 0', fontWeight: 500 }}>
        Configurations
      </Typography>
      <ConfigurationsMaster currentUser={currentUser} />
    </div>
  );
};

export default Settings;
