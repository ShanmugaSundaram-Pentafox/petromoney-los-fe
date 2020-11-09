import { TransportsActionTypes } from "./transports.types";

export const setAllTransports = transports => {
  console.log('setAllTransports >> ', {
    type: TransportsActionTypes.SET_TRANSPORTS_DATA,
    payload: transports
  })
  return ({
  type: TransportsActionTypes.SET_TRANSPORTS_DATA,
  payload: transports
});}
