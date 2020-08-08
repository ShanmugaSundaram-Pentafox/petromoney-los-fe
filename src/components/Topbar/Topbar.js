import React, { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
// import InputIcon from '@material-ui/icons/Input';
import { connect } from 'react-redux';
import { resetCurrentUser } from '../../store/user/user.actions';

const useStyles = makeStyles(theme => {
  return ({
  root: {
    boxShadow: 'none',
    color: theme.palette.primary.dark,
    backgroundColor: 'transparent',
    // boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)',
    // backgroundColor: theme.palette.white,
    borderBottomColor: theme.palette.grey
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  logoLink: {
    backgroundColor: theme.palette.white
  },
  title: {
    ...theme.typography.h2,
    fontSize: 18,
  }
})
});

const Topbar = props => {
  const { className, onSidebarOpen, pageTitle, logout, ...rest } = props;
  const classes = useStyles();

  const [notifications] = useState([]);

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        {/* <RouterLink to="/" className={classes.logoLink}>
          <img
            alt="Logo"
            src="/images/logo.png"
            height="48px"
          />
        </RouterLink> */}
        <h2 className={classes.title}>{pageTitle}</h2>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* <Tooltip title="Logout">
            <IconButton
              className={classes.signOutButton}
              color="inherit"
              onClick={logout}
            >
              <InputIcon />
            </IconButton>
          </Tooltip> */}
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

const mapStateToProps = ({ common }) => ({
  pageTitle: common.pageTitle,
  searchText: common.searchText
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);