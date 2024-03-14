import apiCall from '../utils/api.util';



export const getListOfStatusWithCount = () => {
  return new Promise((resolve, reject) => {
    apiCall('deferral-deviations/record/count')
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

export const getStatsData = (id, type) => {
  return new Promise((resolve, reject) => {
    apiCall(`deferral-deviations/record/count?type=${type}&party_id=${id}`, {
      // customDomain: "https://ddms-uat-api.petromoney.in/"
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


export const getDeferralDataList = (id, type, status) => {
  return new Promise((resolve, reject) => {
    apiCall(`deferral-deviations/${id}?type=${type}&status=${status}`, {
      // customDomain: "https://ddms-uat-api.petromoney.in/"
    })
      .then(res => {
        console.log('data ->', res)
        if (res?.status === 'SUCCESS') {
          resolve(res?.data);
        } else {
          reject(res?.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getAllDeferralApplicantsByDealershipId = id => {
  return new Promise((resolve, reject) => {
    apiCall(`applicant/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const active_app = data.filter(it => it?.is_active == 1)
          const result = active_app.map(item => ({
            value: item?.id?.toString(),
            label: item?.first_name,
            category: item?.category?.toLowerCase(),
          }));
          resolve(result || []);
        }
        else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getDocumentChecklistMaster = () => {
  return new Promise((resolve, reject) => {
    apiCall('master/pre_disbursal_document_checklist')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const active_app = data.filter(it => it?.is_active == 1)
          const result = active_app.map((item) => ({
            value: item?.id?.toString(),
            label: item?.name
          }));
          resolve(result || []);
        }
        else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}


export const addDeferralDeviation = (payload) => {
  return new Promise((resolve, reject) => {
    apiCall(`deferral-deviation/${payload?.party_id}/submit`, {
      method: 'POST',
      body: payload,
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(message);
        }
        else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });

};
