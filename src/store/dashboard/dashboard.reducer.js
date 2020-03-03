import { DashboardActionTypes } from "./dashboard.types"

const INITIAL_STATE = {
  sites: null,
  layouts: null
}

export const dashboardReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case DashboardActionTypes.SET_SITES:
      return {
        ...state,
        sites: action.payload
      }
    case DashboardActionTypes.SET_SITE_LAYOUTS:
      return {
        ...state,
        layouts: action.payload
      }
    case DashboardActionTypes.DELETE_SITE:
      return {
        ...state,
        sites: state.sites.filter(item => item.uuid !== action.payload)
      }
    case DashboardActionTypes.DELETE_LAYOUT:
      return {
        ...state,
        layouts: state.layouts.filter(item => item.id !== action.payload)
      }
    default:
      return state;
  }
}