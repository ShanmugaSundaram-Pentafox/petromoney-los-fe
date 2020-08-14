import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../store/user/user.selector';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/login/login';
import Dashboard from '../pages/dashboard/dashboard';
import Dealership from '../pages/dealership/dealership';
import Settings from '../pages/settings/settings';
import DealershipDetails from '../pages/dealershipDetails/dealershipDetails';
import CreditForm from '../pages/creditForm/creditForm';

const creditRoutes = ["Admin"];

const Routes = ({ currentUser }) => {
  return (
    <Switch>
      <ProtectedRoute exact path="/" component={Dashboard} />
      <ProtectedRoute exact path="/dealership" component={Dealership} />
      <ProtectedRoute exact path="/dealership/:id?" component={DealershipDetails} />
      {
        currentUser && creditRoutes.includes(currentUser.role_name) ? (
          <>
            <ProtectedRoute exact path="/dealership/:id/credit-form" component={CreditForm} />
          </>
        ) : null
      }
      <ProtectedRoute exact path="/settings" component={Settings} />
      <Route exact path="/login" render={props => currentUser ? <Redirect to="/" /> : <Login {...props} />} />
    </Switch>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Routes);