import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import apiCall from "../utils/api.util";

export const saveDealerCreditInfo = (dealership_id, data) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${dealership_id}/${URL.creditInfo}`, data)
    apiCall(`${URL.dealership}/${dealership_id}/${URL.creditInfo}`, {
      method : 'POST',
      body :data
    })
      .then(({ status,data,message }) => {
        if(status === "SUCCESS") {
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

export const getDealersCreditInfo = dealership_id => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealership_id}/${URL.creditInfo}`)
      .then(({status, data, message }) => {
        if(status === "SUCCESS") {
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

export const getDealershipCreditReportData = dealership_id => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealership_id}/${URL.creditReport}`)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data[0] || {});
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  })
}

export const saveDealershipCreditReportData = (dealership_id, data) => {
  let url = `${URL.dealership}/${dealership_id}/${URL.creditReport}`;
  // if data contains id then update the URL with credit_report_id at the end
  if(data.id) url = `${url}/${data.id}`;

  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${dealership_id}/${URL.creditReport}`, data)
    apiCall(`${URL.dealership}/${dealership_id}/${URL.creditReport}`, {
      method : 'POST',
      body :data
    })
      .then(({status, message }) => {
        if(status === "SUCCESS") {
          resolve(true);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  })
}
