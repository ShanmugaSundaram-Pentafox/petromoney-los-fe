import React from 'react';

const Settings = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser.name}</h1>
    </div>
  );
}

export default Settings;