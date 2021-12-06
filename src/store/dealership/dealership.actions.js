import { DealershipActionTypes } from './dealership.types';

export const setAllDealerships = dealerships => {
  // console.log('setAllDealerships >> ', {
  //   type: DealershipActionTypes.SET_DEALERSHIP_DATA,
  //   payload: dealerships
  // })
  return ({
    type: DealershipActionTypes.SET_DEALERSHIP_DATA,
    payload: dealerships
  });
}
