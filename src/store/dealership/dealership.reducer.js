import { DealershipActionTypes } from "./dealership.types";

const INITIAL_STATE = {
  all: []
}

export const dealershipReducer = (state = INITIAL_STATE, action) => {
  console.log('Reducer >> ', action)
  switch(action.type) {
    case DealershipActionTypes.SET_DEALERSHIP_DATA:
      return {  
        ...state,
        all: action.payload
      }
    default:
      return state;
  }
}