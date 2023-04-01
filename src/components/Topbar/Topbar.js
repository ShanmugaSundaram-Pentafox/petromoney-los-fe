import { AppBar, Toolbar, Hidden, Tooltip, IconButton, Button, CircularProgress } from '@material-ui/core';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import MenuIcon from '@material-ui/icons/Menu';
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
import { getPassbookDetails } from '../../services/common.service';
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
    title: {
      ...theme.typography.h2,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
    },
    topbarStyle: {
      minHeight: 48
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
  const { className, onSidebarOpen, pageTitle, user, logout, match, history, goBackIcon, appBarProps} = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false)
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const editable = permissionCheck(user.role_name, rulesList.dealer_edit)

  const handleStatementShare = (action) => {
    setLoading(true)
    getPassbookDetails(user?.dealership_id, action)
      .then(res => {
        setLoading(false)
        if (action === 'download') { window.open(res?.data, '_blank') }
        if (action === 'share') {
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
              match?.path?.toLowerCase() == '/users' && (
                <span className={classes.actionsContainer}>
                  <AddNewUserAction currentUser={user} />
                </span>
              )
            }
            {
              match?.path?.toLowerCase() == '/passbook' && (
                <span className={classes.actionsContainer}>
                  <Tooltip title="Download">
                    <Button className={classes.refresh} size='small' startIcon={<DownloadIcon style={{ width: 18, height: 18 }} />} onClick={() => handleStatementShare('download')}>Download</Button>
                  </Tooltip>
                  <Tooltip title="Share">
                    {
                      loading ? <div style={{ marginLeft: 30, display: 'inline' }}><CircularProgress size={15} /></div> :
                        <Button className={classes.refresh} size='small' style={{ marginLeft: 9 }} startIcon={<ShareIcon fontSize='small' />} onClick={() => handleStatementShare('share')}>Share</Button>
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

const mapStateToProps = ({ common }) => ({
  pageTitle: common.pageTitle,
  goBackIcon: common.goBackIcon,
  searchText: common.searchText
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Topbar));