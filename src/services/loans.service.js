import { API } from "../config/api"
import { URL } from "../config/serverUrls"

export const getAllLoans = () => {
  return new Promise((resolve, reject) => {
    API.get(URL.loans)
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

export const getLoansByStatus = status => {
  return new Promise((resolve, reject) => {
    API.get(URL.loans, {
      params: {
        status
      }
    })
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