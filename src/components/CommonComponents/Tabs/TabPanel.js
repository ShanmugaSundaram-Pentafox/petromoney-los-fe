import React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

export function tabA11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export const TabPanel = ({ children, activeTab, index, ...rest }) => {
  return (
    <div
      role="tabpanel"
      hidden={activeTab !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...rest}
    >
      {/* {activeTab === index && ( */}
        <Box p={1} pl={2} pt={0}>
          <Paper>
            <Box p={2} pt={1}>
              {children}
            </Box>
          </Paper>
        </Box>
      {/* )} */}
    </div>
  );
}