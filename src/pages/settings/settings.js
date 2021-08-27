import { Paper } from '@material-ui/core';
import React from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import MasterData from './components/MasterData';
import Container from './components/MasterDataTable.js';

const Settings = ({ currentUser }) => {
  usePageTitle('Settings')
  return (
    <div>
      <MasterData />
    </div>
  );
}

export default Settings;