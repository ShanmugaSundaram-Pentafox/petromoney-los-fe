import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../store/user/user.selector';
import ProtectedRoute from './ProtectedRoute';
import TransportsDetails from '../pages/transportsDetails/transportsDetails'
import Survey from '../pages/survey/survey';
import Login from '../pages/login/login';
import Dashboard from '../pages/dashboard/dashboard';
import Dealership from '../pages/dealership/dealership';
import Settings from '../pages/settings/settings';
import DealershipDetails from '../pages/dealershipDetails/dealershipDetails';
import Loans from '../pages/loanspage/loans'
import CreditForm from '../pages/creditForm/creditForm';
import Transport from '../pages/transports/transports';
import Solar from '../pages/solar/solar';
import Users from '../pages/users/users';
import { permissionCheck } from '../components/UserCan/UserCan';
import { rulesList } from '../config/userRules';
import Due from '../pages/reports/DueReport';
import OverDue from '../pages/reports/OverDueReport';
import LmsLos from '../pages/loanspage/lmsLosTable';
import PassbookDetails from '../pages/users/dealer/PassbookDetails';
import EnvTag from '../components/CommonComponents/EnvTag/EnvTag';
import VehiclesLoanTable from '../pages/transports/components/VehiclesLoanTable';
import OwnerDetails from '../pages/dashboard/components/OwnerDetails';
import Profile from '../pages/profile/Profile';
import TransportException from '../pages/transports/components/TransportException';
import BlacklistTable from '../pages/loanspage/BlacklistTable';

const Routes = ({ currentUser }) => {
  return (<>
    <EnvTag />
    <Switch>
      <ProtectedRoute allow exact path="/" component={Dashboard} />
      <ProtectedRoute allow exact path="/solar" component={Solar} />
      <ProtectedRoute allow exact path="/solar/feasibility" component={Solar} />
      <ProtectedRoute allow exact path="/dealership" component={Dealership} />
      <ProtectedRoute allow exact path="/loans" component={Loans} />
      <ProtectedRoute allow exact path="/loans/exceptions" component={LmsLos} />
      <ProtectedRoute allow exact path="/dealership/:id?" component={DealershipDetails} />
      <ProtectedRoute allow exact path='/transports' component={Transport} />
      <ProtectedRoute allow exact path="/transports/:id?" component={TransportsDetails} />
      <ProtectedRoute allow exact path='/transport/exceptions' component={TransportException} />
      <ProtectedRoute allow exact path="/dealership/:id/credit-form" component={CreditForm} />
      <ProtectedRoute allow exact path="/settings" component={Settings} />
      <ProtectedRoute allow exact path="/reports/due" component={Due} />
      <ProtectedRoute allow exact path="/reports/overdue" component={OverDue} />
      <ProtectedRoute allow exact path="/vehicle-loan" component={VehiclesLoanTable} />
      <ProtectedRoute allow exact path="/owners/:id?" component={OwnerDetails} />
      <ProtectedRoute allow exact path="/profile" component={Profile} />
      <ProtectedRoute allow exact path="/withheld" component={BlacklistTable} />


      <ProtectedRoute
        exact
        path="/users"
        component={Users}
        allow={permissionCheck(currentUser?.role_name, rulesList.users_view)}
      />
      <ProtectedRoute
        allow
        exact
        path="/passbook"
        component={PassbookDetails}
        allow={permissionCheck(currentUser?.role_name, rulesList.dealer_view)}
      />
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
  </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Routes);