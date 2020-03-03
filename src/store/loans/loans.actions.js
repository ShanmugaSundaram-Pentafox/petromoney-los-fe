import { LoanActionTypes } from "./loans.types";

export const setAllLoans = loans => ({
  type: LoanActionTypes.SET_ALL_LOANS,
  payload: loans
});
