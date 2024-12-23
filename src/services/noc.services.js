import moment from 'moment';
import apiCall from '../utils/api.util';

export const getAllNocRequest = ({ search, dateObj, download = false, page = 1, apiFilter = {} }) => {
  let qry = []
  let apiUrl = 'dealership/noc';
  if (page) qry.push(`page=${page}`)
  if (search) qry.push(`search=${search}`)
  if (download) qry.push('download=yes')
  if (dateObj?.from) qry.push(`from_date=${moment(dateObj?.from).format('YYYY-MM-DD')}&to_date=${moment(dateObj?.to).format('YYYY-MM-DD')}`)
  Object.entries(apiFilter).forEach(([key, value]) => {
    if (value) qry.push(`${key}=${value}`);
  });
  if (qry.length) apiUrl += '?' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res?.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const SubmitNocRequestbyDealershipID = (dealershipId) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealershipId}/noc/submit`, {
      method: 'POST',
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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

export const approveNocRequestbyDealershipID = (dealershipId, remark) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealershipId}/noc/approve`, {
      method: 'POST',
      body: { remarks: remark },
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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

export const rejectNocRequestbyDealershipID = (dealershipId, remark) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealershipId}/noc/reject`, {
      method: 'POST',
      body: { remarks: remark },
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
