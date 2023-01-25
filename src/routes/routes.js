import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import ProtectedRoute from './ProtectedRoute';
import EnvTag from '../components/CommonComponents/EnvTag/EnvTag';
import DpdReport from '../components/Tables/DpdReport';
import OpportunityReport from '../components/Tables/OpportunityReport';
import ProjectionReport from '../components/Tables/ProjectionReport';
import { permissionCheck } from '../components/UserCan/UserCan';
import { action_id, resources_id } from '../config/accessControl';
import { rulesList } from '../config/userRules';
import CallRequestPage from '../pages/callRequest/CallRequestPage';
import DealersAccountStatement from '../pages/dashboard/components/DealersAccountStatement';
import OwnerDetails from '../pages/dashboard/components/OwnerDetails';
import Dashboard from '../pages/dashboard/dashboard';
import Dealership from '../pages/dealership/dealership';
import DealershipDetails from '../pages/dealershipDetails/dealershipDetails';
import PresubmitLoansTable from '../pages/loans/PresubmitLoansTable';
import BlacklistTable from '../pages/loanspage/BlacklistTable';
import LmsLos from '../pages/loanspage/lmsLosTable';
import Loans from '../pages/loanspage/loans'
import RenewalTable from '../pages/loanspage/RenewalTable';
import Login from '../pages/login/login';
import NOCertificateRequestTable from '../pages/noc/NOCertificateRequestTable';
import NotFound from '../pages/NotFound/NotFound';
import RevokedAccess from '../pages/NotFound/RevokedAccess';
import Profile from '../pages/profile/Profile';
import UserControl from '../pages/rbac/UserControl';
import ReferralTable from '../pages/referralModule/ReferralTable';
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
import { isAllowed } from '../utils/cerbos';

const Routes = ({ currentUser }) => {
  return (<>
    <EnvTag />
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Dashboard}
        allow={isAllowed(currentUser?.permissions,resources_id.navigation,action_id.navigation.dashboard)}
      />
      <ProtectedRoute allow exact path="/solar" component={Solar} />
      <ProtectedRoute allow exact path="/solar/feasibility" component={Solar} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.dealerships)} exact path="/dealership" component={Dealership} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.loans)} exact path="/loans" component={Loans} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.exceptionLoans)} exact path="/loans/exceptions" component={LmsLos} />
      <ProtectedRoute allow exact path="/dealership/:id?" component={DealershipDetails} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.transports)} exact path='/transports' component={Transport} />
      <ProtectedRoute allow exact path='/transports-field' component={TransportsPortal} />
      <ProtectedRoute allow exact path="/transports/:id?" component={TransportsDetails} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.exceptionTransports)} exact path='/transport/exceptions' component={TransportException} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.settings)} exact path="/settings" component={Settings} />
      <ProtectedRoute allow exact path="/reports/due" component={Due} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.transportsPassbook)} exact path="/transport/fastag/details" component={FastTagPassbook} />
      <ProtectedRoute allow exact path="/reports/overdue" component={OverDue} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.credit_reload)} exact path="/reports/credit/reload" component={CreditReload} />
      <ProtectedRoute allow exact path="/vehicle-loan" component={VehiclesLoanTable} />
      <ProtectedRoute allow exact path="/owners/:id?" component={OwnerDetails} />
      <ProtectedRoute allow exact path="/profile" component={Profile} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.withheld)} exact path="/withheld" component={BlacklistTable} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.renewal)} exact path="/renewal" component={RenewalTable} />
      <ProtectedRoute allow exact path="/reports" component={DealersDueReport} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.collection_remarks)} exact path="/reports/remarks" component={CollectionRemarks} />
      <ProtectedRoute allow exact path="/reports/dpd" component={DpdReport} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.noc)} exact path="/noc" component={NOCertificateRequestTable} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.pre_submit)} exact path="/pre-submit" component={PresubmitLoansTable} />
      <ProtectedRoute allow exact path="/rbac" component={UserControl} />
      <ProtectedRoute allow exact path="/referral" component={ReferralTable} />

      <ProtectedRoute
        exact 
        path="/reports/projection" 
        component={ProjectionReport} 
        allow={permissionCheck(currentUser?.role_name, rulesList.projection_report)} 
      />
      <ProtectedRoute 
        exact 
        path="/reports/opportunities" 
        component={OpportunityReport} 
        allow={permissionCheck(currentUser?.role_name, rulesList.opportunity_report)} 
      />
      <ProtectedRoute
        exact
        path="/customer/callback"
        component={CallRequestPage}
        allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.call_request)}
        // allow={permissionCheck(currentUser?.role_name, rulesList.users_view)}
      />
      <ProtectedRoute
        exact
        path="/users"
        component={Users}
        allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.users)}
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
        // allow={permissionCheck(currentUser?.role_name, rulesList.dealer_view)}
        allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.account_statement)}
      />
      <Route exact path="/survey" render={props => <Survey {...props} />} />

      <Route exact path="/login" render={props => {
        const authUrl = window.sessionStorage.getItem('pm-login-url');
        if (currentUser) {
          window.sessionStorage.setItem('pm-login-url', undefined);
          return <Redirect to={authUrl != 'undefined' ? authUrl : '/'} />
        }

        return <Login {...props} />
      }} />

      <Route exact path="/access/revoke">
        <RevokedAccess currentUser={currentUser} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(Routes);