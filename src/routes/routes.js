import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import ProtectedRoute from './ProtectedRoute';
import EnvTag from '../components/CommonComponents/EnvTag/EnvTag';
import { permissionCheck } from '../components/UserCan/UserCan';
import { rulesList } from '../config/userRules';
import CallRequestPage from '../pages/callRequest/CallRequestPage';
import CreditForm from '../pages/creditForm/creditForm';
import DealersAccountStatement from '../pages/dashboard/components/DealersAccountStatement';
import OwnerDetails from '../pages/dashboard/components/OwnerDetails';
import Dashboard from '../pages/dashboard/dashboard';
import Dealership from '../pages/dealership/dealership';
import DealershipDetails from '../pages/dealershipDetails/dealershipDetails';
import BlacklistTable from '../pages/loanspage/BlacklistTable';
import LmsLos from '../pages/loanspage/lmsLosTable';
import Loans from '../pages/loanspage/loans'
import Login from '../pages/login/login';
import NotFound from '../pages/NotFound/NotFound';
import Profile from '../pages/profile/Profile';
import CollectionRemarks from '../pages/reports/CollectionRemarks';
import CreditReload from '../pages/reports/CreditReload';
import DealersDueReport from '../pages/reports/DealersDueReport';
import Due from '../pages/reports/DueReport';
import OverDue from '../pages/reports/OverDueReport';
import Settings from '../pages/settings/settings';
import Solar from '../pages/solar/solar';
import Survey from '../pages/survey/survey';
import TransportException from '../pages/transports/components/TransportException';
import FastTagPassbook from '../pages/transports/components/TransportsPassbook';
import VehiclesLoanTable from '../pages/transports/components/VehiclesLoanTable';
import Transport from '../pages/transports/transports';
import TransportsPortal from '../pages/transports/TransportsPortal';
import TransportsDetails from '../pages/transportsDetails/transportsDetails'
import PassbookDetails from '../pages/users/dealer/PassbookDetails';
import Users from '../pages/users/users';
import { selectCurrentUser } from '../store/user/user.selector';

const Routes = ({ currentUser }) => {
  return (<>
    <EnvTag />
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Dashboard}
        allow={permissionCheck(currentUser?.role_name, rulesList.dashboard)}
      />
      <ProtectedRoute allow exact path="/solar" component={Solar} />
      <ProtectedRoute allow exact path="/solar/feasibility" component={Solar} />
      <ProtectedRoute allow exact path="/dealership" component={Dealership} />
      <ProtectedRoute allow exact path="/loans" component={Loans} />
      <ProtectedRoute allow exact path="/loans/exceptions" component={LmsLos} />
      <ProtectedRoute allow exact path="/dealership/:id?" component={DealershipDetails} />
      <ProtectedRoute allow exact path='/transports' component={Transport} />
      <ProtectedRoute allow exact path='/transports-field' component={TransportsPortal} />
      <ProtectedRoute allow exact path="/transports/:id?" component={TransportsDetails} />
      <ProtectedRoute allow exact path='/transport/exceptions' component={TransportException} />
      <ProtectedRoute allow exact path="/dealership/:id/credit-form" component={CreditForm} />
      <ProtectedRoute allow exact path="/settings" component={Settings} />
      <ProtectedRoute allow exact path="/reports/due" component={Due} />
      <ProtectedRoute allow exact path="/transport/fastag/details" component={FastTagPassbook} />
      <ProtectedRoute allow exact path="/reports/overdue" component={OverDue} />
      <ProtectedRoute allow exact path="/reports/credit/reload" component={CreditReload} />
      <ProtectedRoute allow exact path="/vehicle-loan" component={VehiclesLoanTable} />
      <ProtectedRoute allow exact path="/owners/:id?" component={OwnerDetails} />
      <ProtectedRoute allow exact path="/profile" component={Profile} />
      <ProtectedRoute allow exact path="/withheld" component={BlacklistTable} />
      <ProtectedRoute allow exact path="/reports" component={DealersDueReport} />
      <ProtectedRoute allow exact path="/reports/remarks" component={CollectionRemarks} />

      <ProtectedRoute
        exact
        path="/customer/callback"
        component={CallRequestPage}
        allow={permissionCheck(currentUser?.role_name, rulesList.users_view)}
      />
      <ProtectedRoute
        exact
        path="/users"
        component={Users}
        allow={permissionCheck(currentUser?.role_name, rulesList.users_view)}
      />
      <ProtectedRoute
        exact
        path="/passbook"
        component={PassbookDetails}
        allow={permissionCheck(currentUser?.role_name, rulesList.dealer_view)}
      />
      <ProtectedRoute
        exact
        path="/statements"
        component={DealersAccountStatement}
        allow={permissionCheck(currentUser?.role_name, rulesList.dealer_view)}
      />
      <Route exact path="/survey" render={props => <Survey {...props} />} />

      <Route exact path="/login" render={props => {
        const authUrl = window.sessionStorage.getItem('pm-login-url');
        if (currentUser) {
          window.sessionStorage.setItem('pm-login-url', undefined);
          return <Redirect to={authUrl || '/'} />
        }

        return <Login {...props} />
      }} />

      <Route component={NotFound} />
    </Switch>
  </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Routes);