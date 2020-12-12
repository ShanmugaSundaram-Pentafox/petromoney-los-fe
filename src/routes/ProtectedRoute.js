import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../store/user/user.selector';
import MainLayout from '../layout/main.layout';

const ProtectedRoute = ({ component: Component, currentUser, allow, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if(currentUser) {
          return allow ? (
            <MainLayout currentUser={currentUser}>
              <Component {...props} currentUser={currentUser} />
            </MainLayout>
          ) : <Redirect to="/" />
        }
        // store url for redirection after login
        window.sessionStorage.setItem('pm-login-url', props.location.pathname);
        
        return <Redirect to="/login" />
      }}
    />
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(ProtectedRoute);