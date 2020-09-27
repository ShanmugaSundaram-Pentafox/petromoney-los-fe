import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../store/user/user.selector';
import ProtectedRoute from './ProtectedRoute';

import Survey from '../pages/survey/survey';
import Login from '../pages/login/login';
import Dashboard from '../pages/dashboard/dashboard';
import Dealership from '../pages/dealership/dealership';
import Settings from '../pages/settings/settings';
import DealershipDetails from '../pages/dealershipDetails/dealershipDetails';
import CreditForm from '../pages/creditForm/creditForm';

const Routes = ({ currentUser }) => {
  return (
    <Switch>
      <ProtectedRoute exact path="/" component={Dashboard} />
      <ProtectedRoute exact path="/dealership" component={Dealership} />
      <ProtectedRoute exact path="/dealership/:id?" component={DealershipDetails} />
      <ProtectedRoute exact path="/dealership/:id/credit-form" component={CreditForm} />
      <ProtectedRoute exact path="/settings" component={Settings} />
      <Route exact path="/survey" render={props => <Survey {...props} />} />
      
      <Route exact path="/login" render={props => {
        const authUrl = window.sessionStorage.getItem('pm-login-url');
        if (currentUser) {
          window.sessionStorage.setItem('pm-login-url', undefined);
          return <Redirect to={authUrl || "/"} />
        }

        return <Login {...props} />
      }} />
    </Switch>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Routes);