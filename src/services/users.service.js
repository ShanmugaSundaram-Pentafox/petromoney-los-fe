import { URL } from '../config/serverUrls'
import apiCall from '../utils/api.util'

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.allUsers)
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
  })
}

export const getAllUserRoles = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.userRoles)
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
  })
}

export const getUsersByRole = (users = [], role = '') => {
  return users.filter(user => {
    return (user.role_name?.toUpperCase() === role.toUpperCase()) || (user.role_id === role)
  })
}

export const addNewUser = (data) => {
  let apiUrl = URL.addNewUser;

  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${userId}`, {
      method: 'DELETE'
    })
      .then(async ({ status, message }) => {
        if (status === 'SUCCESS') {
          const res = getAllUsers(userId);
          resolve({ data: res, message });
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
export const getReport = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.report)
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
  })
}
export const getLoanReportByDealershipId = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.report}/dealership/${id}`)
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
  })
}

export const getRegion = () => {
  let apiUrl = URL.region;

  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'GET',
    })
      .then(({ status, data }) => {
        if (status === 'SUCCESS') {
          console.log(data)
          resolve(data)
        } else {
          reject(data)
        }
      })
      .catch((e) => {
        reject(e.data)
      })
  })
}

export const getRegionMap = () => {
  let apiUrl = URL.regionMap
  console.log(apiUrl)
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'GET'
    })
      .then(async ({ status, data }) => {
        if (status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(e => {
        reject(e.data);
      })
  });
}

export const regionMapUser = (s) => {
  let apiUrl = URL.regionMapUser + s
  console.log(apiUrl)
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST'
    })
      .then(async ({ status, message }) => {
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

export const regionDel = (user, region) => {
  let apiUrl = URL.regionDel + user + '/' + region;
  console.log(apiUrl)
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST'
    })
      .then(async ({ status, message }) => {
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

export const regionMapAdd = (user, region) => {
  let apiUrl = URL.regionMapAdd + user + '/' + region;
  console.log(apiUrl, '@!)(#')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST'
    })
      .then(async ({ status, message }) => {
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

export const passReset = (password, userId) => {
  let apiUrl = URL.passReset
  console.log(apiUrl, password, userId)
  const data = {
    password, userId
  }
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: 'POST',
      body: data
    })
      .then(async ({ status, message }) => {
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

export const getCreditReload = (tab, filterQry={region: '0', account: '0', zone: '0'}) => {
  // const apiUrl = `credit/reload?processed=${tab}`
  const { region, from, to, account, zone } = filterQry;
  let qry = []
  let apiUrl = `credit/reload?processed=${tab}`;
  if (zone && zone !=='0') qry.push(`zone=${zone}`)
  if (region && region !=='0') qry.push(`region=${region}`)
  if (account && account !=='0') qry.push(`account_type=${account}`)
  if (from && to) qry.push(`from=${from}&to=${to}`)
  if(qry.length) apiUrl += '&'+ qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || [])
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getCreditReloadById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`credit/reload/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || [])
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getTypeOfAccount = () => {
  return new Promise((resolve, reject) => {
    apiCall('credit/reload/account/type')
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
  })
}

export const getCollectionRemark = () => {
  return new Promise((resolve, reject) => {
    apiCall('collection/remarks')
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
  })
}

export const getCollectionRemarkData = () => {
  return new Promise((resolve, reject) => {
    apiCall('loan/collection/remarks')
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
  })
}

export const getCollectionRemarkOptions = () => {
  return new Promise((resolve, reject) => {
    apiCall('collection/remarks/options')
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
  })
}

export const getCollectionRemarkByLoanId = (loan_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${loan_id}/collection/remarks`)
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
  })
}

export const getProductsMapById = (role_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`role/${role_id}/map/product`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data?.map(item => ({
            label: item.product_name,
            value: item.product_id,
          }))
          resolve(result || []);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const updateProductMapById = (role_id, data, action) => {
  return new Promise((resolve, reject) => {
    apiCall(`role/${role_id}/map/product`, {
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

export const getVoiceCallLogsById = (dealershipId) => {
  return new Promise((resolve, reject) => {
    apiCall(`voicecall/logs/${dealershipId}`)
      .then(res => {
        if (res.status === 'SUCCESS') {
          resolve(res.data); 
        } else {
          reject(res);
        }
      })
      .catch(e => {
        reject(e.data);
      
      })
  });
}

export const makeVoiceCallById = (dealershipId, data) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealershipId}/applicant/voicecall`, {
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
      .catch(e => {
        reject(e.message);
      })
  });
}

export const deleteVoiceCallById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`voicecall/log/${id}`,{
      method: 'DELETE'
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}