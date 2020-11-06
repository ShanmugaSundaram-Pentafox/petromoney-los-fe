import { createSelector } from 'reselect';

const selectTransportsData = state => state.transports;

export const selectAllTransports = createSelector(
  [selectTransportsData],
  transports => transports.all
)