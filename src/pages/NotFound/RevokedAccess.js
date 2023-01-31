import { Button, Container, makeStyles } from '@material-ui/core'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { action_id, resources_id } from '../../config/accessControl';
import { resetCurrentUser } from '../../store/user/user.actions';
import CheckAllowed from '../rbac/CheckAllowed';

const useStyles = makeStyles(() => ({
  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: 20,
    color: 'rgb(0,0,0,0.1)',
  },
  title: {
    fontWeight: 800,
    fontSize: 40,
    lineHeight: 1,
    marginBottom: 20,
    fontFamily: 'Open Sans',
    color: 'rgb(0,0,0,0.8)'
  },
  text: {
    fontWeight: 400,
    fontSize: 20,
    lineHeight: 1,
    marginBottom: 20,
    fontFamily: 'Open Sans',
    color: 'rgb(0,0,0,0.5)'
  },
  button: {
    fontSize: 20,
    paddingRight: 40,
    paddingLeft: 40,
    borderRadius: 10
  }
}))

const RevokedAccess = ({currentUser}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // Logout and set default return url to dashboard
  const handleLogout = () => {
    window.sessionStorage.setItem('pm-login-url', '/')
    dispatch(resetCurrentUser())
    history.push('/login')
  }

  return (
    <Container maxWidth='lg' style={{justifyContent: 'center', alignItems: 'center', display: 'flex', height: window.innerHeight, flexDirection: 'column'}}>
      <div className={classes.label}>!</div>
      <div>
        <h2 className={classes.title}>Your Access has been revoked.</h2>
      </div>
      <div>
        <h4 className={classes.text}>Unfortunately your access has been revoked, please contact your admin and check back later.</h4>
      </div>
      <div style={{ display: 'flex' }}>
        <CheckAllowed currentUser={currentUser} resource={resources_id.navigation} action={action_id.navigation.dashboard}>
          <Button
            variant='text'
            color='secondary'
            className={classes.button}
            onClick={() => history.push('/')}
            size='large'
          >
            Back to Dashboard
          </Button>
        </CheckAllowed>
        <Button
          variant='text'
          color='primary'
          className={classes.button}
          onClick={handleLogout}
          size='large'
        >
          Logout
        </Button>
      </div>
    </Container>
  )
}

export default RevokedAccess