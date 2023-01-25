import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { permissionCheck } from '../components/UserCan/UserCan';
import { rulesList } from '../config/userRules';
import MainLayout from '../layout/main.layout';
import { selectCurrentUser } from '../store/user/user.selector';

const ProtectedRoute = ({ component: Component, currentUser, allow, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (currentUser) {
          if (allow) {
            return (
              <MainLayout currentUser={currentUser}>
                <Component {...props} currentUser={currentUser} />
              </MainLayout>
            )
          } else {
            if (permissionCheck(currentUser.role_name, rulesList.transporter_view)) {
              return <Redirect to={`/transports/${currentUser.id}`} />
            }
            if (permissionCheck(currentUser.role_name, rulesList.dealer_view)) {
              // return <Redirect to={`/dealership/${currentUser.dealership_id}`} />
              return <Redirect to={'/reports'} />
            }
            return <Redirect to="/access/revoke" />
          }
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