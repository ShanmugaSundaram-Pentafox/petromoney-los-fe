import { API } from "../config/api"
import { URL } from "../config/serverUrls"

export const getBusinessTypes = () => {
  return new Promise((resolve, reject) => {
    API.get("business/types")
      .then(({ data }) => {
        if(data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const getExperianReportById = (id, type) => {
  return new Promise((resolve, reject) => {
    API.get(`experian/report/${id}/${type}`)
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
