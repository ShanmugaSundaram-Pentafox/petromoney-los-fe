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

export const getRbacResources = (resource_type='MDM', resource_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`rbac/resource${resource_id ? `/${resource_id}` : `?type=${resource_type}`}`)
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

export const updateRbacActionsDescription = (data, action_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`rbac/action/${action_id}`, {
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

export const createNewResource = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('rbac/resource', {
      method: 'POST',
      body: data,
    })
      .then(({ status, message, row_id }) => {
        if (status === 'SUCCESS') {
          resolve(row_id);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const AddActionsToResource = (data, resource_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`rbac/resource/${resource_id}`, {
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