import apiCall from '../utils/api.util';

export const getUnmappedStates = () => {
  return new Promise((resolve, reject) => {
    apiCall('states/unmapped')
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

export const getUnmappedRegions = () => {
  return new Promise((resolve, reject) => {
    apiCall('regions/unmapped')
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

export const getZonesMapById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`zone/${id}/map`)
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

export const getStatesMapById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`state/${id}/map`)
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

export const updateZoneMapById = (id, data, action) => {
  return new Promise((resolve, reject) => {
    apiCall(`zone/${id}/map`, {
      method: action === 'add' ? 'POST' : 'DELETE',
      body: data,
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

export const updateRegionMapById = (id, data, action) => {
  return new Promise((resolve, reject) => {
    apiCall(`state/${id}/map`, {
      method: action === 'add' ? 'POST' : 'DELETE',
      body: data,
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

export const getCity = (filter) => {
  return new Promise((resolve, reject) => {
    apiCall('master/city')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const updateCity = (data, id) => {
  const apiUrl = id ? `master/city/${id}` : 'master/city'
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST',
      body: data,
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

export const updateCollectionRemark = (data, id) => {
  const apiUrl = id ? `collection/remarks/${id}` : 'collection/remarks'
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST',
      body: data,
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