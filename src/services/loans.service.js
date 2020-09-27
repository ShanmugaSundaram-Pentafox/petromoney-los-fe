import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import { getDealershipLoansById } from "./dealerships.service";

export const getAllLoans = () => {
  return new Promise((resolve, reject) => {
    API.get(URL.loans)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getLoansByStatus = status => {
  return new Promise((resolve, reject) => {
    API.get(URL.loans, {
      params: {
        status
      }
    })
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const updateLoanApprovalStatusById = (dealershipId, loanId, body) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.dealership}/${dealershipId}/loan/${loanId}/approval`, body)
      .then(async ({ data }) => {
        if(data.status === "SUCCESS") {
          const res = await getDealershipLoansById(dealershipId);
          resolve(res);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}