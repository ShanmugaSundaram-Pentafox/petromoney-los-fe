import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
// import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, Tooltip, IconButton, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
// import ToggleButton from '@material-ui/lab/ToggleButton';
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// import InputIcon from '@material-ui/icons/Input';
import { connect } from 'react-redux';
import { resetCurrentUser } from '../../store/user/user.actions';
// import NotificationsBell from '../CommonComponents/NotificationsBell';
import LoginUserInfo from '../CommonComponents/LoginUserInfo';
import NotificationSidebar from '../CommonComponents/NotificationSidebar';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { setDashboardView } from '../../store/common/common.actions';
import AddNewUserAction from '../AddNewUser/AddNewUserAction';
// import Searchbox from '../CommonComponents/Searchbox';

const useStyles = makeStyles(theme => {
  return ({
  root: {
    boxShadow: 'none',
    color: theme.palette.primary.dark,
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)',
    backgroundColor: theme.palette.white,
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
    display: 'flex',
    alignItems: 'center',
  },
  optionsContainer: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(1),
    borderRadius: 20,
    boxShadow: `inset 0 0 8px 0px #cdcdcd`,
  },
  actionsContainer: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  goback: {
    marginRight: theme.spacing(1)
  }
})
});

const Topbar = props => {
  const { className, onSidebarOpen, pageTitle, user, logout, match, history, goBackIcon, appBarProps, dashboardView, updateDashboardView } = props;
  const classes = useStyles();
  console.log("open",onSidebarOpen)

  // const [notifications] = useState([]);

  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  useEffect(() => {

  }, [dashboardView])

  return (
    <Fragment>
      <AppBar
        {...appBarProps}
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
          {
            goBackIcon && (
              <Tooltip title="Go Back">
                <IconButton edge="start" className={classes.goback} color="inherit" aria-label="goback" onClick={history.goBack}>
                  <ArrowBackIosRoundedIcon />
                </IconButton>
              </Tooltip>
            )
          }
          <h2 className={classes.title}>
            {pageTitle}
            {
              pageTitle?.toLowerCase() == "dashboard" && (
                <span className={classes.optionsContainer}>
                  <RadioGroup onChange={(e, v) => updateDashboardView(v)} row aria-label="dashboard-view-type" name="dashboard-view-type" defaultValue={dashboardView}>
                    <Tooltip title="Loan Origination System">
                      <FormControlLabel
                        value="LOS"
                        control={<Radio color="primary" />}
                        label="LOS"
                      />
                    </Tooltip>
                    <Tooltip title="Loan Management System">
                      <FormControlLabel
                        value="LMS"
                        control={<Radio color="secondary" />}
                        label="LMS"
                      />
                    </Tooltip>
                  </RadioGroup>
                </span>
              )
            }

            {
              match?.path?.toLowerCase() == "/users" && (
                <span className={classes.actionsContainer}>
                  <AddNewUserAction />
                </span>
              )
            }
          </h2>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            {/* <Searchbox /> */}
            {/* <NotificationsBell action={() => setShowNotificationSidebar(true)} /> */}
            <LoginUserInfo user={user} logout={logout} />
  
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
  
      <NotificationSidebar showNotification={showNotificationSidebar} closeButton={() => setShowNotificationSidebar(false)} />
    </Fragment>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

const mapStateToProps = ({ common, users }) => ({
  pageTitle: common.pageTitle,
  dashboardView: common.dashboardView,
  goBackIcon: common.goBackIcon,
  searchText: common.searchText
})

const mapDispatchToProps = dispatch => ({
  updateDashboardView: view => dispatch(setDashboardView(view)),
  logout: () => dispatch(resetCurrentUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Topbar));