import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';

export const addOmcDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/omc`, {
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
    apiCall(`dealership/${id}/omc`)
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

export const updateOmcDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/omc`, {
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
    apiCall(`dealership/${id}/outlet`, {
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
    apiCall(`dealership/${id}/outlet`, {
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
    apiCall(`dealership/${id}/outlet`)
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
    apiCall(`dealership/${id}/infrastructure`)
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
    apiCall(`dealership/${id}/infrastructure`, {
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

export const getTankersById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker`)
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

export const addNewTanker = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker/${data.vehicle_no}`, {
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

export const updateTankerByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker/${data.vehicle_no}`, {
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
