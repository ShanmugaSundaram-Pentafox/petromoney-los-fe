import apiCall from '../utils/api.util';

export const getCallbackRequest = (status) => {
  return new Promise((resolve, reject) => {
    apiCall(`customer/callback?is_processed=${status}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
  
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const resolveCallbackRequest = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`customer/callback/${id}`, {
      method: 'POST',
      body: data
    })
      .then(({ status, data, message }) => {
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