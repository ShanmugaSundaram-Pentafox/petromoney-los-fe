import { decrypt } from './crypto.service';
import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';

export const getAllDealership = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.dealership)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map((item, i) => {
            let pan = item.pan;
            let gst = item.gst;
            if (pan) {
              pan = decrypt(pan)
            }
            if (gst) {
              gst = decrypt(gst)
            }
            return {
              ...item,
              pan,
              gst,
            }
          })
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data[0];
          if (result?.pan) {
            result.pan = decrypt(result.pan);
          }
          if (result?.gst) {
            result.gst = decrypt(result.gst);
          }
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipLoansById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/loans`)
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

export const getDealershipCheckList = (id) => {
  return new Promise((resolve, reject) => {
    if (id) {
      apiCall(`${URL.checklist}/${id}`)
        .then(({ status, data, message }) => {
          if (status === 'SUCCESS') {
            const result = data.filter(item => item.doc_type === 'dealership');
            resolve(result);
          } else {
            reject(message);
          }
        })
        .catch((e) => {
          reject(e.message);
        });
    }
  });
};

export const uploadDocument = (dealershipID, docID, files) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.checklist}/${dealershipID}/doc/${docID}`, files)
    apiCall(`${URL.checklist}/${dealershipID}/doc/${docID}`, {
      method: 'POST',
      body: files
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
export const deleteDealershipDocument = (data, id) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.checklist}/${dealershipID}/doc/${docID}`, files)
    apiCall(`dealership/${id}`, {
      method: 'DELETE',
      body: data
    })
      .then(({ message }) => {
        resolve(message);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const deleteDocsImage = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.checklist}/${id}`, {
      method: 'DELETE',
      body: {
        id: data
      }
    })
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
export const editDocsImage = (dealershipId, docId, data) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.checklist}/${dealershipId}/doc/${docId}/${data?.file_id}`, {
      method: 'POST',
      body: {
        ...data
      }
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

export const downloadAccountStatement = (id, from_date, to_date) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/soa?from_date=${from_date}&to_date=${to_date}`)
      .then(res => {
        if (res.status === 'SUCCESS') {
          if(res?.file) {
            resolve(res)
          }
          else {
            reject(res.message)
          }
        } else {
          reject(res.message)
        }
      })
      .catch(({ message }) => {
        reject(message)
      })
  });
}

export const validateId = (action, id, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${action}/${id}`, {
      method: 'POST',
      body: body ? { name: body } : {}
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data[0] || [])
        } else {
          reject(message)
        }
      })
      .catch(({ message }) => {
        reject(message)
      })
  });
}

export const getDealershipReferral = (id) => {
  return new Promise((resolve, reject) => {
    apiCall('dealership/referral')
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

export const getDealershipReferralSettledList = () => {
  return new Promise((resolve, reject) => {
    apiCall('dealership/referral/history')
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

export const postReferralData = (dealershipID, data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealershipID}/referral/${id}`, {
      method: 'POST',
      body: data
    })
      .then(({ data, status, message }) => {
        if (status == 'SUCCESS')
          resolve(message);
        else
          reject(message)
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getResignList = () => {
  return new Promise((resolve, reject) => {
    apiCall('document/resign/list')
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

export const deleteResignDocument = (dealership_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`document/resign/list?dealership_id=${dealership_id}`, {
      method: 'DELETE'
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

export const getTrancheStatusById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${id}/tranche/status`)
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
}

export const getCreditReloadLimitById = (id) => {
  const url = `credit/reload/${id}/limit`;
  return new Promise((resolve, reject) => {
    apiCall(url)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data[0]);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};