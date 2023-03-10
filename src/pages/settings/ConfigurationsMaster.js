import { Drawer, Grid, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExternalApi from './components/ExternalApi';
import { ReactComponent as AccessIcon } from '../../icons/accessIcon.svg';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginTop: 4,
    flexGrow: 1,
  },
  title: {
    fontSize: 12,
    marginBottom: 8,
  },
  content: {
    textAlign: 'center',
    marginBottom: 10,
    borderRadius: 6,
    paddingTop: 16,
    paddingBottom: 12,
    cursor: 'pointer',
    transition: 'all 0.35s',
    '&:hover': {
      backgroundColor: '#e6e6e6',
    },
  },
  header: {
    display: 'flex',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 15,
  },
  WrapperTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
});

function ConfigurationsMaster({ currentUser }) {
  const classes = useStyles();
  const [openConfig, setOpenConfig] = useState();

  return (
    <div>
      <Paper style={{ padding: 10 }}>
        <div style={{ marginLeft: 20, width: '95%' }}>
          <Grid container spacing={1} className={classes.root}>
            <Grid item md={2}>
              <Tooltip title="RBAC">
                <Link to="/rbac">
                  <div className={classes.content}>
                    <AccessIcon className={classes.icons} />
                    <Typography
                      variant="h5"
                      align="center"
                      className={classes.title}
                    >
                      RBAC
                    </Typography>
                  </div>
                </Link>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="External APIs">
                <div className={classes.content} onClick={() => setOpenConfig('external_api')}>
                  <AccessIcon className={classes.icons} />
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.title}
                  >
                    External APIs
                  </Typography>
                </div>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
      </Paper>
      <Drawer
        anchor="right"
        open={openConfig}
        onClose={() => setOpenConfig()}
        variant="temporary"
      >
        <ExternalApi callback={setOpenConfig} />
      </Drawer>
    </div>
  );
}

export default ConfigurationsMaster;
