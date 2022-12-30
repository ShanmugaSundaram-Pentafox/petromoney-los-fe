import React from 'react';
import MasterData from './components/MasterData';
import usePageTitle from '../../hooks/usePageTitle';

const Settings = ({ currentUser }) => {
  usePageTitle('Settings')
  return (
    <div>
      <MasterData currentUser={currentUser} />
    </div>
  );
}

export default Settings;