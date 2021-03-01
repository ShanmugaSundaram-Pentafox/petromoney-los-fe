import { createSelector } from 'reselect';

const selectDashboard = state => state.dashboard;

export const selectSites = createSelector(
  [selectDashboard],
  dashboard => dashboard.sites
);

export const selectLayouts = createSelector(
  [selectDashboard],
  dashboard => dashboard.layouts
);

export const selectAllUsers = createSelector(
  [selectDashboard],
  dashboard => dashboard.allUsers
);