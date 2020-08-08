import { createSelector } from 'reselect';

const getPageState = state => state.common;

export const selectPageData = createSelector(
  [getPageState],
  common => common.page
)