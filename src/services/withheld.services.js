import moment from 'moment';
import apiCall from '../utils/api.util';

export const getWithheldLoansData = ({is_resolved, search, dateObj, download = false, page = 1, apiFilter = {}}) => {
  let qry = []
  let apiUrl = `withheld/loans?is_resolved=${is_resolved}`;
  if (page) qry.push(`page=${page}`)
  if (search) qry.push(`search=${search}`)
  if (download) qry.push('download=yes')
  if (dateObj?.from) qry.push(`from_date=${moment(dateObj?.from).format('YYYY-MM-DD')}&to_date=${moment(dateObj?.to).format('YYYY-MM-DD')}`)
  Object.entries(apiFilter).forEach(([key, value]) => {
    if (value) qry.push(`${key}=${value}`);
  });
  if (qry.length) apiUrl += '?' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status === 'success') {
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

export const getAllWithheldRemarks = () => {
  return new Promise((resolve, reject) => {
    apiCall('loans/remarks')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            label: item.remarks,
            value: item.id,
          }))
          resolve(result || [])
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}
export const updateRemarks = (id, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/withheld/loans`, {
      method: 'POST',
      body
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
export const resolveRemarks = (id, remarks) => {
  return new Promise((resolve, reject) => {
    apiCall(`withheld/loans/${id}`, {
      method: 'POST',
      body: {
        is_resolved: 1,
        remarks,
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
export const deleteRemarks = (id, remarks) => {
  return new Promise((resolve, reject) => {
    apiCall(`withheld/loans/${id}`, {
      method: 'DELETE',
      body: {
        remarks,
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