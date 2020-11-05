import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import { getDealershipLoansById } from "./dealerships.service";
import { store } from "../store";

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

export const getAll_ls1_Metrices = () => {
  return new Promise((resolve, reject) => {
    const currentUser = store.getState().user.currentUser;
    API.get(URL.ls1_metrices, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${currentUser.token}`
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

export const getAll_ls2_Metrices = () => {
  return new Promise((resolve, reject) => {
    const currentUser = store.getState().user.currentUser;
    API.get(URL.ls2_metrices, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${currentUser.token}`
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

export const getLoanBookData = () => {
  return new Promise((resolve, reject) => {
    const currentUser = store.getState().user.currentUser;
    API.get(URL.loanBook, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${currentUser.token}`
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

export const getLoanById = (dealershipId, loanId) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${dealershipId}/loans/${loanId}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data[0] || {});
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
          resolve({ data: res, message: data.message });
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}