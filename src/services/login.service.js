import { URL } from "../config/serverUrls"
import apiCall from "../utils/api.util";


export const getOTP = (number) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.verifyMobileNumber}`, {
      method: 'POST',
      body: { mobile: number }
    })
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(status);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const resendOTP = (number) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.resendOtp}`, {
      method: 'POST',
      body: { mobile: number }
    })
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(status);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}