import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import { toString } from 'lodash-es/toString';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { LoginWrapper } from './login.css';
import { logger } from '../../config/logger';
import { URL } from '../../config/serverUrls';
import { getOTP, resendOTP } from '../../services/login.service';
import { setCurrentUser } from '../../store/user/user.actions';
import apiCall from '../../utils/api.util';

const packageJSON = require('../../../package.json');

const domain = process.env?.REACT_APP_OTP_ONLY_DOMAINS?.split(/[ ,]+/)
const url = window.location.href.split('/')[2]

const showOtpLogin = () => {
  if(domain){
    if(domain.includes(url)){
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

const useStyles = makeStyles(() => ({
  textFieldStyle: {
    marginBottom: '32px',

    '& .MuiInputLabel-formControl': {
      fontSize: '18px',
      lineHeight: '140%',
      color: '#909191',
      top: '-6px'
    },
    '& .MuiInputBase-input': {
      fontWeight: '500',
      fontSize: '18px',
      lineHeight: '140%'
    }
  },
  buttonStyle: {
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '26px',
    padding: '12px 40px',
    backgroundColor: '#2CAE66',
    borderColor: '#2CAE66',
    boxShadow: 'none',
    width: '170px',

    '&:hover': {
      backgroundColor: '#2CAE66',
      borderColor: '#2CAE66',
      boxShadow: 'none'
    }
  },
  number: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    marginBottom: '32px',

    '& .MuiInputLabel-formControl': {
      fontSize: '18px',
      lineHeight: '140%',
      color: '#909191',
      top: '-6px'
    },
    '& .MuiInputBase-input': {
      fontWeight: '500',
      fontSize: '18px',
      lineHeight: '140%'
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  form: {
    textAlign: 'center',
  },
  resend: {
    color: '#787A91',
    cursor: 'pointer',
    marginTop: 23,
    '&:hover': {
      textDecoration: 'underline',
      color: '#1E88E5'
    }
  }
}));

const Login = ({ setCurrentUser }) => {
  const classes = useStyles();
  const [otpLogin, setOtpLogin] = useState(true);
  const [loginWithOTP, setLoginWithOTP] = useState(true);
  const [isShowOTP, setShowOTPState] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [helperText, setHelperText] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  let validFields = {}
  if(loginWithOTP){
    validFields = {
      otp: Yup.string().nullable().required('Enter OTP')
    }
  } else {
    validFields = {
      password: Yup.string().nullable().required('Enter password')
    }
  }

  const { values, errors, handleChange, handleSubmit, handleReset, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      mobile: Yup.number().nullable('Enter mobile number').required('Enter mobile number').test('maxDigits', 'Mobile Number must have 10 digits', (number) => String(number).length === 10),
      ...validFields
    }),
    onSubmit: values => {
      apiCall(URL.login, {
        method: 'POST',
        body: values
      })
        .then(({ status, data, message }) => {
          // logger(status, data);
          if (status == 'SUCCESS') {
            setCurrentUser(data);
          }
          setApiStatus({ type: status, message })
        })
        .catch(e => {
          logger(e);
          setApiStatus({ type: 'ERROR', message: e?.message })
        });
    }
  });

  const generateOTP = () => {
    if(values?.mobile){
      setHelperText(false)
      getOTP(toString(values.mobile))
        .then((status, message) => {
          if (status === 'SUCCESS') {
            enqueueSnackbar(`OTP Sent to ${values.mobile}`, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            });
            setShowOTPState(st => !st)
            setOtpLogin(false)
            setApiStatus({})      
          } else {
            enqueueSnackbar('Unable to send OTP', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
            console.log('Unable to send OTP')
          }
        })
        .catch((error) => {
          console.log('error', error)
          setApiStatus({ type: 'ERROR', message: error })
        })
    } else {
      setHelperText(true)
    }
  }

  const sendOTP = () => {
    resendOTP(toString(values.mobile))
      .then((status, message) => {
        if (status === 'SUCCESS') {
          enqueueSnackbar(`OTP Sent to ${values.mobile}`, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        }
        else {
          enqueueSnackbar('unable to send OTP', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          console.log('Unable to send OTP')
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  return (
    <LoginWrapper>
      <aside
        style={{
          backgroundImage: 'url("/images/login-bg.png")'
        }}
      >
        <img alt="Logo" src="/images/logo-white.png" />

        <h1>
          {/* <span>Welcome to</span> */}
          Master Data Management
        </h1>
      </aside>

      <div className="right-content">
        <img alt="Logo" src="/images/logo.png" height="112" className="mbl-img" />

        <p className="section-title">
          <span>Login</span>
          Please login to your account
        </p>

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.number}
            inputProps={{ className: classes.input }}
            name="mobile"
            label="Mobile Number"
            type='number'
            fullWidth
            onChange={handleChange}
            value={values.mobile}
            error={helperText ? 'Enter mobile number' : errors.mobile}
            helperText={helperText ? 'Enter mobile number' : errors.mobile}
          />
          {
            loginWithOTP ? (
              isShowOTP ? (
                <>
                  <TextField
                    className={classes.number}
                    name="otp"
                    label="OTP"
                    inputProps={{ className: classes.input }}
                    type="number"
                    onChange={handleChange}
                    fullWidth
                    value={values.otp}
                    error={errors.otp}
                    helperText={errors.otp}
                  />
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        className={classes.buttonStyle}
                        type="submit"
                      >
                        Login
                      </Button>
                      {
                        showOtpLogin() ? null : (
                          <label style={{color: '#1E88E5', cursor: 'pointer', marginTop: 25, fontSize: '1rem'}} onClick={() => {
                            setLoginWithOTP(false)
                            setOtpLogin(false)
                            setFieldValue('otp', undefined)
                          }}>Login with password</label>
                        )
                      }
                    </div>
                    {isShowOTP && <label className={classes.resend} onClick={sendOTP}>Resend OTP</label>}
                  </div>
                </>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={classes.buttonStyle}
                    onClick={generateOTP}
                  >
                    Send OTP
                  </Button>
                  {
                    showOtpLogin() ? null : (
                      <label style={{color: '#1E88E5', cursor: 'pointer', marginTop: 25, fontSize: '1rem'}} onClick={() => {
                        setLoginWithOTP(false)
                        setOtpLogin(false)
                        setFieldValue('otp', undefined)
                      }}>Login with password</label>                      
                    )
                  }
                </div>
              )
            ) : (
              <>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  className={classes.textFieldStyle}
                  onChange={handleChange}
                  value={values.password}
                  error={errors.password}
                  helperText={errors.password}
                />
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={classes.buttonStyle}
                    type="submit"
                  >
                    Login
                  </Button>
                  <label style={{color: '#1E88E5', cursor: 'pointer', marginTop: 25, fontSize: '1rem'}} onClick={() => {
                    setLoginWithOTP(true)
                    setOtpLogin(true)
                    setFieldValue('password', undefined)
                  }}>Login with OTP</label>
                </div>
              </>
            )
          }
          {/* {
            isShowOTP ? (
              <>
                <TextField
                  name="otp"
                  label="OTP"
                  type="number"
                  fullWidth
                  className={classes.textFieldStyle}
                />
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  hidden={!isShowOTP}
                  className={classes.buttonStyle}
                  onClick={() => null}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  className={classes.textFieldStyle}
                  onChange={handleChange}
                  value={values.password}
                  error={errors.password}
                  helperText={errors.password}
                />

              </>
            )
          } */}
        </form>

        <Box pt={2}>
          {
            apiStatus.type && (
              <Alert severity={apiStatus.type.toLowerCase()}>{apiStatus.message}</Alert>
            )
          }
          {/* <Button
            size="small"
            onClick={() => setShowOTPState(!isShowOTP)}
          >
            {isShowOTP ? 'Login with Password' : 'Login with OTP'}
          </Button> */}
        </Box>

        <Box pt={2}>
          <p style={{ color: '#888' }}>v{packageJSON.version}</p>
        </Box>
      </div>

    </LoginWrapper >
  );
};

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);