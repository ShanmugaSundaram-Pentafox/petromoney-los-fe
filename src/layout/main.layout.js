import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { resetCurrentUser } from '../store/user/user.actions';


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
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Sidebar
        user={currentUser}
        onOpen={handleSidebarOpen}
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
        />
      <main className={classes.content}>
        <Topbar user={currentUser} logout={logout} position="static" onSidebarOpen={handleSidebarOpen} />
        {children}
        {/* <Footer /> */}
      </main>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
});

export default connect(null, mapDispatchToProps)(MainLayout);