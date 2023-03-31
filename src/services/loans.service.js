import { getDealershipLoansById } from './dealerships.service';
import { URL } from '../config/serverUrls'
import apiCall from '../utils/api.util';

export const getLoanStats = (qryStr = {}) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = qryStr;
    let qry = []
    let apiUrl = 'metrics/loan/stats';
    if (zone && zone !=='0') qry.push(`zone=${zone}`)
    if (region && region !=='0') qry.push(`region=${region}`)
    if (products && products !=='0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if(qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data[0] || []);
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
        if (status === 'SUCCESS') {
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

export const getLoanBookData = (view) => {
  return new Promise((resolve, reject) => {
    let apiUrl = URL.loanBook
    if(view === 'External') apiUrl += '?external=1'
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getRenewalLoans = () => {
  return new Promise((resolve, reject) => {
    apiCall('loans/renewal')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getLoansByStatus = (status, filterQry) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = filterQry;
    let qry = []
    let apiUrl = `${URL.loans}?status=${status}`;
    if (zone && zone !=='0') qry.push(`zone=${zone}`)
    if (region && region !=='0') qry.push(`region=${region}`)
    if (products && products !=='0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if(qry.length) apiUrl += '&'+ qry.join('&')
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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

export const updateLoanApprovalStatusById = (dealershipId, loanId, status, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/loan/${loanId}/${status}`, {
      method: 'POST',
      body,
    })
      .then(async ({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
      method: 'DELETE',
      body,
    })
      .then(async ({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getAllExceptions = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.exceptions)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
      method: 'POST',
    })
      .then(async ({ status, message }) => {
        if (status === 'SUCCESS') {
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
    apiCall('application/state')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getLoanRejectReason = () => {
  return new Promise((resolve, reject) => {
    apiCall('loans/reason')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getPotentialOpportunity = (view, body) => {
  let qry = []
  let apiUrl = 'potential/opportunities';
  qry.push(`conversion_ratio=${body?.conversion_ratio || 30}&ticket_size=${body?.ticket_size || 15}`)
  if(view) qry.push(`view=${view}`)
  if(qry.length) apiUrl += '?' + qry.join('&')
  // apiUrl += `?conversion_ratio=${body?.conversion_ratio || 30}&ticket_size=${body?.ticket_size || 15}`
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getCreditStats = (qryStr = {}) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, account, zone } = qryStr;
    let qry = []
    let apiUrl = 'credit/reload/stats';
    if (zone && zone !=='0') qry.push(`zone=${zone}`)
    if (region && region !=='0') qry.push(`region=${region}`)
    if (account && account !=='0') qry.push(`account_type=${account}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if(qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data[0] || []);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getDpdReportData = () => {
  return new Promise((resolve, reject) => {
    apiCall('app/dpd/report')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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