// import { Link } from 'react-router-dom';
// import Avatar from '@material-ui/core/Avatar';
import { colors } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import StyledLink from '@material-ui/core/Link';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { logger } from '../../config/logger';
import { URL } from '../../config/serverUrls';
import { setCurrentUser } from '../../store/user/user.actions';
import apiCall from '../../utils/api.util';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(16),
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 15px 0 -25px rgba(63,63,68,0.1), 0 1px 16px 0 rgba(63,63,68,0.15)',
    padding: theme.spacing(3),
    background: 'white'
  },
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  logoWrapper: {
    background: 'white',
    padding: '16px',
    marginTop: '-100px',
    borderRadius: 68
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 0),
    fontSize: 16
  },
  version: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    color: colors.blueGrey[700]
  }
}));

const Login = ({ setCurrentUser }) => {
  const classes = useStyles();
  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState();

  const submitAction = useCallback(e => {
    e.preventDefault();
    // API.post(URL.login, { mobile, password })
    apiCall(URL.login, {
      method: 'POST',
      body: mobile, password })
      .then(({ status, data }) => {
        logger(status, data);
        setCurrentUser(data);
      })
      .catch(e => {
        logger(e);
      });
  }, [mobile, password, setCurrentUser])

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <div className={classes.wrapper}>
        <div className={classes.logoWrapper}>
          <img
            alt="Logo"
            src="/images/logo.png"
            height="108px"
          />
        </div>
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={submitAction}>
            <TextField
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="Mobile"
              name="mobile"
              autoComplete="mobile"
              autoFocus
            />
            <TextField
              value={password}
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              {/* <Grid item>
                <StyledLink to="/signup" component={Link} variant="body2">
                  {"Don't have an account? Sign Up"}
                </StyledLink>
              </Grid> */}
            </Grid>
          </form>
        </div>
      </div>
      <div className={classes.version}>version: 0.1 beta</div>
    </Container>
  );
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);