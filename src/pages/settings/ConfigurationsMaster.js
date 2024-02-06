import { Box, Paper, SimpleGrid, Text } from '@mantine/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import ExternalApi from './components/ExternalApi';
import { RightSideDrawer } from '../../components/Mantine/RightSideDrawer/RightSideDrawer';
import { ReactComponent as AccessIcon } from '../../icons/accessIcon.svg';

const useStyles = makeStyles({
  content: {
    color: '#323232',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: '16px 0',
    height: 96,
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.35s',

    '&:hover': {
      backgroundColor: '#e6e6e6',
    },
  },
});

function ConfigurationsMaster({ currentUser }) {
  const classes = useStyles();
  const [openConfig, setOpenConfig] = useState();

  return (
    <Paper p="lg">
      <SimpleGrid cols={{ base: 3, sm: 4, md: 5, lg: 6 }} spacing="lg">
        <div>
          <Box component="a" href="/rbac" className={classes.content}>
            <AccessIcon className={classes.icons} />
            <Text size="xs" fw="bold" ta="center">RBAC</Text>
          </Box>
        </div>

        <div>
          <Box className={classes.content} onClick={() => setOpenConfig('external_api')}>
            <AccessIcon width={40} className={classes.icons} />
            <Text size="xs" fw="bold" ta="center">External APIs</Text>
          </Box>  
        </div>
      </SimpleGrid>

      <RightSideDrawer
        title="External APIs"
        opened={openConfig}
        onClose={() => setOpenConfig()}
        size="480"
      >
        <ExternalApi callback={setOpenConfig} />
      </RightSideDrawer>
    </Paper>
  );
}

export default ConfigurationsMaster;
