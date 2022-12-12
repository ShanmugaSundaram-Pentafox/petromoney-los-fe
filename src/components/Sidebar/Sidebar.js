import { Divider, Drawer, List, ListItem, Button } from '@material-ui/core';
import { Repeat } from '@material-ui/icons';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentLateRoundedIcon from '@material-ui/icons/AssignmentLateRounded';
import CachedIcon from '@material-ui/icons/Cached';
import ChatIcon from '@material-ui/icons/Chat';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PeopleIcon from '@material-ui/icons/People';
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PersonOutlineRoundedIcon from '@material-ui/icons/PersonOutlineRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import SidebarNav from './components/SidebarNav';
import { rulesList } from '../../config/userRules';
import { permissionCheck } from '../UserCan/UserCan';
const packageJSON = require('../../../package.json');

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      height: '100%'
    }
  },
  root: {
    backgroundColor: '#FFF',
    color: theme.palette.black,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
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
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  active: {
    backgroundColor: 'white',
    color: 'rgba(34, 36, 68, 1)'
  },
  icon: {
    color: 'rgba(34, 36, 68, 1)',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  version: {
    textAlign: 'center',
    color: 'rgba(34, 36, 68, .75)',
    fontSize: 12,
    display: 'block',
  },
}));

const Sidebar = props => {
  const { open, variant, onClose, className, user, logout, currentUser, ...rest } = props;
  const classes = useStyles();
  let pages = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <DashboardIcon />
    },
    {
      title: 'Loans',
      href: '/loans',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Credit Reload',
      href: '/reports/credit/reload',
      icon: <CachedIcon />
    },
    {
      title: 'Withheld',
      href: '/withheld',
      icon: <AssignmentLateRoundedIcon />
    },
    {
      title: 'Renewal',
      href: '/renewal',
      icon: <Repeat />
    },
    {
      title: 'Transports',
      href: '/transports',
      icon: <LocalShippingIcon />
    },
    {
      title: 'Collection Remarks',
      href: '/reports/remarks',
      icon: <ChatIcon />
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
  ];

  if (permissionCheck(currentUser.role_name, rulesList.external_view)) {
    pages = [
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
    ]
  }

  if (permissionCheck(currentUser.role_name, rulesList.dealership_view)) {
    pages.push(
      {
        title: 'Dealerships',
        href: '/dealership',
        icon: <PeopleIcon />
      },
    )
  }

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
        title: 'Credit Reload',
        href: '/reports/credit/reload',
        icon: <CachedIcon />
      },
      {
        title: 'Account Statement',
        href: '/statements',
        icon: <ListAltIcon />
      },
    )
  }

  if (permissionCheck(currentUser.role_name, rulesList.pre_submit_view)) {
    pages.push({
      title: 'Pre Submit',
      href: '/pre-submit',
      icon: <AccountBoxIcon />
    })
  }
  if (permissionCheck(currentUser.role_name, rulesList.transporter_view)) {
    pages = [
      {
        title: 'Profile',
        href: '/transports-field',
        icon: <PersonOutlineIcon />
      },
      {
        title: 'FASTag Passbook',
        href: '/transport/fastag/details',
        icon: <ListIcon />
      }
    ]
  }

  if (permissionCheck(currentUser.role_name, rulesList.users_view)) {
    pages.push({
      title: 'Users',
      href: '/users',
      icon: <AccountBoxIcon />
    })
  }

  if (permissionCheck(currentUser.role_name, rulesList.users_view)) {
    pages.push({
      title: 'Call Request',
      href: '/customer/callback',
      icon: <PermPhoneMsgIcon />
    })
  }

  if (permissionCheck(currentUser.role_name, rulesList.settings_view)) {
    pages.push({
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    })
  }
  if (permissionCheck(currentUser.role_name, rulesList.ops_view)) {
    pages.push({
      title: 'NOC Letter',
      href: '/noc',
      icon: <AccountBoxIcon />
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
          currentUser={currentUser}
        />
        <div>
          <List>
            <ListItem className={classes.version}>
              version {packageJSON.version}
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


export default Sidebar;