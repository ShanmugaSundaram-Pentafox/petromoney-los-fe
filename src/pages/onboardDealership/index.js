import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../store/user/user.selector';
import OnboardDealershipForm from './OnboardDealershipForm';

const OnboardDealership = ({ currentUser }) => {
  const handleSuccess = () => {
    // Redirect to dealership list or show success message
    setTimeout(() => {
      window.location.href = '/#/dealership';
    }, 2000);
  };

  return (
    <OnboardDealershipForm onSuccess={handleSuccess} />
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(OnboardDealership);
