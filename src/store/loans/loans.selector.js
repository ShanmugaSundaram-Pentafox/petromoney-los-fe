import { createSelector } from 'reselect';

const selectLoans = state => state.loans;

export const selectAllLoans = createSelector(
  [selectLoans],
  loans => {
    let temp = {};
    loans.all_loans.forEach(item => {
      if(!temp[item.dealership_id]) {
        temp[item.dealership_id] = {...item, type: [item.type]};
      } else {
        temp[item.dealership_id].type.push(item.type); 
        console.log(temp[item.dealership_id]);
      }
    });
    return Object.values(temp)
  }
)