import { LoanActionTypes } from "./loans.types";

const INITIAL_STATE = {
  all_loans: []
}

export const loanReducer = (state = INITIAL_STATE, action) => {
  console.log('loanReducer >> ', action)
  switch(action.type) {
    case LoanActionTypes.SET_ALL_LOANS:
      return {
        ...state,
        all_loans: action.payload
      }
    default:
      return state;
  }
}