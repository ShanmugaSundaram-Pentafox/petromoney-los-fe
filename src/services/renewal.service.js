import apiCall from '../utils/api.util';

export const getRenewalLoanByStatus = (status, filterQry, page, searchText) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = filterQry;
    let qry = []
    let apiUrl = `renewal/application?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (month) qry.push(`renewal_month=${month}`)
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
    const { region, from, to, products, zone, month } = qryStr;
    let qry = []
    let apiUrl = 'metrics/loan/stats';
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (month) qry.push(`renewal_month=${month}`)
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

export const getStatusWiseRecordCount = (filterQry) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = filterQry;
    let qry = []
    let apiUrl = 'renewal/status_wise_record_count';
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (month) qry.push(`renewal_month=${month}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '?' + qry.join('&')

    apiCall(apiUrl)
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

export const getPageDetails = (status, filterQry) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = filterQry;
    let qry = []
    let apiUrl = `renewal/record_count?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (month) qry.push(`renewal_month=${month}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
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

export const updateRenewalLoanStatus = ({ isReject, isPushback, ...data }) => {
  return new Promise((resolve, reject) => {
    let apiUrl = '';
    if (isReject) {
      apiUrl = `renewal/${data?.loan_id}/rejected`
    } else if (isPushback) {
      apiUrl = `renewal/${data?.loan_id}/pushback`
    } else if (data?.status === 'draft') {
      apiUrl = 'renewal/direct_save'
    } else {
      apiUrl = `renewal/${data?.loan_id}/status/change`
    }

    // console.log('API URL >>', apiUrl);
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


export const downloadRenewalData = (status, qryStr = {}) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = qryStr;
    let qry = []
    let apiUrl = `renewal/application?status=${status}&download_as_csv=yes`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (month) qry.push(`renewal_month=${month}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
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