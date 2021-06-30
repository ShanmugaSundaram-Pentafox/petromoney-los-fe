import { URL } from "../config/serverUrls"
import { getDealershipLoansById } from "./dealerships.service";
import apiCall from "../utils/api.util";

export const getLoanStats = () => {
  return new Promise((resolve, reject) => {
    apiCall(`metrics/loan/stats`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data[0]);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getAllLoans = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.loans)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
    // return;
    apiCall(URL.ls1_metrices)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
    // return;
    apiCall(URL.ls2_metrices)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
    // reject("");
    // return;
    apiCall(URL.loanBook)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
        if (status === "SUCCESS") {
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
        if (status === "SUCCESS") {
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

export const getLoanDocumentHistoryById = (loanId, type) => {
  return new Promise((resolve, reject) => {
    apiCall(`document/history/${loanId}?document_type=${type}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
        if (status === "SUCCESS") {
          const res = await getDealershipLoansById(dealershipId);
          const updatedLoanData = await getLoanById(dealershipId, loanId);
          resolve({ loans: res, data: updatedLoanData, message });
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const deleteLoanDisbursementRecord = (dealershipId, loanId, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/loan/${loanId}/approval`, {
      method: "DELETE",
      body,
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
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

export const getAllExceptions = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.exceptions)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
export const getTransportsExceptions = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.transport_exceptions)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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

export const updateLoanStats = (dealershipId, loanId) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/loan/${loanId}/resubmit`, {
      method: "POST",
    })
      .then(async ({ status, message }) => {
        if (status === "SUCCESS") {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
export const getApplicationStatusById = () => {
  return new Promise((resolve, reject) => {
    apiCall(`application/state`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

