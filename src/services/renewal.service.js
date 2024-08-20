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
    if (month && month !== '0') qry.push(`renewal_month=${month}`)
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

export const getStatusWiseRecordCount = (filterType, filterQry) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month, category } = filterQry;
    let qry = []
    let apiUrl = filterType == 'enhancement' ? 'enhancement/status_wise_record_count' : 'renewal/status_wise_record_count';
    if (category) qry.push('category=noc')
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (month && month !== '0') qry.push(`renewal_month=${month}`)
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
export const getRenewalStatusList = (filterType) => {
  return new Promise((resolve, reject) => {
    let apiUrl = filterType == 'enhancement' ? 'enhancement/status' : 'renewal/status'
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

export const getPageDetails = (status, filterQry) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = filterQry;
    let qry = []
    let apiUrl = `renewal/record_count?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (month && month !== '0') qry.push(`renewal_month=${month}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '&' + qry.join('&')
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

export const getRenewalRemarks = (loanId, filterType) => {
  return new Promise((resolve, reject) => {
    let apiUrl = filterType == 'enhancement' ? `enhancement/${loanId}/remark` : `renewal/${loanId}/remark`
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

export const updateRenewalLoanStatus = ({ isReject, isPushback, isEnhancement, ...data }) => {
  return new Promise((resolve, reject) => {
    let apiUrl = '';
    if (isReject) {
      apiUrl = `renewal/${data?.loan_id}/rejected`
    } else if (isPushback) {
      apiUrl = `renewal/${data?.loan_id}/pushback`
    } else if (isEnhancement) {
      apiUrl = 'enhancement/submit'
    } else if (data?.status === 'draft') {
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


export const downloadRenewalData = (status, qryStr = {}) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = qryStr;
    let qry = []
    let apiUrl = `renewal/download_as_csv?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (month && month !== '0') qry.push(`renewal_month=${month}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '&' + qry.join('&')
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

export const sendRenewalReminder = (status, filterQry, searchText) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone, month } = filterQry;
    let qry = []
    let apiUrl = `renewal/send_reminder?status=${status}`
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
    if (products && products !== '0') qry.push(`product=${products}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (month && month !== '0') qry.push(`renewal_month=${month}`)
    if (searchText) qry.push(`dealership_id_name=${searchText}`)
    if (qry.length) apiUrl += '&' + qry.join('&')
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
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

export const syncRenewalData = ({ renewal_application_id }) => {
  return new Promise((resolve, reject) => {
    let apiUrl = `renewal/${renewal_application_id}/sync`
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
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

export const getRenewalFeeStatus = ({ dealership_id }) => {
  return new Promise((resolve, reject) => {
    let apiUrl = `renewal/${dealership_id}/fee-status`
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