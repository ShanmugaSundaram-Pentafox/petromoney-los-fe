import { createSelector } from 'reselect';

const selectLoans = state => state.loans;

export const selectAllLoans = createSelector(
  [selectLoans],
  loans => loans.all_loans
)