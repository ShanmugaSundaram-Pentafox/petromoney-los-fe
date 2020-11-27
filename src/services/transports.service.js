// import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import apiCall from "../utils/api.util"

export const getAllTransport = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.transport)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getTransporterInfoFromID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.transportInfo}/${id}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getVehicleInfoFromID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.vehicleInfo}/${id}/vehicles`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

