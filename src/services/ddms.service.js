import apiCall from '../utils/api.util';

export const getDDMSChecklist = () => {
  return new Promise((resolve, reject) => {
    apiCall('pre_disbursal_document_checklist')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      })
  })
}

export const getDeferralMappingById = ({ dealershipId, id }) => {
  return new Promise((resolve, reject) => {
    apiCall(`open/deferral-deviations/${dealershipId}/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      })
  })
}

export const updateDeferralDetails = ({ body }) => {
  return new Promise((resolve, reject) => {
    apiCall(`${body?.id}/pre_disbursal_document_checklist`, {
      method: 'POST',
      body: body?.data,
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      })
  })
}

export const getDeferralDetails = ({ id }) => {
  return new Promise((resolve, reject) => {
    apiCall(`${id}/pre_disbursal_document_checklist`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      })
  })
}

export const checkEligibleDeferralDetails = ({ id, body, event = '' }) => {
  return new Promise((resolve, reject) => {
    apiCall(`pre_disbursal_document_checklist/${id}?event=${event}`, {
      method: 'POST',
      body: body?.data,
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          event === 'mark_as_completed' ? resolve([{ pdc_completed: true }]) : resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      })
  })
}

export const reInitiateDeferralDetails = ({ id, body }) => {
  return new Promise((resolve, reject) => {
    apiCall(`pre_disbursal_document_checklist/${id}/reinitiate`, {
      method: 'POST',
      body: body?.data,
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e?.message || e);
      })
  })
}