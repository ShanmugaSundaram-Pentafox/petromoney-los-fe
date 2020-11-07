import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import { store } from "../store"

export const getAllTransport = () => {

  return new Promise((resolve, reject) => {
    API.get(URL.transport)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data)
        } else {
          reject(data.message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getTransporterInfoFromID = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.transportInfo}/${id}`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data)
        } else {
          reject(data.message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getVehicleInfoFromID = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.vehicleInfo}/${id}/vehicles`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data)
        } else {
          reject(data.message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

