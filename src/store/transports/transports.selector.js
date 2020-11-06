import { createSelector } from 'reselect';

const selectTransportsData = state => {
  console.log(state.transports);
  return state.transports;

} 


export const selectAllTransports = createSelector(
  [selectTransportsData],
  transports => transports.all
)