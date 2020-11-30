import { URL } from "../config/serverUrls"
import { getDealershipLoansById } from "./dealerships.service";
import apiCall from "../utils/api.util";

export const getAllLoans = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.loans)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getAll_ls1_Metrices = () => {
  return new Promise((resolve, reject) => {
    // resolve({});
    apiCall(URL.ls1_metrices)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getAll_ls2_Metrices = () => {
  return new Promise((resolve, reject) => {
    // resolve([]);
    apiCall(URL.ls2_metrices)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getLoanBookData = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.loanBook)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getLoansByStatus = status => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.loans}?status=${status}`)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getLoanById = (dealershipId, loanId) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/loans/${loanId}`)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data[0] || {});
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getDisbursementLoanData = (dealershipId, loanId) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/loans/${loanId}`)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data[0] || {});
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const updateLoanApprovalStatusById = (dealershipId, loanId, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/loan/${loanId}/approval`, {
      method: "POST",
      body,
    })
      .then(async ({ status, data, message }) => {
        if(status === "SUCCESS") {
          const res = await getDealershipLoansById(dealershipId);
          resolve({ data: res, message });
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}