import React, { useState } from "react";
import { connect } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.actions';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginWrapper } from "./login.css";
import { URL } from '../../config/serverUrls';
import { logger } from '../../config/logger';
import apiCall from "../../utils/api.util";
import Alert from "@material-ui/lab/Alert";
import { getOTP } from "../../services/login.service";

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
    marginTop: '12px',

    '&:hover': {
      backgroundColor: '#2CAE66',
      borderColor: '#2CAE66',
      boxShadow: 'none'
    }
  },
  number: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  },
  input: {
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  },
  form: {
    textAlign: 'center',
  }
}));

const Login = ({ setCurrentUser }) => {
  const classes = useStyles();
  const [isShowOTP, setShowOTPState] = useState(false);
  const [apiStatus, setApiStatus] = useState({});

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      mobile: Yup.number().nullable('Enter mobile number').required("Enter mobile number").test("maxDigits", "Mobile Number must have 10 digits", (number) => String(number).length === 10),
      // password: Yup.string().nullable('Enter password').required("Enter password"),
      // otp: Yup.number().required('Please enter OTP').nullable('Enter OTP').test("maxDigits", "OTP must be 4 digits", (number) => String(number).length === 4)
      otp: Yup.string().nullable().required('Enter OTP')
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
          setApiStatus({ type: "ERROR", message: e?.message })
        });
    }
  });

  const sendOTP = () => {
    getOTP(values.mobile)
      .then((status, message) => {
        if (status === 'SUCCESS') {
          setShowOTPState(st => !st)
        }
        else {
          console.log("Unable to send OTP")
        }
      })
      .catch((error) => {
        console.log("error", error)
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
            // inputProps={{ className: classes.input }}
            name="mobile"
            label="Mobile Number"
            type='number'
            fullWidth
            className={classes.textFieldStyle}
            onChange={handleChange}
            value={values.mobile}
            error={errors.mobile}
            helperText={errors.mobile}
          />
          {!isShowOTP && <label>Resend OTP</label>}
          {
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
                  className={classes.textFieldStyle}
                />
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  className={classes.buttonStyle}
                  // onClick={sendOTP}
                  type="submit"
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  className={classes.buttonStyle}
                  onClick={sendOTP}
                >
                  Send OTP
                </Button>
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
      </div>
    </LoginWrapper >
  );
};

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);