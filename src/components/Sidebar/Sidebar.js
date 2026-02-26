import {
  IconAlignBoxBottomCenter,
  IconArrowAutofitRight,
  IconArrowCapsule,
  IconArrowIteration,
  IconArrowLoopRight,
  IconBooks,
  IconCertificateOff,
  IconChecklist,
  IconClipboardText,
  IconCoins,
  IconDashboard,
  IconFileAnalytics,
  IconFileLambda,
  IconFileStack,
  IconGasStation,
  IconLayersSubtract,
  IconList,
  IconPhone,
  IconReorder,
  IconRepeat,
  IconReport,
  IconScooterElectric,
  IconSettings,
  IconTir,
  IconUserCircle,
  IconUsers,
  IconUserPlus,
} from '@tabler/icons-react';
import { ScrollArea, Text } from '@mantine/core';
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
      name: 'Dashboard',
      href: '/',
      icon: <IconDashboard strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.dashboardDealer,
      name: 'Dashboard',
      href: '/reports',
      icon: <IconDashboard strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.pre_submit,
      name: 'Pre Submit',
      href: '/pre-submit',
      icon: <IconLayersSubtract strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.enhancement,
      name: 'Enhancement',
      href: '/enhancement',
      icon: <IconClipboardText strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.renewal,
      name: 'Renewal',
      href: '/renewal',
      icon: <IconArrowAutofitRight strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.renewal,
      name: 'Re-onboarding',
      href: '/re-onboarding',
      icon: <IconArrowLoopRight strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.credit_reload,
      name: 'Credit Reload',
      // href: '/reports/credit/reload',
      icon: <IconRepeat strokeWidth="2px" size={18} />,
      links: [
        {
          name: 'New',
          href: '/credit/reload/new/reports',
          icon: <IconArrowIteration strokeWidth="2px" size={18} />,
        },
        {
          name: 'Processed',
          href: '/credit/reload/processed/reports',
          icon: <IconArrowCapsule strokeWidth="2px" size={18} />,
        }
      ]
    },
    {
      id: action_id?.navigation.noc,
      name: 'NOC Letter',
      href: '/noc',
      icon: <IconCertificateOff strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.withheld,
      name: 'Withheld',
      href: '/withheld',
      icon: <IconAlignBoxBottomCenter strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.loans,
      name: 'Loans',
      icon: <IconCoins strokeWidth="2px" size={18} />,
      links: [
        {
          name: 'Fuel Loans',
          href: '/loans',
          icon: <IconGasStation strokeWidth="2px" size={18} />,
        },
        {
          name: 'Vehicle Loans',
          href: '/vehicle-loan',
          icon: <IconScooterElectric strokeWidth="2px" size={18} />,
        }
      ]
    },
    {
      id: action_id?.navigation.dealerships,
      name: 'Dealerships',
      href: '/dealership',
      icon: <IconUsers strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.dealerships,
      name: 'Customers',
      href: '/customers',
      icon: <IconUserPlus strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.profileDealer,
      name: 'Profile',
      href: `/dealership/${currentUser.dealership_id}`,
      icon: <IconUserCircle strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.profileTransports,
      name: 'Profile',
      href: '/transports-field',
      icon: <IconUserCircle strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.collection_remarks,
      name: 'Collection Remarks',
      href: '/reports/remarks',
      icon: <IconFileStack strokeWidth="2px" size={18} />
    },

    {
      id: action_id?.navigation.dealer_referral,
      name: 'Dealer Referral',
      href: '/referral',
      icon: <IconReorder strokeWidth="2px" size={18} />
    },
    {
      id: action_id.navigation.profileDealer,
      name: 'Passbook',
      href: '/passbook',
      icon: <IconBooks strokeWidth="2px" size={18} />,
      links: [
        {
          name: 'Dealer Passbook',
          href: '/passbook',
          icon: <IconList strokeWidth="2px" size={18} />
        },
        {
          name: 'Transport Passbook',
          href: '/transport/fastag/details',
          icon: <IconTir strokeWidth="2px" size={18} />
        }
      ]
    },
    {
      id: action_id?.navigation.account_statement,
      name: 'Account Statement',
      href: '/statements',
      icon: <IconChecklist strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.profileTransports,
      name: 'FASTag Passbook',
      href: '/transport/fastag/details',
      icon: <IconList strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.call_request,
      name: 'Call Request',
      href: '/customer/callback',
      icon: <IconPhone strokeWidth="2px" size={18} />
    },
    // {
    //   id: action_id?.navigation.transports,
    //   name: 'Transports',
    //   icon: <IconTruck strokeWidth="2px" size={18} />,
    //   links: [
    //     {
    //       name: 'Transports List',
    //       href: '/transports',
    //       icon: <IconTractor strokeWidth="2px" size={18} />
    //     },
    //     {
    //       name: 'Passbook',
    //       href: '/transport/fastag/details',
    //       icon: <IconBooks strokeWidth="2px" size={18} />
    //     }
    //   ]
    // },
    {
      id: action_id?.navigation.report,
      name: 'Report',
      // href: '/reports',
      icon: <IconReport strokeWidth="2px" size={18} />,
      links: [
        {
          name: 'Opportunity Report',
          href: '/reports/opportunities',
          icon: <IconFileAnalytics strokeWidth="2px" size={18} />
        },
        // {
        //   name: 'DPD Report',
        //   href: '/report/dpd',
        //   icon: <IconFileDescription strokeWidth="2px" size={18} />
        // },
        {
          name: 'PDC Report',
          href: '/report/pdc',
          icon: <IconFileLambda strokeWidth="2px" size={18} />
        },
      ]
    },
    {
      id: action_id?.navigation.users,
      name: 'Users',
      href: '/users',
      icon: <IconUserCircle strokeWidth="2px" size={18} />
    },
    {
      id: action_id?.navigation.settings,
      name: 'Settings',
      href: '/settings',
      icon: <IconSettings strokeWidth="2px" size={18} />
    },
  ]

  let pages = []
  for (let i = 0; i < pageData.length; i++) {
    if (isAllowed(currentUser?.permissions, resources_id?.navigation, pageData[i]?.id)) {
      pages.push(pageData[i])
    }
  }

  return (
    <>
      {/* <Drawer
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
          <Image
            w="auto"
            h={88}
            src="/images/logo.png"
            mx="auto"
            mb="md"
          />

          {/* <Divider light className={classes.divider} />
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
          </div> *

          <SidebarNav
            className={classes.nav}
            pages={pages}
            currentUser={currentUser}
          />
          
          <Text c="blue.4" fz="xs" py="md" tt="uppercase" ta="center">version {packageJSON.version}</Text>
        </div>
      </Drawer> */}

      <ScrollArea>
        <div
          {...rest}
          className={clsx(classes.root, className)}
        >

          {/* <Divider light className={classes.divider} />
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
          </div> */}

          <SidebarNav
            className={classes.nav}
            navLinks={pages}
            currentUser={currentUser}
          />

          <Text c="blue.4" fz="xs" py="md" tt="uppercase" ta="center">version {packageJSON.version}</Text>
        </div>
      </ScrollArea>
    </>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};


export default Sidebar;