import { URL } from "../config/serverUrls";
import apiCall from "../utils/api.util";
import { decrypt } from "./crypto.service";

export const getAllGuarantor = (dealerId) => {
    return new Promise((resolve, reject) => {
      apiCall(`${URL.guarantor}/${dealerId}`)
        .then(({ status, data, message }) => {
          if(status === "SUCCESS") {
            resolve(data);
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
export const getPdfContent = (loanId, dealerId, type) => {
    return new Promise((resolve, reject) => {
      apiCall(`loans/dealership/${dealerId}/loans/${loanId}/${type}`)
        .then(({ status, file, message }) => {
          if(status === "SUCCESS") {
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