import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import ProtectedRoute from './ProtectedRoute';
import EnvTag from '../components/CommonComponents/EnvTag/EnvTag';
import OpportunityReport from '../components/Tables/OpportunityReport';
import { permissionCheck } from '../components/UserCan/UserCan';
import { action_id, resources_id } from '../config/accessControl';
import { rulesList } from '../config/userRules';
import CallRequestPage from '../pages/callRequest/CallRequestPage';
import DealersAccountStatement from '../pages/dashboard/components/DealersAccountStatement';
import OwnerDetails from '../pages/dashboard/components/OwnerDetails';
import Dashboard from '../pages/dashboard/dashboard';
import Dealership from '../pages/dealership/dealership';
import DealershipDetails from '../pages/dealershipDetails/dealershipDetails';
import EnhancementList from '../pages/enhancement/EnhancementList';
import PresubmitLoansTable from '../pages/loans/PresubmitLoansTable';
import BlacklistTable from '../pages/loanspage/BlacklistTable';
import Loans from '../pages/loanspage/loans'
import Login from '../pages/login/login';
import NOCertificateRequestTable from '../pages/noc/NOCertificateRequestTable';
import NotFound from '../pages/NotFound/NotFound';
import RevokedAccess from '../pages/NotFound/RevokedAccess';
import Profile from '../pages/profile/Profile';
import UserControl from '../pages/rbac/UserControl';
import DealerReferralPage from '../pages/referralModule/DealerReferralPage';
import RenewalList from '../pages/renewal/RenewalList';
import CollectionRemarks from '../pages/reports/CollectionRemarks';
import CreditNewRequestTable from '../pages/reports/CreditNewRequestTable';
import CreditProcessedTable from '../pages/reports/CreditProcessedTable';
import DealersDueReport from '../pages/reports/DealersDueReport';
import DpdReport from '../pages/reports/DPD/DpdReport';
import Settings from '../pages/settings/settings';
import Survey from '../pages/survey/survey';
import FastTagPassbook from '../pages/transports/components/TransportsPassbook';
import VehiclesLoanTable from '../pages/transports/components/VehiclesLoanTable';
import Transport from '../pages/transports/transports';
import TransportsPortal from '../pages/transports/TransportsPortal';
import TransportsDetails from '../pages/transportsDetails/transportsDetails'
import ProfileTabs from '../pages/users/components/ProfileTabs';
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
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.dealerships)} exact path="/dealership" component={Dealership} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.loans)} exact path="/loans" component={Loans} />
      <ProtectedRoute allow exact path="/dealership/:id?" component={DealershipDetails} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.transports)} exact path='/transports' component={Transport} />
      <ProtectedRoute allow exact path='/transports-field' component={TransportsPortal} />
      <ProtectedRoute allow exact path="/transports/:id?" component={TransportsDetails} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.settings)} exact path="/settings" component={Settings} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.transportsPassbook)} exact path="/transport/fastag/details" component={FastTagPassbook} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.credit_reload)} exact path="/credit/reload/processed/reports" component={CreditProcessedTable} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.credit_reload)} exact path="/credit/reload/new/reports" component={CreditNewRequestTable} />
      <ProtectedRoute allow exact path="/vehicle-loan" component={VehiclesLoanTable} />
      <ProtectedRoute allow exact path="/owners/:id?" component={OwnerDetails} />
      <ProtectedRoute allow exact path="/profile" component={Profile} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.withheld)} exact path="/withheld" component={BlacklistTable} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.renewal)} exact path="/renewal" component={RenewalList} />
      <ProtectedRoute allow exact path="/enhancement" component={EnhancementList} />
      <ProtectedRoute allow exact path="/reports" component={DealersDueReport} />
      <ProtectedRoute allow exact path="/report/dpd" component={DpdReport} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions, resources_id.navigation, action_id.navigation.collection_remarks)} exact path="/reports/remarks" component={CollectionRemarks} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.noc)} exact path="/noc" component={NOCertificateRequestTable} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.pre_submit)} exact path="/pre-submit" component={PresubmitLoansTable} />
      <ProtectedRoute allow exact path="/rbac" component={UserControl} />
      <ProtectedRoute allow={isAllowed(currentUser?.permissions,resources_id.navigation, action_id.navigation.dealer_referral)}  exact path="/referral" component={DealerReferralPage} />
      <ProtectedRoute allow exact path="/user/:id?" component={ProfileTabs} />

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