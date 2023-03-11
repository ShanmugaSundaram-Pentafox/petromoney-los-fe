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

export const getCreditReload = (data) => {
  const { processed, filterQry = { region: '0', products: '0', account: '0', zone: '0' }, dealershiId, offset } = data
  const { region, from, to, account, products, zone, dealership_id } = filterQry;
  let qry = []
  let apiUrl = dealershiId ? `credit/reload/${dealershiId}?processed=${processed}` : `credit/reload?processed=${processed}`;
  if (dealership_id) qry.push(`dealership_id=${dealership_id}`)
  if (zone && zone !== '0') qry.push(`zone=${zone}`)
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

export const getCollectionRemarkData = (data) => {
  let qry = []
  let apiUrl = 'loan/collection/remarks';
  if (data?.type=='id') qry.push(`dealership_id=${data?.value}`)
  if (data?.type === 'name') qry.push(`dealership_name=${data?.value}`)
  if (qry.length) apiUrl += '?' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
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
  })}

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