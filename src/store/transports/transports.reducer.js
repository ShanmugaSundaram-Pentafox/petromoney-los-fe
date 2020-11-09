import { TransportsActionTypes } from "./transports.types";

const INITIAL_STATE = {
  all: []
}

export const transportsReducer = (state = INITIAL_STATE, action) => {
  console.log('Reducer >> ', action)
  switch(action.type) {
    case TransportsActionTypes.SET_TRANSPORTS_DATA:
      return {  
        ...state,
        all: action.payload
      }
    default:
      return state;
  }
}