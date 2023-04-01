import { CommonActionTypes } from './common.types';

export const setPageTitle = (pageTitle, goBackIcon) => ({
  type: CommonActionTypes.SET_PAGE_TITLE,
  payload: {
    pageTitle,
    goBackIcon,
  }
});

export const setSearchText = searchText => ({
  type: CommonActionTypes.SET_SEARCH_TEXT,
  payload: searchText
});