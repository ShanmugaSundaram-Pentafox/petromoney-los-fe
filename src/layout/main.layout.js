import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { resetCurrentUser } from '../store/user/user.actions';
import { AppShell, Box, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import EnquiryPage from '../pages/enquiryPage/EnquiryPage';
// import AddDealerForm from '../pages/hpcl/AddDealerForm';
// import HPCL from '../pages/hpcl/HPCL';

const useStyles = makeStyles(theme => ({
  root: {
    // paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      // paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const MainLayout = props => {
  const { children, currentUser, logout } = props;
  const [opened, { toggle }] = useDisclosure();

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;
  return (
    <>
      {/* <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <Sidebar
          user={currentUser}
          currentUser={currentUser}
          onOpen={handleSidebarOpen}
          onClose={handleSidebarClose}
          open={shouldOpenSidebar}
          variant={isDesktop ? 'persistent' : 'temporary'}
        />

        <main className={classes.content}>
          <Topbar user={currentUser} logout={logout} appBarProps={{
            position: 'sticky',
          }}  
          onSidebarOpen= {handleSidebarOpen}
          />
          <Box p={2}>
            {children}
          </Box>
          {/* <Footer /> *

          {/* <HPCL /> *
          {/* <AddDealerForm /> *
          {/* <EnquiryPage /> *
        </main>
      </div> */}

      <AppShell
        navbar={{
          width: 240,
          breakpoint: 'md',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Navbar>
          <Sidebar
            user={currentUser}
            currentUser={currentUser}
            onOpen={handleSidebarOpen}
            onClose={handleSidebarClose}
            open={shouldOpenSidebar}
            variant={isDesktop ? 'persistent' : 'temporary'}
          />
        </AppShell.Navbar>

        <AppShell.Main className="overflow-hidden">
          <Topbar 
            user={currentUser} 
            logout={logout} 
            appBarProps={{
              position: 'sticky',
            }}  
            onSidebarOpen={toggle}
          />

          <Box p="md">
            {children}
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
});

export default connect(null, mapDispatchToProps)(MainLayout);