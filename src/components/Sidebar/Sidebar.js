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
import { action_id, resources_id } from '../../config/accessControl';
import { isAllowed } from '../../utils/cerbos';
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

  const pageData = [
    {
      id: action_id?.navigation.dashboard,
      title: 'Dashboard',
      href: '/',
      icon: <DashboardIcon />
    },
    {
      id: action_id?.navigation.dashboardDealer,
      title: 'Dashboard',
      href: '/reports',
      icon: <DashboardIcon />
    },
    {
      id: action_id?.navigation.loans,
      title: 'Loans',
      href: '/loans',
      icon: <AccountBoxIcon />
    },
    {
      id: action_id?.navigation.credit_reload,
      title: 'Credit Reload',
      href: '/reports/credit/reload',
      icon: <CachedIcon />
    },
    {
      id: action_id?.navigation.withheld,
      title: 'Withheld',
      href: '/withheld',
      icon: <AssignmentLateRoundedIcon />
    },
    {
      id: action_id?.navigation.renewal,
      title: 'Renewal',
      href: '/renewal',
      icon: <Repeat />
    },
    {
      id: action_id?.navigation.dealerships,
      title: 'Dealerships',
      href: '/dealership',
      icon: <PeopleIcon />
    },
    {
      id: action_id?.navigation.transports,
      title: 'Transports',
      href: '/transports',
      icon: <LocalShippingIcon />
    },
    {
      id: action_id?.navigation.profileDealer,
      title: 'Profile',
      href: `/dealership/${currentUser.dealership_id}`,
      icon: <PersonOutlineIcon />
    },
    {
      id: action_id?.navigation.profileTransports,
      title: 'Profile',
      href: '/transports-field',
      icon: <PersonOutlineIcon />
    },
    {
      id: action_id?.navigation.collection_remarks,
      title: 'Collection Remarks',
      href: '/reports/remarks',
      icon: <ChatIcon />
    },
    {
      id: action_id?.navigation.report,
      title: 'Report',
      href: '/reports',
      icon: <LocalShippingIcon />
    },
    {
      id: action_id?.navigation.exception,
      title: 'Exception',
      href: '/loans',
      icon: <AccountBoxIcon />
    },
    {
      id: action_id?.navigation.dealer_referral,
      title: 'Dealer Referral',
      href: '/referral',
      icon: <AccountBoxIcon />
    },
    {
      id: action_id.navigation.profileDealer,
      title: 'Passbook',
      href: '/passbook',
      icon: <ListIcon />
    },
    {
      id: action_id?.navigation.account_statement,
      title: 'Account Statement',
      href: '/statements',
      icon: <ListAltIcon />
    },
    {
      id: action_id?.navigation.pre_submit,
      title: 'Pre Submit',
      href: '/pre-submit',
      icon: <AccountBoxIcon />
    },
    {
      id: action_id?.navigation.profileTransports,
      title: 'FASTag Passbook',
      href: '/transport/fastag/details',
      icon: <ListIcon />
    },
    {
      id: action_id?.navigation.users,
      title: 'Users',
      href: '/users',
      icon: <AccountBoxIcon />
    },
    {
      id: action_id?.navigation.call_request,
      title: 'Call Request',
      href: '/customer/callback',
      icon: <PermPhoneMsgIcon />
    },
    {
      id: action_id?.navigation.settings,
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    },
    {
      id: action_id?.navigation.noc,
      title: 'NOC Letter',
      href: '/noc',
      icon: <AccountBoxIcon />
    }
  ]

  let pages = []

  for (let i = 0; i < pageData.length; i++) {
    if(isAllowed(currentUser?.permissions, resources_id?.navigation, pageData[i]?.id)) {
      pages.push(pageData[i])
    }
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