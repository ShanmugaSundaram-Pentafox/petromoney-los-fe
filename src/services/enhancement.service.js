import apiCall from '../utils/api.util';

export const getEnhancedLoanByStatus = (status, filterQry, page, searchText) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = filterQry;
    let qry = []
    let apiUrl = `enhancement/application?status=${status}`;
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

export const getStatusWiseRecordCount = (filterQry) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = filterQry;
    let qry = []
    let apiUrl = 'enhancement/status_wise_record_count';
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
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
export const getEnhancementStatusList = () => {
  return new Promise((resolve, reject) => {
    apiCall('enhancement/status')
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
    const { region, from, to, products, zone } = filterQry;
    let qry = []
    let apiUrl = `enhancement/record_count?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
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

export const updateEnhancementLoanStatus = ({ isReject, isPushback, ...data }, id) => {
  return new Promise((resolve, reject) => {
    let apiUrl = '';
    if (isReject) {
      apiUrl = `enhancement/${id}/rejected`
    } else if (isPushback) {
      apiUrl = `enhancement/${id}/pushback`
    } else if (data?.status === 'draft') {
      apiUrl = 'enhancement/direct_save'
    } else {
      apiUrl = `enhancement/${id}/status/change`
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

export const sendLoanForEnhancement = (data) => {
  return new Promise((resolve, reject) => {
    let apiUrl = 'enhancement/submit';
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


export const downloadEnhancementData = (status, qryStr = {}) => {
  return new Promise((resolve, reject) => {
    const { region, from, to, products, zone } = qryStr;
    let qry = []
    let apiUrl = `enhancement/download_as_csv?status=${status}`;
    if (zone && zone !== '0') qry.push(`zone=${zone}`)
    if (region && region !== '0') qry.push(`region=${region}`)
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

export const getEnhancementSync = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`enhancement/${id}/sync`)
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