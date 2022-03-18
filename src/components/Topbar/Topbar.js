import { AppBar, Toolbar, Hidden, Tooltip, IconButton, RadioGroup, Radio, FormControlLabel, Button, CircularProgress } from '@material-ui/core';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { rulesList } from '../../config/userRules';
import { ReactComponent as DownloadIcon } from '../../icons/downloadIcon.svg';
import SendEmailAction from '../../pages/reports/SendEmailAction';
import { getPassbookDetails, refreshRedis } from '../../services/common.service';
import { setDashboardView } from '../../store/common/common.actions';
import { resetCurrentUser } from '../../store/user/user.actions';
import AddNewUserAction from '../AddNewUser/AddNewUserAction';
import LoginUserInfo from '../CommonComponents/LoginUserInfo';
import NotificationSidebar from '../CommonComponents/NotificationSidebar';
import { permissionCheck } from '../UserCan/UserCan';

const useStyles = makeStyles(theme => {
  return ({
    root: {
      color: theme.palette.primary.dark,
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
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
    },
    topbarStyle: {
      minHeight: 48
    },
    optionsContainer: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      marginLeft: theme.spacing(1),
      borderRadius: 20,
      boxShadow: 'inset 0 0 8px 0px #cdcdcd',
    },
    actionsContainer: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
    goback: {
      marginRight: theme.spacing(1)
    },
    refresh: {
      borderRadius: 4,
      '&:hover': {
        backgroundColor: '#f4f4f4'
      }
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
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false)
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const editable = permissionCheck(user.role_name, rulesList.dealer_edit)
  const handleRefresh = () => {
    refreshRedis()
      .then(message => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }

  const handleStatementShare = (action) => {
    setLoading(true)
    getPassbookDetails(user?.dealership_id, action)
      .then(res => {
        setLoading(false)
        if(action === 'download') {window.open(res?.data, '_blank')}
        if(action === 'share'){
          enqueueSnackbar(res?.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        }
      })
      .catch(e => {
        setLoading(false)
        console.log(e);
      })
  }
  return (
    <Fragment>
      <AppBar
        {...appBarProps}
        className={clsx(classes.root, className)}
      >
        <Toolbar className={classes.topbarStyle}>
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
                {
                  Array.isArray(pageTitle) && pageTitle.map((item, i) => (
                    <CardWrapper key={i}>
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
              typeof pageTitle === 'string' && pageTitle?.toLowerCase() == 'dashboard' && user.role_name != 'DEALER' ? (
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
              typeof pageTitle === 'string' && pageTitle?.toLowerCase() == 'dashboard' && user.role_name === 'ADMIN' && dashboardView === 'LMS' && (
                <Button className={classes.refresh} size='small' style={{marginLeft: 12}} onClick={handleRefresh} startIcon={<RefreshIcon fontSize='small'/>}><span style={{color: 'hsl(0,0%,65%)', fontWeight: 500}}>Refresh</span></Button>
              )
            }

            {
              match?.path?.toLowerCase() == '/users' && (
                <span className={classes.actionsContainer}>
                  <AddNewUserAction />
                </span>
              )
            }
            {
              match?.path?.toLowerCase() == '/reports/due' && (
                <span className={classes.actionsContainer}>
                  <SendEmailAction />
                </span>
              )
            }
            {
              match?.path?.toLowerCase() == '/reports/overdue' && (
                <span className={classes.actionsContainer}>
                  <SendEmailAction />
                </span>
              )
            }
            {
              match?.path?.toLowerCase() == '/passbook' && (
                <span className={classes.actionsContainer}>
                  <Tooltip title="Download">
                    <Button className={classes.refresh} size='small' startIcon={<DownloadIcon style={{width:18, height:18}} />} onClick={() => handleStatementShare('download')}>Download</Button>
                  </Tooltip>
                  <Tooltip title="Share">
                    {
                      loading ? <div style={{marginLeft: 30, display: 'inline'}}><CircularProgress size={15} /></div> :
                      <Button className={classes.refresh} size='small' style={{marginLeft:9}} startIcon={<ShareIcon fontSize='small'/>} onClick={() => handleStatementShare('share')}>Share</Button>
                    }
                  </Tooltip>
                </span>
              )
            }


          </h2>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <LoginUserInfo user={user} logout={logout} />
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