import apiCall from '../utils/api.util';

export const getAllWithheldLoans = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`withheld/loans?is_resolved=${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          let res=[]
          data.forEach((item, i) => {
            res.push({
              ...item,
              comments: typeof (item.comments) === 'string' ? JSON.parse(item.comments) : (item.comments || [])
            })
          })
          resolve(res)
        } else {
          reject(message)
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
export const resolveRemarks = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`withheld/loans/${id}`, {
      method: 'POST',
      body: {
        is_resolved: 1
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
export const deleteRemarks = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`withheld/loans/${id}`, {
      method: 'DELETE',

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