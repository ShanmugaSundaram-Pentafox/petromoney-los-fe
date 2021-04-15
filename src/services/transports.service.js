// import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import apiCall from "../utils/api.util"
import { decrypt } from "./crypto.service"

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
          resolve(data[0])
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getTransportOwnerInfo = (pm_user_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`transport/profile?pm_user_id=${pm_user_id}`)
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          const result = data[0];
          if(result?.pan) {
            result.pan = decrypt(result.pan);
          }
          if(result?.aadhar) {
            result.aadhar = decrypt(result.aadhar);
          }
          resolve(result)
        } else {
          reject(message)
        }
      })
      .catch(e => {
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

export const getVehicleDocuments = (transportId, vehicleId) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporter/${transportId}/vehicle/${vehicleId}/docs`)
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

export const getVehicleLoans = (vehicleId) => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/${vehicleId}/loan`)
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

export const getVehicleServiceDetails = (vehicleId, serviceId, loanId) => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/${vehicleId}/service/${serviceId}/tracker/${loanId}`)
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

export const updateVehicleServiceDetails = (vehicleId, serviceId, loanId, payload) => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/${vehicleId}/service/${serviceId}/tracker/${loanId}`, {
      method: 'POST',
      body: payload
    })
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

export const getVehicleLoanOptions = () => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/loan/options`)
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

export const getAllVehicleLoans = () => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/loans`)
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
export const addNewTransport = (data) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.vehicleInfo}`, {
      method: 'POST',
      body: data
    })
    .then(({ status, message }) => {
      if (status === "SUCCESS") {
        resolve(message)
      } else {
        reject(message)
      }
    })
    .catch((e) => {
      reject(e.message)
    })
  })
}

