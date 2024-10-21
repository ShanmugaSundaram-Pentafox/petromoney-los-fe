import moment from 'moment'
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

export const mapPincode = ({ body, userId, city, region, state }) => {
  let apiUrl = 'user/pincode';
  if (userId && body?.method === 'DELETE') apiUrl += `/${userId}?`;
  if (city && body?.method === 'DELETE') apiUrl += `&city=${city}`;
  if (region && body?.method === 'DELETE') apiUrl += `&region=${region}`;
  if (state && body?.method === 'DELETE') apiUrl += `&state=${state}`;
  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: body?.method,
      body: body
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
export const unmapPincode = (data) => {
  let apiUrl = 'user/pincode';

  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
      method: data?.method,
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

export const regionDel = (user, region) => {
  let apiUrl = URL.regionDel + user + '/' + region;
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

export const getCreditReload = (data) => {
  const { processed, category, filterQry = { region: '0', products: '0', account: '0', zone: '0', type: null }, dealershiId, offset } = data
  const { region, from, to, account, products, zone, dealership_id, type } = filterQry;
  let qry = []
  let apiUrl = dealershiId ? `credit/reload/${dealershiId}?processed=${processed}` : category ? `credit/reload?processed=${processed}&category=${category}` : `credit/reload?processed=${processed}`;
  if (dealership_id) qry.push(`dealership_id=${dealership_id}`)
  if (zone && zone !== '0') qry.push(`zone=${zone}`)
  if (type) qry.push(`reload_type=${type}`)
  if (region && region !== '0') qry.push(`region=${region}`)
  if (products && products !== '0') qry.push(`product=${products}`)
  if (account && account !== '0') qry.push(`account_type=${account}`)
  if (offset) qry.push(`offset=${offset}`)
  if (from && to) qry.push(`from_date=${from}&to_date=${to}`)
  if (qry.length) apiUrl += '&' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then(({ status, data, stats, message }) => {
        if (status === 'SUCCESS') {
          resolve({ data, stats })
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getCreditReportById = (filterQry = {}, url) => {
  const { from, to, dealership_id } = filterQry;
  let qry = []
  let apiUrl = `credit/reload/report?${url}&processed=1`;
  if (dealership_id) qry.push(`dealership_id=${dealership_id}`)
  if (from && to) qry.push(`from_date=${from}&to_date=${to}`)
  if (qry.length) apiUrl += '&' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status === 'SUCCESS') {
          resolve(res)
        } else {
          reject(res?.message)
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

export const getCollectionRemarkData = ({ search, dateObj, download = false, page = 1 }) => {
  let qry = []
  let apiUrl = 'loan/collection/remarks';
  if (page) qry.push(`page=${page}`)
  if (search) qry.push(`search=${search}`)
  if (download) qry.push('download=yes')
  if (dateObj?.from) qry.push(`from_date=${moment(dateObj?.from).format('YYYY-MM-DD')}&to_date=${moment(dateObj?.to).format('YYYY-MM-DD')}`)
  if (qry.length) apiUrl += '?' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status === 'SUCCESS') {
          resolve(res)
        } else {
          reject(res?.message)
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
    apiCall(`loan/${loan_id}/collection/remarks`)
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
    apiCall(`voicecall/log/${id}`, {
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

export const verifyPasswordByLogin = (data) => {
  return new Promise((resolve, reject) => {
    apiCall(URL.login, {
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
  })
}

export const deleteUserAccount = () => {
  return new Promise((resolve, reject) => {
    apiCall('user/account', {
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

// used to get the user based on pincode.
export const getUsersByPincode = ({ pincode }) => {
  return new Promise((resolve, reject) => {
    apiCall(`pincode/user-details/${pincode}`)
      .then(res => {
        if (res.status === 'SUCCESS') {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const downloadUserData = (status, qryStr = {}) => {
  return new Promise((resolve, reject) => {
    let apiUrl = 'user/mappings?download_csv=yes';
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status.toUpperCase() === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res?.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}