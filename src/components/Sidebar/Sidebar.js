import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer, List, ListItem, Button, colors } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded';
// import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import PersonOutlineRoundedIcon from '@material-ui/icons/PersonOutlineRounded';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
// import Profile from './components/Profile';
import SidebarNav from './components/SidebarNav';
// import { resetCurrentUser } from '../../store/user/user.actions';
import { permissionCheck } from '../UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import ListIcon from '@material-ui/icons/List';
import SettingsIcon from '@material-ui/icons/Settings';
// import { ExitToApp } from '@material-ui/icons';
// import { connect } from 'formik';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      // marginTop: 64,
      height: '100%'
    }
  },
  root: {
    // backgroundColor: theme.palette.white,
    // backgroundColor: "#050712",

    backgroundColor: "#FFF",
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
    // color: colors.blueGrey[200],
    // color: 'rgba(173, 173, 173, 1)',
    // color: "rgba(34, 36, 68, 1)",
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  active: {
    backgroundColor: 'white',
    color: "rgba(34, 36, 68, 1)"
  },
  icon: {
    // color: theme.palette.icon,
    color: "rgba(34, 36, 68, 1)",
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
}));

const Sidebar = props => {
  const { open, variant, onClose, className, user, logout, currentUser, ...rest } = props;
  const classes = useStyles();
  const pages = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <DashboardIcon />
    },
    // {
    //   title: 'Solar',
    //   href: '/solar',
    //   icon: <WbSunnyRoundedIcon />
    // },
    {
      title: 'Loans',
      href: '/loans',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Dealerships',
      href: '/dealership',
      icon: <PeopleIcon />
    },
    {
      title: 'Transports',
      href: '/transports',
      icon: <LocalShippingIcon />
    },
    {
      title: 'Report',
      href: '/reports',
      icon: <LocalShippingIcon />
    },
    {
      title: 'Exception',
      href: '/loans',
      icon: <AccountBoxIcon />
    },
    // {
    //   title: 'Account',
    //   href: '/account',
    //   icon: <AccountBoxIcon />
    // },
    // {
    //   title: 'Settings',
    //   href: '/settings',
    //   icon: <SettingsIcon />
    // }
  ];
  if (permissionCheck(currentUser.role_name, rulesList.dealer_view)) {
    pages.splice(1, pages.length + 1)
    pages.push(
      {
        title: 'Profile',
        href: `/dealership/${currentUser.dealership_id}`,
        icon: <PersonOutlineIcon />
      },
      {
        title: 'Passbook',
        href: '/passbook',
        icon: <ListIcon />
      },
      {
        title: 'Transports',
        href: '/transports',
        icon: <LocalShippingIcon />
      },
    )
  }

  if (permissionCheck(currentUser.role_name, rulesList.users_view)) {
    pages.push({
      title: 'Users',
      href: '/users',
      icon: <AccountBoxIcon />
    })
  }

  {
    pages.push({
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    })
  }

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
        {/* <Profile user={currentUser} /> */}
        <Divider light className={classes.divider} />
        <div>
          <List>
            <ListItem
              className={classes.item}
              disableGutters
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
              >
                <div className={classes.icon}>
                  <PersonOutlineRoundedIcon />
                </div>
                {currentUser.role_name}
              </Button>
            </ListItem>
          </List>
        </div>
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        {/* <div>
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
        </div> */}
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


export default Sidebar;