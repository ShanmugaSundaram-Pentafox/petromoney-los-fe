import { API } from "../config/api"
import { URL } from "../config/serverUrls"

export const saveDealerCreditInfo = (dealership_id, data) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.dealership}/${dealership_id}/${URL.creditInfo}`, data)
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

export const getDealersCreditInfo = dealership_id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${dealership_id}/${URL.creditInfo}`)
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

export const getDealershipCreditReportData = dealership_id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${dealership_id}/${URL.creditReport}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data[0] || {});
        } else {
          reject(data.message);
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
    API.post(`${URL.dealership}/${dealership_id}/${URL.creditReport}`, data)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(true);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  })
}
