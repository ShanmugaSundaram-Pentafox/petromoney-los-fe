import apiCall from '../utils/api.util';

export const getRenewalLoanByStatus = (status, filterQry, page, searchText) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = filterQry;
    let qry = []
    let apiUrl = `renewal/application?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (page) qry.push(`page=${page}`)
    if (searchText) qry.push(`dealership_id_name=${searchText}`)
    if (qry.length) apiUrl += '&' + qry.join('&')
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

export const getRenewalLoanStats = (qryStr = {}) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = qryStr;
    let qry = []
    let apiUrl = 'metrics/loan/stats';
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
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

export const getStatusWiseRecordCount = () => {
  return new Promise((resolve, reject) => {
    apiCall('renewal/status_wise_record_count')
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
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
export const getRenewalStatusList = () => {
  return new Promise((resolve, reject) => {
    apiCall('renewal/status')
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {

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

export const getPageDetails = (status) => {
  return new Promise((resolve, reject) => {
    apiCall(`renewal/record_count?status=${status}`)
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
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

export const getRenewalRemarks = (loanId) => {
  return new Promise((resolve, reject) => {
    apiCall(`renewal/${loanId}/remark`)
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
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

export const updateRenewalLoanStatus = (data, isReject, isPushBack) => {
  return new Promise((resolve, reject) => {
    let apiUrl = '';
    if (isReject) {
      apiUrl = `renewal/${data?.loan_id}/rejected`
    } else if (isPushBack) {
      apiUrl = `renewal/${data?.loan_id}/pushback`
    } else if (data?.status) {
      apiUrl = 'renewal/direct_save'
    } else {
      apiUrl = `renewal/${data?.loan_id}/status/change`
    }
    apiCall(apiUrl, {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
