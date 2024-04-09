import { Badge, Box, Burger, Flex, Group, Image, Menu, Text, Title } from '@mantine/core';
// import { makeStyles } from '@material-ui/styles';
// import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import styled from 'styled-components';
import { rulesList } from '../../config/userRules';
import { resetCurrentUser } from '../../store/user/user.actions';
import LoginUserInfo from '../CommonComponents/LoginUserInfo';
import NotificationSidebar from '../CommonComponents/NotificationSidebar';
import { permissionCheck } from '../UserCan/UserCan';
import { format } from 'date-fns';
import { IconExternalLink, IconSelector } from '@tabler/icons-react';

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
  const { onSidebarOpen, user, logout, match, history, goBackIcon, appBarProps } = props;
  // const classes = useStyles();
  // const { enqueueSnackbar } = useSnackbar();
  // const [loading, setLoading] = useState(false)
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const editable = permissionCheck(user.role_name, rulesList.dealer_edit)
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 900);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
        className="bg-white h-[60px] flex items-center px-4 border-b z-10 border-b-gray-200"
        {...appBarProps}
      >
        {/* {goBackIcon && editable && (
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
        )} */}

        <Group gap={10} className='items-center' ml={4}>
          <Image
            w={40}
            h={40}
            src="/images/logo.png"
            mx="auto"
          />
          <Title order={3} sx={{ marginLeft: 12 }}>
            <span className='text-red-500'>Petro</span>
            <span className='text-green-800'>money</span>
          </Title>
        </Group>

        {/* {match?.path?.toLowerCase() == '/passbook' && (
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

        <Flex gap='sm' align='center' ml='auto'>
          <Menu
            width={150}
            withArrow
            styles={{
              item: {
                padding: '4px 10px'
              }
            }}
            position="bottom-end"
          >
            <Menu.Target>
              <Box style={{ background: '#f6f6f6', padding: 6, borderRadius: 6, cursor: 'pointer' }}>
                <Group gap={6}>
                  <Badge variant='light' color='orange'>LOS</Badge>
                  <IconSelector size={16} />
                </Group>
              </Box>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Our Other Services</Menu.Label>
              <Menu.Item onClick={() => window.open('https://lms-uat.petromoney.in/', '_self')}><Badge leftSection={<IconExternalLink style={{ width: 14, height: 14 }} />} variant='light' color='blue'>LMS</Badge></Menu.Item>
              <Menu.Item onClick={() => window.open('https://ddms-uat.petromoney.in/', '_self')}><Badge leftSection={<IconExternalLink style={{ width: 14, height: 14 }} />} variant='light' color='green'>DDMS</Badge></Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Box
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', columnGap: '5px', width: 260 }}
          >
            <Text size={'xs'} c={'gray'} fw={'600'}>Calendar Time: </Text>
            <Text size={'xs'} c={'gray'}>
              {format(time, 'MMM d yyyy')} {format(time, 'hh:mm:ss')}
            </Text>
          </Box>
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

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser())
})

export default connect(null, mapDispatchToProps)(withRouter(Topbar));