import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer, List, ListItem, Button, colors } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// import Profile from './components/Profile';
import SidebarNav from './components/SidebarNav';
import { resetCurrentUser } from '../../store/user/user.actions';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      // marginTop: 64,
      height: '100%'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    color: theme.palette.black,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    // color: theme.palette.blueGreyLight,
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[200],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
}));

const Sidebar = props => {
  const { open, variant, onClose, className, user, logout, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <DashboardIcon />
    },
    {
      title: 'Dealerships',
      href: '/dealership',
      icon: <PeopleIcon />
    },
    {
      title: 'Account',
      href: '/account',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            alt="Logo"
            src="/images/logo.png"
            height="108px"
          />
        </div>
        {/* <Profile user={user} /> */}
        <Divider light className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        <div>
          <List>
              <ListItem
                className={classes.item}
                disableGutters
              >
                <Button
                  activeClassName={classes.active}
                  className={classes.button}
                  // component={CustomRouterLink}
                  onClick={logout}
                >
                  <div className={classes.icon}>
                    <ExitToAppIcon />
                  </div>
                  Logout
                </Button>
              </ListItem>
          </List>
        </div>
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
});

export default connect(null, mapDispatchToProps)(Sidebar);