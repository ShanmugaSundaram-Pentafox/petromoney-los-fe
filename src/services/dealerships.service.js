import { API } from "../config/api"
import { URL } from "../config/serverUrls"

export const getAllDealership = () => {
  return new Promise((resolve, reject) => {
    API.get(URL.dealership)
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

export const getDealershipById = id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}`)
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data[0]);
        } else {
          reject(data.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getDealershipLoansById = id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}/loans`)
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

export const getDealershipSalesById = id => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.salesInfo}/${id}`)
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