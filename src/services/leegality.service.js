import { cryptoDecrypt } from './crypto.service';
import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';

export const getAllGuarantor = (dealerId) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.guarantor}/${dealerId}`)
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
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
//   export const updateGuarantor = (dealershipId, guarantorId, body) => {
//     return new Promise((resolve, reject) => {
//       apiCall(`${URL.guarantor}/${dealershipId}/`, {
//         method: "POST",
//         body,
//       })
//         .then(async ({ status, data, message }) => {
//           if(status === "SUCCESS") {
//             const res = await getDealershipLoansById(dealershipId);
//             const updatedLoanData = await getLoanById(dealershipId, loanId);
//             resolve({ loans: res, data: updatedLoanData, message });
//           } else {
//             reject(message);
//           }
//         })
//         .catch(e => {
//           reject(e.message);
//         })
//     });
//   }
export const getPdfContent = (loanId, dealerId, type, date) => {
  return new Promise((resolve, reject) => {
    apiCall(`loans/dealership/${dealerId}/loans/${loanId}/${type}?date=${date}`)
      .then(({ status, file, message }) => {
        if (status === 'SUCCESS') {
          resolve(file);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const deleteRequestUrl = (value) => {
  return new Promise((resolve, reject) => {
    apiCall('document/remove/invitation', {
      method: 'POST',
      body:value,
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};