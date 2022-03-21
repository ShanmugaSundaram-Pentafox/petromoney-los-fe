import apiCall from "../utils/api.util";

export const getUnmappedStates = () => {
    return new Promise((resolve, reject) => {
      apiCall(`states/unmapped`)
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
      apiCall(`regions/unmapped`)
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