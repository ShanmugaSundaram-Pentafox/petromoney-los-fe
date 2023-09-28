import { Tab, Tabs, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MapRegion from './MapRegion';
import PasswordForm from './PasswordForm';
import PincodeMapping from './PincodeMapping';
import UserProfile from './UserProfile';
import { TabPanel, tabA11yProps } from '../../../components/CommonComponents/Tabs/TabPanel';


const useStyles = makeStyles((theme) => ({
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    '& .MuiTab-wrapper': {
      alignItems: 'flex-end !important',
      marginRight: 20
    }
  },
}));

const ProfileTabs = ({ currentUser, location }) => {
  const history = useHistory();
  const classes = useStyles();
  const [passLoading, setpassLoading] = useState(false)
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const rowData = location?.params;
  const tabsList = ['User Profile', rowData?.role_id != 12 ? 'Map Region' : 'Map Pincode', 'Update Password']


  if(!location.params)
    return history.goBack();
  

  return (
    <div style={{ backgroundColor: 'white' }}>
      <Tabs
        indicatorColor="primary"
        scrollButtons="desktop"
        variant="scrollable"
        textColor="primary"
        className={classes.tabs}
        value={value}
        onChange={handleChange}
      >
        {
          tabsList?.map((item, i) => <Tab key={i} label={item} {...tabA11yProps(i)} className={classes.tab} />)
        }
      </Tabs>
      <TabPanel activeTab={value} value={value} index={0}>
        <UserProfile key={rowData.id} userId={rowData.id} currentUser={currentUser} data={rowData} />
      </TabPanel>
      <TabPanel activeTab={value} index={1}>
        {
          rowData?.role_id != 12 ? <MapRegion data={rowData} /> : <PincodeMapping userId={rowData?.id} />
        }
      </TabPanel>
      <TabPanel activeTab={value} index={2}>
        <PasswordForm data={rowData} loading={passLoading} setLoading={setpassLoading} />
      </TabPanel>
    </div >
  )
}

export default ProfileTabs;