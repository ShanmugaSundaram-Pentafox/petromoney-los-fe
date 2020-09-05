import { API } from "../config/api"
import { URL } from "../config/serverUrls"

export const getDealersByDealershipId = id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealers}/${id}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getCoApplicantByDealershipId = id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.coApplicants}/${id}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getAllApplicantsByDealershipId = id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.applicants}/${id}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getDealerInfoById = (dealershipId, dealerId) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealers}/${dealershipId}/${dealerId}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}