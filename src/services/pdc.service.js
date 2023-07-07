import apiCall from '../utils/api.util';

export const addPdcCollection = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`pdc-collection/${id}`, {
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

export const addPdcBank = (data, collectionId, bankId) => {
  return new Promise((resolve, reject) => {
    let url = bankId ? `pdc-bank-details/${bankId}` : `pdc-bank-details/${collectionId}`
    apiCall(url, {
      method: bankId ? 'PATCH' : 'POST',
      body: bankId ? data : {
        banks: [
          data,
        ]
      },
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

export const addPdcCheque = (data, id) => {
  console.log('data >>>>>>>>>>>>>>>>', data)
  return new Promise((resolve, reject) => {
    apiCall(`pdc-cheque-details/${id}`, {
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

export const getPdcCollection = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`pdc-collection/${id}`)
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
};


export const getPdcBank = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`pdc-bank-details/${id}`)
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
};

export const getPdcCollectionDetails = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`pdc-collection/${id}?consolidate_pdc=yes`)
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
};

export const getOmcDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}`)
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
};

export const getTransitDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`pdc-collection-events/${id}`)
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
};

export const updatePdcCollection = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`pdc-collection/${id}`, {
      method: 'PATCH',
      body: data
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  });
};
