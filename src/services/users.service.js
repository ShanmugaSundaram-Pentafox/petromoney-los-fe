import { URL } from "../config/serverUrls"
import apiCall from "../utils/api.util"

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.allUsers)
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

export const getAllUserRoles = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.userRoles)
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

export const getUsersByRole = (users=[], role='') => {
  return users.filter(user => {
    return (user.role_name?.toUpperCase() === role.toUpperCase()) || (user.role_id === role)
  })
}

export const addNewUser = (data, type) => {
  let apiUrl = URL.addNewUser;
  if(type === "DEALER") apiUrl = URL.addNewDealer;
  else if(type === "TRANSPORTER") apiUrl = URL.addNewTransporter;

  return new Promise((resolve, reject) => {
    apiCall(apiUrl, {
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
export const deleteUser = (mobile) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${mobile}`, {
      method: "DELETE"
    })
      .then(async ({ status,  message }) => {
        if(status === "SUCCESS") {
          const res=getAllUsers(mobile);
          resolve({ data: res, message });
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
