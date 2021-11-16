import { UserActionTypes } from "./user.types"

const INITIAL_STATE = {
  currentUser: null
}

export const userReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    case UserActionTypes.REMOVE_CURRENT_USER:
      if(!action.payload?.timeout) {
        window.sessionStorage.setItem('pm-login-url', undefined);
      }
      return {
        currentUser: null
      }
    default:
      return state;
  }
}