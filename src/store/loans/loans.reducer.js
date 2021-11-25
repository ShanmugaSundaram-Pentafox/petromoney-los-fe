import { LoanActionTypes } from './loans.types';

const INITIAL_STATE = {
  all_loans: [],
  loanBook: []
}

export const loanReducer = (state = INITIAL_STATE, action) => {
  // console.log('loanReducer >> ', action)
  switch(action.type) {
  case LoanActionTypes.SET_ALL_LOANS:
    return {
      ...state,
      all_loans: action.payload
    }
  case LoanActionTypes.SET_LOANS_STAUTS_DATA:
    return {
      ...state,
      [action.payload.status]: action.payload.data
    }
  case LoanActionTypes.SET_LOAN_BOOK_DATA:
    return {
      ...state,
      loanBook: action.payload.data
    }
  default:
    return state;
  }
}