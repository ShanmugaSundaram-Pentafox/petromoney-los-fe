import apiCall from '../utils/api.util';

export const getAllNocRequest = () => {
  return new Promise((resolve, reject) => {
    apiCall('dealership/noc')
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
