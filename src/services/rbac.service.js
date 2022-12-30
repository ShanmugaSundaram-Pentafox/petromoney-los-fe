import apiCall from '../utils/api.util';

export const getRbacAccessDetails = (role_id, type='MDM') => {
  if(typeof(role_id) != 'undefined') {
    return new Promise((resolve, reject) => {
      apiCall(`role/${role_id}/access?type=${type}`)
        .then(({ status, data, message }) => {
          if (status === 'SUCCESS') {
            resolve(data)
          } else {
            reject(message)
          }
        })
        .catch((e) => {
          reject(e.message)
        })
    });
  }
}

export const getRbacResources = () => {
  return new Promise((resolve, reject) => {
    apiCall('rbac/resource?type=MDM')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  });
}

export const updateRbacAccess = (data, role_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`role/${role_id}/access`, {
      method: 'PUT',
      body: data,
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