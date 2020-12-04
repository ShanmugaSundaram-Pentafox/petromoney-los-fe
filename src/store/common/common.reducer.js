import { CommonActionTypes } from "./common.types"

const INITIAL_STATE = {
  pageTitle: undefined,
  backLink: false,
  search: undefined
}

export const commonReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CommonActionTypes.SET_PAGE_TITLE:
      return {
        ...state,
        ...(action.payload || {})
      }
    case CommonActionTypes.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload
      }
    default:
      return state;
  }
}