import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';
import moment from 'moment';

export const getAllOnboardDealerships = ({ search, dateObj, download = false, page = 1, apiFilter = {} }) => {
  let qry = []
  let apiUrl = URL.onboardDealership || 'onboard-dealerships';
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
        reject(e?.message);
      });
  });
};

export const createOnboardDealership = (body) => {
  return new Promise((resolve, reject) => {
    apiCall(URL.onboardDealership || 'onboard-dealerships', {
      method: 'POST',
      body
    })
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

export const getOnboardDealershipById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.onboardDealership || 'onboard-dealerships'}/${id}`)
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

export const updateOnboardDealership = (id, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.onboardDealership || 'onboard-dealerships'}/${id}`, {
      method: 'PUT',
      body
    })
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

export const validateGST = (gst) => {
  return new Promise((resolve, reject) => {
    apiCall('dealership/verify-gst', {
      method: 'POST',
      body: { gst }
    })
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

export const validatePAN = (pan) => {
  return new Promise((resolve, reject) => {
    apiCall('dealership/verify-pan', {
      method: 'POST',
      body: { pan }
    })
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

export const validateUDYAM = (udyam) => {
  return new Promise((resolve, reject) => {
    apiCall('validate/udyam', {
      method: 'POST',
      body: { udyam }
    })
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

export const checkMobileNumber = (mobile) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/check-mobile/${mobile}`, {
      method: 'POST'
    })
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

export const verifyAadhaar = (aadhar, name) => {
  return new Promise((resolve, reject) => {
    apiCall('dealership/verify-aadhar', {
      method: 'POST',
      body: { aadhar, name }
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS' && data?.is_verified) {
          resolve(data);
        } else {
          reject(message || 'Aadhaar verification failed');
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
