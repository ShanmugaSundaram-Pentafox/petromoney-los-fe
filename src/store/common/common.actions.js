import { CommonActionTypes } from "./common.types";

export const setPageTitle = title => ({
  type: CommonActionTypes.SET_PAGE_TITLE,
  payload: title
});

export const setSearchText = searchText => ({
  type: CommonActionTypes.SET_SEARCH_TEXT,
  payload: searchText
});