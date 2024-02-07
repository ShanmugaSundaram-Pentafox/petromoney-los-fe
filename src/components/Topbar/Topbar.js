import { ActionIcon, Box, Burger, Flex, Title, Tooltip } from '@mantine/core';
// import { makeStyles } from '@material-ui/styles';
// import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import styled from 'styled-components';
import { rulesList } from '../../config/userRules';
import { getPassbookDetails } from '../../services/common.service';
import { resetCurrentUser } from '../../store/user/user.actions';
import LoginUserInfo from '../CommonComponents/LoginUserInfo';
import NotificationSidebar from '../CommonComponents/NotificationSidebar';
import { permissionCheck } from '../UserCan/UserCan';

// const useStyles = makeStyles(theme => {
//   return ({
//     root: {
//       color: theme.palette.primary.dark,
//       boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 2px 0 rgba(63,63,68,0.15)',
//       backgroundColor: theme.palette.white,
//       borderBottomColor: theme.palette.grey
//     },
//     flexGrow: {
//       flexGrow: 1
//     },
//     title: {
//       ...theme.typography.h2,
//       fontSize: 16,
//       display: 'flex',
//       alignItems: 'center',
//     },
//     topbarStyle: {
//       minHeight: 48
//     },
//     actionsContainer: {
//       paddingRight: theme.spacing(2),
//       paddingLeft: theme.spacing(2),
//       marginLeft: theme.spacing(1),
//     },
//     goback: {
//       marginRight: theme.spacing(1)
//     },
//     refresh: {
//       borderRadius: 4,
//       '&:hover': {
//         backgroundColor: '#f4f4f4'
//       }
//     }
//   })
// });

const Topbar = (props) => {
  const { onSidebarOpen, pageTitle, user, logout, match, history, goBackIcon, appBarProps} = props;
  // const classes = useStyles();
  // const { enqueueSnackbar } = useSnackbar();
  // const [loading, setLoading] = useState(false)
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const editable = permissionCheck(user.role_name, rulesList.dealer_edit)

  // const handleStatementShare = (action) => {
  //   setLoading(true)
  //   getPassbookDetails(user?.dealership_id, action)
  //     .then(res => {
  //       setLoading(false)
  //       if (action === 'download') { window.open(res?.data, '_blank') }
  //       if (action === 'share') {
  //         enqueueSnackbar(res?.message, {
  //           anchorOrigin: {
  //             vertical: 'top',
  //             horizontal: 'right',
  //           },
  //           variant: 'success',
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       setLoading(false)
  //       console.log(e);
  //     })
  // }

  return (
    <>
      <Box 
        component="header"
        className="bg-white h-16 flex items-center px-4 border-b border-b-gray-200" 
        {...appBarProps}
      >
        {goBackIcon && editable && (
          <Tooltip fz="xs" px="8" py="2.5" offset={2} label="Go Back">
            <ActionIcon 
              variant="subtle" 
              size="lg" 
              aria-label="Go back"
              onClick={history.goBack}
              color='gray.9'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </ActionIcon>
          </Tooltip>    
        )}

        <Title order={3}>
          {typeof pageTitle === 'string' ? pageTitle : null}
        </Title>

        {/* {match?.path?.toLowerCase() == '/users' && (
          <span 
            // className={classes.actionsContainer}
          >
            <AddNewUserAction currentUser={user} />
          </span>
        )}

        {match?.path?.toLowerCase() == '/passbook' && (
          <span>
            <Tooltip title="Download">
              <Button 
                // className={classes.refresh} 
                size='small' 
                startIcon={<DownloadIcon style={{ width: 18, height: 18 }} />} 
                onClick={() => handleStatementShare('download')}
              >
                Download
              </Button>
            </Tooltip>

            <Tooltip title="Share">
              {loading ? (
                <div style={{ marginLeft: 30, display: 'inline' }}>
                  <CircularProgress size={15} />
                </div> 
              ) : (
                <Button 
                  // className={classes.refresh} 
                  size='small' 
                  style={{ marginLeft: 9 }} 
                  startIcon={<ShareIcon fontSize='small' />} 
                  onClick={() => handleStatementShare('share')}
                >
                  Share
                </Button>
              )}
            </Tooltip>
          </span>
        )} */}
        
        {typeof pageTitle !== 'string' && (
          <div className="hidden lg:block py-4">
            <dl className="grid grid-flow-col auto-cols-max overflow-hidden divide-x divide-gray-200">
              {Array.isArray(pageTitle) && pageTitle.map((item, i) => (
                <div key={item.name + i} className="px-4">
                  <dt className="text-xs font-normal text-gray-900">
                    {item.label}
                  </dt>

                  <dd className="mt-0.5 flex text-xs font-semibold text-blue-500">
                    {item.value || '-'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <Flex gap='sm' align='center' ml='auto'>
          <LoginUserInfo user={user} logout={logout} />

          <Burger
            onClick={onSidebarOpen}
            hiddenFrom="md"
            size="sm"
          />
        </Flex>
      </Box>

      <NotificationSidebar 
        showNotification={showNotificationSidebar} 
        closeButton={() => setShowNotificationSidebar(false)} 
      />
    </>
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