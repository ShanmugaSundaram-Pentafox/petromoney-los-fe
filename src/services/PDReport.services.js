import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';

export const addOmcDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`omc_details/${id}`, {
      method: 'POST',
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

export const getOmcDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`omc_details/${id}`)
    .then(({ status, data, message }) => {
        console.log(id);
        if (status === "SUCCESS") {
          resolve(data)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  });
};

export const updateOmcDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`omc_details/${id}`, {
        method: 'POST',
        body: data
      })
        .then(({ status, data, message }) => {
          if (status === "SUCCESS") {
            resolve(data)
          } else {
            reject(message)
          }
        })
        .catch((e) => {
          reject(e.message)
        })
  });
};

export const addOutletDetails = (data, id) => {
    return new Promise((resolve, reject) => {
        apiCall(`outlet_details/${id}`, {
          method: 'POST',
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
}

export const updateOutletDetailsById = (data, id) => {
    return new Promise((resolve, reject) => {
        apiCall(`outlet_details/${id}`, {
            method: 'POST',
            body: data
          })
            .then(({ status, data, message }) => {
              if (status === "SUCCESS") {
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

export const getOutletDetailsById = (id) => {
    return new Promise((resolve, reject) => {
        apiCall(`outlet_details/${id}`)
        .then(({ status, data, message }) => {
            if (status === "SUCCESS") {
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

export const getInfrastructureDetailsById = (id) => {
    return new Promise((resolve, reject) => {
        apiCall(`infrastructure_details/${id}`)
        .then(({ status, data, message }) => {
            if (status === "SUCCESS") {
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

export const addInfrastructureDetails = (data, id) => {
    return new Promise((resolve, reject) => {
        apiCall(`infrastructure_details/${id}`, {
          method: 'POST',
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
}

export const addAssetDetailsById = (data, id) => {
    return new Promise((resolve, reject) => {
        apiCall(`dealership/${id}/assets`, {
          method: 'POST',
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
}

export const getAssetDetailsById = (id) => {
    return new Promise((resolve, reject) => {
        apiCall(`asset_details/${id}`)
        .then(({ status, data, message }) => {
            if (status === "SUCCESS") {
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
