import {
  Alert,
  Box,
  TextInput,
  Text,
  Button,
  Title,
  PasswordInput,
  Badge,
  PinInput,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';
import { getOTP, resendOTP, resetPassword } from '../../services/login.service';
import classes from './loginNew.module.css';
import apiCall from '../../utils/api.util';
import AccessPermission from '../../utils/cerbos';
import { URL } from '../../config/serverUrls';
import { logger } from '../../config/logger';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.actions';
import { IconAlertCircle, IconLock, IconPhone } from '@tabler/icons-react';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';

const domain = process.env?.REACT_APP_OTP_ONLY_DOMAINS?.split(/[ ,]+/)
const url = window.location.href.split('/')[2]

const showOtpLogin = () => {
  if (domain) {
    if (domain.includes(url)) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

const LoginForm = ({ setCurrentUser }) => {
  const form = useForm({
    validate: {
      mobile: (value) => (value.length < 2 ? 'Please enter your mobile number' : null),
    },
  });
  const [forgetPass, setForgetPass] = useState(false);
  const [loginWithOTP, setLoginWithOTP] = useState(true);
  const [isShowOTP, setShowOTPState] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [helperText, setHelperText] = useState(false)

  const goBackLogin = () => {
    setForgetPass(false);
    setShowOTPState(false);
  }

  const onSubmit = (values) => {
    if (forgetPass) {
      let body = { mobile: values?.mobile, otp: values?.otp, password: values?.new_password }
      resetPassword(body)
        .then(res => {
          if (res?.status === 'SUCCESS') {
            setApiStatus({ type: 'SUCCESS', message: 'Password Successfully Reset!' })
            setTimeout(() => {
              goBackLogin();
              setApiStatus({});
            }, 2000);
          } else {
            setApiStatus({ type: 'ERROR', message: res?.message })
          }
        })
        .catch(e => {
          setApiStatus({ type: 'ERROR', message: e })
        })
    } else {
      apiCall(URL.login, {
        method: 'POST',
        body: values
      })
        .then(({ status, data, message }) => {
          if (status == 'SUCCESS') {
            AccessPermission(data)
              .then(({ results }) => {
                let permissions = {}
                for (const res of results) {
                  const { resource, actions } = res;
                  for (let key in actions) {
                    permissions[`${resource?.kind}_${key}`] = actions[key];
                  }
                }
                setCurrentUser({ ...data, access: results, permissions: permissions })
              })
              .catch(e => console.log(e))
          }
          setApiStatus({ type: status, message })
        })
        .catch(e => {
          logger(e);
          setApiStatus({ type: 'ERROR', message: e?.message })
        });
    }
  }

  const generateOTP = () => {
    if (form?.values?.mobile) {
      setHelperText(false)
      getOTP(form?.values?.mobile?.toString())
        .then((status, message) => {
          if (status === 'SUCCESS') {
            displayNotification({
              message: `OTP Sent to ${form?.values?.mobile}`,
              variant: 'success',
            })
            setShowOTPState(st => !st)
            setApiStatus({})
          } else {
            displayNotification({
              message: 'Unable to send OTP',
              variant: 'error',
            })
            console.log('Unable to send OTP')
          }
        })
        .catch((error) => {
          displayNotification({
            message: 'Unable to send OTP',
            variant: 'error',
          })
          console.log('error', error)
          setApiStatus({ type: 'ERROR', message: error })
        })
    } else {
      setHelperText(true)
    }
  }

  const sendOTP = () => {
    resendOTP(form?.values?.mobile?.toString())
      .then((status, message) => {
        if (status === 'SUCCESS') {
          displayNotification({
            message: `OTP Sent to ${form?.values?.mobile}`,
            variant: 'success',
          })
          console.log('>>>>>>> success');
        }
        else {
          displayNotification({
            message: 'Unable to send OTP',
            variant: 'error',
          })
          console.log('Unable to send OTP')
        }
      })
      .catch((error) => {
        displayNotification({
          message: 'Unable to send OTP',
          variant: 'error',
        })
        console.log('error', error)
      })
  }

  return (
    <Box className={classes.login_card}>
      <Box className={classes.logo_container}>
        <img alt='Logo' src='/images/logo-white.png' className={classes.logo} />
      </Box>
      <Box style={{ marginBottom: '2rem' }}>
        <Title order={2}>Login</Title>
        <Text variant='h3' style={{ color: 'rgb(0,0,0,0.4)' }}>
          {!forgetPass ? 'Please login to your account' : 'Please enter your mobile number to request a password reset.'}
        </Text>
      </Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          id='mobile'
          label='Mobile Number'
          type='number'
          // size='xs'
          // error={errors?.mobile?.message}
          leftSection={<IconPhone size={16} />}
          {...form.getInputProps('mobile')}
        />
        {
          loginWithOTP ? (
            isShowOTP ? (
              <>
                <Box>
                  <Text style={{ fontSize: 13 }} fw={600} c={'rgb(73, 80, 87)'} mb={4}>Enter OTP</Text>
                  <Group justify='space-between' style={{ flexWrap: 'nowrap' }} gap={6}>
                    <PinInput
                      label={'OTP'}
                      type={'number'}
                      gap={4}
                      {...form.getInputProps('otp')}
                    />
                    {/* {isShowOTP && <label className={classes.resend} onClick={sendOTP}>Resend OTP</label>} */}
                    {isShowOTP &&
                      <Button variant='white' color='gray' onClick={sendOTP} fullWidth>Resend OTP</Button>
                    }
                  </Group>
                </Box>
                {
                  forgetPass &&
                  <>
                    <PasswordInput
                      id='new_password'
                      variant='filled'
                      label='New Password'
                      // size='xs'
                      // error={errors?.password?.message}
                      leftSection={<IconLock size={16} />}
                      {...form.getInputProps('new_password')}
                    />
                    <PasswordInput
                      id='confirm_password'
                      variant='filled'
                      label='Confirm Password'
                      // size='xs'
                      // error={errors?.password?.message}
                      leftSection={<IconLock size={16} />}
                      {...form.getInputProps('confirm_password')}
                    />
                  </>
                }
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                  {/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
                  <Button
                    type="submit"
                    fullWidth
                    mt={10}
                    color={!forgetPass ? 'green' : 'red'}
                  >
                    {
                      !forgetPass ? 'Login' : 'Reset Password'
                    }
                  </Button>
                  {forgetPass && <label className={classes.returnLabel} style={{ cursor: 'pointer' }}>Return to <span style={{ color: '#1E88E5' }} onClick={goBackLogin}>Login Page</span></label>}
                  {
                    showOtpLogin() || forgetPass ? null : (
                      <label className={classes.label} style={{ cursor: 'pointer' }} onClick={() => {
                        setLoginWithOTP(false)
                        // setOtpLogin(false)
                        form.setFieldValue('otp', undefined)
                      }}>Login with password</label>
                    )
                  }
                  {/* </div> */}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Button
                  fullWidth
                  onClick={generateOTP}
                  color={'green'}
                  mt={10}
                >
                  Send OTP
                </Button>

                {
                  !forgetPass ?
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                      {
                        showOtpLogin() ? null : (
                          <label className={classes.label} style={{ cursor: 'pointer' }} onClick={() => {
                            setLoginWithOTP(false)
                            // setOtpLogin(false)
                            form.setFieldValue('otp', undefined)
                          }}>Login with password</label>
                        )
                      }
                      <label className={classes.forgetLabel} style={{ cursor: 'pointer' }} onClick={() => {
                        setLoginWithOTP(true)
                        setForgetPass(true)
                      }}>Forgot Password ?</label>
                    </div> :
                    <label className={classes.returnLabel}>Return to <span style={{ color: '#1E88E5' }} onClick={goBackLogin}>Login Page</span></label>
                }
              </div>
            )
          ) : (
            <>
              <PasswordInput
                id='password'
                variant='filled'
                label='Password'
                // size='xs'
                // error={errors?.password?.message}
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('password')}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Button
                  mt={10}
                  type="submit"
                  fullWidth
                  color='green'
                >
                  Login
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <label className={classes.label} style={{ cursor: 'pointer' }} onClick={() => {
                    setLoginWithOTP(true)
                    form.setFieldValue('password', undefined)
                  }}>Login with OTP</label>
                  <label className={classes.forgetLabel} style={{ cursor: 'pointer' }} onClick={() => {
                    setLoginWithOTP(!loginWithOTP)
                    setForgetPass(true)
                  }}>Forget Password ?</label>
                </div>
              </div>
            </>
          )}
        {/* <PasswordInput
          id='password'
          variant='filled'
          label='Password'
          // size='xs'
          // error={errors?.password?.message}
          leftSection={<IconLock size={16} />}
          {...form.getInputProps('password')}
        /> */}
        {/* <Button
          variant='filled'
          // loading={loading}
          mt={14}
          color='green'
          // size='xs'
          // type='submit'
          fullWidth
        >
          Login
        </Button> */}
      </form>
      {apiStatus.type && (
        <Box mt='md'>
          <Alert icon={<IconAlertCircle size={16} />} withCloseButton={false} color='red'>
            {apiStatus?.message}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(LoginForm);
