// import { API } from "../config/api"
import { cryptoDecrypt } from './crypto.service'
import { URL } from '../config/serverUrls'
import apiCall from '../utils/api.util'

export const getAllTransport = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.transport)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? cryptoDecrypt(item.pan) : item.pan,
            // aadhar: item?.aadhar ? cryptoDecrypt(item.aadhar) : item.aadhar,
          }));
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getTransportersOwnerById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.vehicleInfo}/owner/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
    apiCall(`${URL.vehicleInfo}/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
    // apiCall(`transport/profile?pm_user_id=${pm_user_id}`)
    apiCall(`transport/owner/${pm_user_id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data[0];
          if (result?.pan) {
            result.pan = cryptoDecrypt(result.pan);
          }
          if (result?.aadhar) {
            result.aadhar = cryptoDecrypt(result.aadhar);
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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

export const updateVehicleServiceDetails = (id, vehicleId, serviceId, data, loanId) => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/${vehicleId}/service/${serviceId}/tracker/${loanId}`, {
      method: 'POST',
      body: data
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
    apiCall('vehicle/loan/options')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
    apiCall('vehicle/loans')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
export const deleteVehicleLoan = (rowData) => {
  return new Promise((resolve, reject) => {
    apiCall(`vehicle/${rowData.vehicle_id}/loan/${rowData.id}`, {
      method: 'DELETE',
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const addNewTransport = (data) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.vehicleInfo}`, {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const updateTransport = (id, data) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.vehicleInfo}/${id}`, {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const addNewVehicle = (data, transId) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporters/${transId}/vehicles`, {
      method: 'POST',
      body: { tt_no: data.tt_no }
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const updateVehicle = (data, transId, vehicleId) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporters/${transId}/vehicles/${vehicleId}`, {
      method: 'POST',
      body: { tt_no: data.tt_no }
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const deleteVehicleStatus = (id, vehicleId) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporters/${id}/vehicles/${vehicleId}`, {
      method: 'DELETE',
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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

export const getOwnersById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`transport/owners/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? cryptoDecrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? cryptoDecrypt(item.aadhar) : item.aadhar,
          }));

          resolve(result);
        } else {
          reject(message);
        }
        // if (status === "SUCCESS") {
        //   resolve(data)
        // } else {
        //   reject(message)
        // }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}
export const addNewTransportOwner = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('transport/owner', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const getTransportsByOwnersId = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporters/owner/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? cryptoDecrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? cryptoDecrypt(item.aadhar) : item.aadhar,
          }));

          resolve(result);
        } else {
          reject(message);
        }
        // if (status === "SUCCESS") {
        //   resolve(data)
        // } else {
        //   reject(message)
        // }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getOwnerDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`transport/owner/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? cryptoDecrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? cryptoDecrypt(item.aadhar) : item.aadhar,
          }));

          resolve(result[0]);
        } else {
          reject(message);
        }
        // if (status === "SUCCESS") {
        //   resolve(data)
        // } else {
        //   reject(message)
        // }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getFleetOperatorsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/operators`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const addNewFleetOperator = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/operators`, {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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

export const updateFleetOperator = (data, dealerId, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealerId}/operators/${id}`, {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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

export const deleteVehicleDoc = (id, rowData, vehicle) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporter/${id}/vehicle/${vehicle.vehicle_id}/docs/${rowData.id}`, {
      method: 'DELETE',
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
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
export const deleteTransportProfileDoc = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`transporters/${id}`, {
      method: 'DELETE',
      body: data

    })
      .then(async ({ res, status, message }) => {
        resolve({ res, message });
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
export const deleteTransportOwnerProfileDoc = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`transport/owner/${id}`, {
      method: 'DELETE',
      body: data

    })
      .then(async ({ res, status, message }) => {
        resolve({ res, message });
      })
      .catch(e => {
        reject(e.message);
      })
  });
}