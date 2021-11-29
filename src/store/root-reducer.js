import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { commonReducer } from './common/common.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer';
import { dealershipReducer } from './dealership/dealership.reducer';
import { loanReducer } from './loans/loans.reducer';
import { transportsReducer } from './transports/transports.reducer';
import { userReducer } from './user/user.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'common']
}

const rootReducer = combineReducers({
  user: userReducer,
  common: commonReducer,
  loans: loanReducer,
  dashboard: dashboardReducer,
  dealerships: dealershipReducer,
  transports: transportsReducer
});

export default persistReducer(persistConfig, rootReducer);