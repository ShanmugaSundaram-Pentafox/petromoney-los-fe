import { DashboardActionTypes } from "./dashboard.types";

export const setSites = sites => ({
  type: DashboardActionTypes.SET_SITES,
  payload: sites
});

export const setLayouts = layouts => ({
  type: DashboardActionTypes.SET_SITE_LAYOUTS,
  payload: layouts
});

export const deleteSite = uuid => ({
  type: DashboardActionTypes.DELETE_SITE,
  payload: uuid
});

export const deleteLayout = id => ({
  type: DashboardActionTypes.DELETE_SITE,
  payload: id
});