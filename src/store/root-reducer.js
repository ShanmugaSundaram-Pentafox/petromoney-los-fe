import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userReducer } from './user/user.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer';
import { loanReducer } from './loans/loans.reducer';
import { dealershipReducer } from './dealership/dealership.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

const rootReducer = combineReducers({
  user: userReducer,
  loans: loanReducer,
  dashboard: dashboardReducer,
  dealerships: dealershipReducer
});

export default persistReducer(persistConfig, rootReducer);