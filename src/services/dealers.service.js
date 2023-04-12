import { decrypt } from './crypto.service';
import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';

export const getDealersByDealershipId = id => {
  return new Promise((resolve, reject) => {
    apiCall(`applicant/${id}?category=DEALER`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? decrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? decrypt(item.aadhar) : item.aadhar,
          }));

          resolve(result || []);
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
    apiCall(`applicant/${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          const result = data.map(item => ({
            ...item,
            pan: item?.pan ? decrypt(item.pan) : item.pan,
            aadhar: item?.aadhar ? decrypt(item.aadhar) : item.aadhar,
          }));
          resolve(result || []);
        }
        else {
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
        if (status === 'SUCCESS') {
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
    apiCall('loan/report')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
export const deleteProfileDoc = (docType, dealership_id, dealer_id, type) => {
  return new Promise((resolve, reject) => {
    apiCall(`applicant/${dealer_id}/${dealership_id}?type=${docType}`, {
      method: 'DELETE',
    })
      .then(async ({ res, status, message }) => {
        resolve({ res, message });
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getCreditInfo = (dealershipId) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${dealershipId}/credit/info`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getCrimeInfo = (applicantId, applicantType) => {
  return new Promise((resolve, reject) => {
    apiCall(`${applicantId}/crimecheck?type=${applicantType}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getCrimeReport = (url) => {
  return new Promise((resolve, reject) => {
    apiCall(url, {
      method: 'POST',
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  })
}

export const updateCreditInfo = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/credit/info`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, data, profile_status }) => {
        if (status === 'SUCCESS') {
          resolve(profile_status);
        } else {
          reject(profile_status);
        }
      })
      .catch(e => {
        reject(e.profile_status);
      })
  });
}

export const deleteApplicantById = (dealership_id, dealer_id, type) => {
  let apiURL = type === 'Dealer' ? 'dealers' : type === 'Co-Applicant' ? 'coapplicants' : 'guarantors'
  return new Promise((resolve, reject) => {
    apiCall(`${apiURL}/${dealership_id}/${dealer_id}`, {
      method: 'DELETE',
      body: { is_active: 0 }
    })
      .then(async ({ res, status, message }) => {
        if (status === 'SUCCESS') {
          resolve({ res, message });
        } else {
          reject(message)
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getPincodeDetails = (pincode) => {
  return new Promise((resolve, reject) => {
    apiCall(`pincode/${pincode}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getKycStatus = (type, dealershipId, applicantId) => {
  return new Promise((resolve, reject) => {
    apiCall(`vkyc/${dealershipId}/${applicantId}/initiation?type=${type}`)
      .then(({ status, is_initiated, message }) => {
        if (status === 'SUCCESS') {
          resolve({ status, is_initiated, message });
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const initiateKYC = (type, dealershipId, applicantId, agentId) => {
  return new Promise((resolve, reject) => {
    apiCall(`vkyc/${dealershipId}/${applicantId}/initiation`, {
      method: 'POST',
      body: { type: type, agent_id: agentId }
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e);
      })
  });
}

export const getKycAgents = () => {
  return new Promise((resolve, reject) => {
    apiCall('vkyc/agent/list')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const updateApplicantDataById = (id, applicantId) => {
  return new Promise((resolve, reject) => {
    apiCall(`applicant/${id}/${applicantId}/swap`, {
      method: 'POST'
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(message);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}