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
import InputIcon from '@material-ui/icons/Input';
import { connect } from 'react-redux';
import { resetCurrentUser, setCurrentUser } from '../../store/user/user.actions';
// import NotificationsBell from '../CommonComponents/NotificationsBell';
import LoginUserInfo from '../CommonComponents/LoginUserInfo';
import NotificationSidebar from '../CommonComponents/NotificationSidebar';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { setDashboardView } from '../../store/common/common.actions';
import AddNewUserAction from '../AddNewUser/AddNewUserAction';
import SendEmailAction from '../../pages/reports/SendEmailAction';
import { permissionCheck } from '../UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import styled from 'styled-components';
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
      color: '#DC143C',
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
const CardWrapper = styled.div`
  border-radius: 4px;
  color: #343434;
  position: relative;
  cursor: pointer;
  line-height:1.5;
  flex: 1;
  min-width: 140px;
  text-align: center;
  border-right: ${props => props.noBorder ? 'none' : '1px dashed #ccc'};
  .stat-number-block {
    display: flex;
    padding: 16px;
    padding-bottom: 0;
    justify-content: space-between;

    .stat-number {
      color:#525252;
      font-size: 10px;
      // line-height:1.2;
      font-weight: 600;
      flex: 1;
    }
    
  }
  .stat-desc {
    // padding: 8px 16px 12px 16px;
    padding-bottom:14px;
    // line-height:1;
    font-size: 12px;
  }
`;


const Topbar = (props) => {
  const { className, onSidebarOpen, pageTitle, user, logout, match, history, goBackIcon, appBarProps, dashboardView, updateDashboardView } = props;
  const classes = useStyles();
  // const [notifications] = useState([]);
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  useEffect(() => {

  }, [dashboardView])
  const editable = permissionCheck(user.role_name, rulesList.dealer_edit)
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

            goBackIcon && editable && (
              <Tooltip title="Go Back">
                <IconButton edge="start" className={classes.goback} color="inherit" aria-label="goback" onClick={history.goBack}>
                  <ArrowBackIosRoundedIcon />
                </IconButton>
              </Tooltip>
            )
          }
          <h2 className={classes.title}>
            {typeof pageTitle === 'string' ? pageTitle : (
              <>
                {/* <pageTitle /> */}
                {
                  Array.isArray(pageTitle) && pageTitle.map((item, i) => (
                    <CardWrapper>
                      <div>
                        <div className="stat-number-block">
                          <div className="stat-number">
                            {item?.label}
                          </div>
                        </div>
                        <div className="stat-desc">{item.value || '-'}</div>
                      </div>
                    </CardWrapper>
                  ))
                }
              </>
            )}
            {
              typeof pageTitle === 'string' && pageTitle?.toLowerCase() == "dashboard" && user.role_name != "DEALER" ? (
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
              ) : null
            }

            {
              match?.path?.toLowerCase() == "/users" && (
                <span className={classes.actionsContainer}>
                  <AddNewUserAction />
                </span>
              )
            }
            {
              match?.path?.toLowerCase() == "/reports/due" && (
                <span className={classes.actionsContainer}>
                  <SendEmailAction />
                </span>
              )
            }
            {
              match?.path?.toLowerCase() == "/reports/overdue" && (
                <span className={classes.actionsContainer}>
                  <SendEmailAction />
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
          {/* <Hidden lgUp>
            <Searchbox />
            <NotificationsBell action={() => setShowNotificationSidebar(true)} />
            <LoginUserInfo user={user} logout={logout} />
            <Tooltip title="Logout">
              <IconButton
                className={classes.signOutButton}
                color="inherit"
                onClick={logout}
              >
                <InputIcon />
              </IconButton>
            </Tooltip>
          </Hidden> */}
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