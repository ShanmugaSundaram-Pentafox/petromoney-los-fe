import { LoanActionTypes } from './loans.types';

export const setAllLoans = loans => ({
  type: LoanActionTypes.SET_ALL_LOANS,
  payload: loans
});

export const setLoansByStatus = (status, data) => ({
  type: LoanActionTypes.SET_LOANS_STAUTS_DATA,
  payload: { status, data }
});

export const setLoanBook = (data => ({
  type: LoanActionTypes.SET_LOAN_BOOK_DATA,
  payload: { data }
}))