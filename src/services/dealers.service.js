import { URL } from "../config/serverUrls";
import apiCall from "../utils/api.util";
import { decrypt } from "./crypto.service";

export const getDealersByDealershipId = id => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealers}/${id}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? decrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? decrypt(item.aadhar) : item.aadhar,
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

export const getCoApplicantByDealershipId = id => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.coApplicants}/${id}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? decrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? decrypt(item.aadhar) : item.aadhar,
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

export const getAllApplicantsByDealershipId = id => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.applicants}/${id}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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

export const getDealerInfoById = (dealershipId, dealerId) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealers}/${dealershipId}/${dealerId}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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

export const getDealersWithCoapplicants = dealershipId => {
  return new Promise((resolve, reject) => {
    apiCall(`applicants/dealership/${dealershipId}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          let applicantsList = [];
          data.forEach((item, i) => {
            const { co_applicants, main_applicant_id, main_applicant_name } = item;
            applicantsList = applicantsList.concat({ label: `${main_applicant_name}`, value: `${main_applicant_id}_0` })
            co_applicants.forEach((coap, j) => {
              const { co_applicant_id, co_applicant_name, relationship } = coap;
              applicantsList = applicantsList.concat({ label: ` ◦ ${co_applicant_name} (${relationship.toLowerCase()})`, value: `${main_applicant_id}_${co_applicant_id}` })
            })
          })
          resolve(applicantsList)
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message)
      })
  });
}
export const getDealerDetails = () => {
  return new Promise((resolve, reject) => {
    apiCall(`loan/report`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
export const getDealerTransportsList = () => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.vehicleInfo}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
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
export const deleteProfileDoc = (data, dealership_id, dealer_id, type) => {
  let apiURL = type === 'DEALER' ? 'dealers' : type === 'COAPPLICANT' ? 'coapplicants': 'guarantors'
  return new Promise((resolve, reject) => {
    apiCall(`${apiURL}/${dealer_id}/${dealership_id}`, {
      method: "DELETE",
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
// export const getSanctionLetterPdf = (loan_id,id) => {
//   return new Promise((resolve, reject) => {
//     apiCall(`loans/${loan_id}/${id}/sanction`)
//       .then(({ status, data, message }) => {
//         if (status === "SUCCESS") {
//           resolve(data);

//         } else {
//           reject(message);
//         }
//       })
//       .catch(e => {
//         reject(e.message);
//       })
//   });
// }