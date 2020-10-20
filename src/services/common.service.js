import { API } from "../config/api"
// import { URL } from "../config/serverUrls"
import { store } from "../store";

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

export const refreshExperianReportById = (id, type) => {
  const currentUser = store.getState().user.currentUser;
  return new Promise((resolve, reject) => {
    API.get(`refresh/experian/report/consumer/${id}`, {
      headers: {
        'Authorization': `Bearer ${currentUser.token}`
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
