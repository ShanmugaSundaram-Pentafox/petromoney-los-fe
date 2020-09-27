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

export const getDealersWithCoapplicants = dealershipId => {
  return new Promise((resolve, reject) => {
    API.get(`applicants/dealership/${dealershipId}`)
      .then(({ data }) => {
        if(data.status === 'SUCCESS') {
          let applicantsList = [];
          data.data.forEach((item, i) => {
            const { co_applicants, main_applicant_id, main_applicant_name } = item;
            applicantsList = applicantsList.concat({ label: `${main_applicant_name}`, value: `${main_applicant_id}_0` })
            co_applicants.forEach((coap, j) => {
              const { co_applicant_id, co_applicant_name, relationship } = coap;
              applicantsList = applicantsList.concat({ label: ` ◦ ${co_applicant_name} (${relationship.toLowerCase()})`, value: `${main_applicant_id}_${co_applicant_id}` })
            })
          })
          resolve(applicantsList)
        } else {
          reject(data.message);
        }
      })
      .catch(err => {
        reject(err.message)
      })
  });
}