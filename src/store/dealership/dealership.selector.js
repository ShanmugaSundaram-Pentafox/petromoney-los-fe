import { createSelector } from 'reselect';

const selectDealershipData = state => state.dealerships;

export const selectAllDealerships = createSelector(
  [selectDealershipData],
  dealerships => dealerships.all
)