/* eslint-disable quotes */
import apiCall from "../utils/api.util";
import moment from 'moment';
import { URL } from '../config/serverUrls';

export const uploadDocument = ({
  dealershipId,
  docId,
  applicantId,
  file,
}) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("applicant_id", applicantId);
    formData.append("file", file);

    apiCall(`los-poc/dealership/${dealershipId}/doc/${docId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => resolve(response))
      .catch((e) => reject(e.message));
  });
};

export const getDocumentChecklist = () => {
  return new Promise((resolve, reject) => {
    apiCall("los-poc/document-checklist", {
      method: "GET",
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const getUploadedDocuments = (dealershipId) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/dealership/${dealershipId}/documents`, {
      method: "GET",
    })
      .then((response) => {
        resolve(response?.data || []);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getAssets = () => {
  return new Promise((resolve, reject) => {
    apiCall("asset", {
      method: "GET",
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const getLiabilities = ({ dealershipId, applicantId }) => {
  return new Promise((resolve, reject) => {
    apiCall(
      `los-poc/dealership/${dealershipId}/applicant/${applicantId}/credit-report-cibil-mock`,
      {
        method: 'GET',
      }
    )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const createAsset = ({ dealershipId, applicantId, payload }) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/dealership/${dealershipId}/assets`, {
      method: 'POST',
      body: {
        applicant_id: applicantId,
        ...payload,
      },
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err.message));
  });
};

export const getApplicantAssets = ({ dealershipId, applicantId }) => {
  return new Promise((resolve, reject) => {
    apiCall(
      `los-poc/dealership/${dealershipId}/applicant/${applicantId}/assets`,
      {
        method: 'GET',
      }
    )
      .then((response) => resolve(response))
      .catch((err) => reject(err.message));
  });
};

export const deleteAsset = ({ dealershipId, applicantId, assetId }) => {
  return new Promise((resolve, reject) => {
    apiCall(
      `los-poc/dealership/${dealershipId}/applicant/${applicantId}/asset/${assetId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => resolve(response))
      .catch((err) => reject(err.message));
  });
};

export const getAllCustomers = ({ search, dateObj, download = false, page = 1, apiFilter = {} }) => {
  let qry = []
  let apiUrl = URL.customer;
  if (page) qry.push(`page=${page}`)
  if (search) qry.push(`search=${search}`)
  if (download) qry.push('download=yes')
  if (dateObj?.from) qry.push(`from_date=${moment(dateObj?.from).format('YYYY-MM-DD')}&to_date=${moment(dateObj?.to).format('YYYY-MM-DD')}`)
  Object.entries(apiFilter).forEach(([key, value]) => {
    if (value) qry.push(`${key}=${value}`);
  });
  if (qry.length) apiUrl += '?' + qry.join('&')
  return new Promise((resolve, reject) => {
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res?.message);
        }
      })
      .catch((e) => {
        reject(e?.message);
      });
  });
};

//Create Consent
export const createConsent = (body) => {
  return new Promise((resolve, reject) => {
    apiCall(`consent/create`, {
      method: 'POST',
      body,
    })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') resolve({ data, message });
        else reject(message);
      })
      .catch((e) => reject(e.message));
  });
};
//Get Consent Status
export const getConsentStatus = (customer_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`consent/list?customer_id=${customer_id}`, { method: 'GET' })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => reject(e.message));
  });
};
//Get Bank Details
export const getBankDetails = (consent_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`consent/${consent_id}/account-details`, { method: 'GET' })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => reject(e.message));
  });
};
//Initiate BSA
export const initiateBsa = (body) => {
  return new Promise((resolve, reject) => {
    apiCall(`bsa_report`, {
      method: 'POST',
      body,
    })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') resolve({ data, message });
        else reject(message);
      })
      .catch((e) => reject(e.message));
  });
};
//Get Bank Details
export const getBsaStatus = (consent_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`bsa_report/${consent_id}/status`, { method: 'GET' })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => reject(e.message));
  });
};
//Get Bank Details
export const getBsaData = (consent_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`bsa_report/${consent_id}/analyze`, { method: 'GET' })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => reject(e.message));
  });
};
//Get Bank Details
export const getFoirData = (consent_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`bsa_report/${consent_id}/foir `, { method: 'GET' })
      .then(({ status, data, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => reject(e.message));
  });
};

////////////////////// Customer Details

//CustomerDetails
export const mobileVerfiy = (body) => {
  return new Promise((resolve, reject) => {
    apiCall('los-poc/mobile-to-prefill', {
      method: 'POST',
      body
    })
      .then((res) => {
        if (res.status === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const panVerfiy = (body) => {
  return new Promise((resolve, reject) => {
    apiCall('los-poc/verify-pan', {
      method: 'POST',
      body
    })
      .then((res) => {
        if (res.status === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const aadhaarVerfiy = (body) => {
  return new Promise((resolve, reject) => {
    apiCall('los-poc/verify-aadhar', {
      method: 'POST',
      body
    })
      .then((res) => {
        if (res.status === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const validateKYCLinkage = (mobile, aadhar, pan, mobileData, panData, aadhaarData) => {
  const requestBody = {
    mobile: mobile,
    aadhar: aadhar,
    pan: pan,
    mobile_details: {
      data: {
        identity_details: mobileData?.data?.data?.identity_details || mobileData?.data?.identity_details || {},
        full_name: mobileData?.data?.data?.full_name || mobileData?.data?.full_name || "",
        mobile: mobileData?.data?.data?.mobile || mobileData?.data?.mobile || "",
        date_of_birth: mobileData?.data?.data?.date_of_birth || mobileData?.data?.date_of_birth || "",
        gender: mobileData?.data?.data?.gender || mobileData?.data?.gender || "",
        age: mobileData?.data?.data?.age || mobileData?.data?.age || ""
      }
    },
    pan_details: {
      data: {
        details: {
          masked_aadhaar: panData?.data?.data?.details?.masked_aadhaar || panData?.data?.details?.masked_aadhaar || "",
          full_name: panData?.data?.data?.details?.full_name || panData?.data?.details?.full_name || "",
          pan_number: panData?.data?.data?.pan || panData?.data?.pan || "",
          aadhaar_linked: panData?.data?.data?.details?.aadhaar_linked || panData?.data?.details?.aadhaar_linked || false,
          phone_number: panData?.data?.data?.details?.phone_number || panData?.data?.details?.phone_number || "",
          address: panData?.data?.data?.details?.address || panData?.data?.details?.address || "",
          city: panData?.data?.data?.details?.city || panData?.data?.details?.city || "",
          state: panData?.data?.data?.details?.state || panData?.data?.details?.state || "",
          date_of_birth: panData?.data?.data?.details?.date_of_birth || panData?.data?.details?.date_of_birth || "",
          gender: panData?.data?.data?.details?.gender || panData?.data?.details?.gender || ""
        }
      }
    },
    aadhar_details: {
      data: {
        details: {
          last_digits_of_mobile: aadhaarData?.data?.data?.details?.last_digits_of_mobile || aadhaarData?.data?.details?.last_digits_of_mobile || "",
          aadhaar_number: aadhaarData?.data?.data?.aadhar || aadhaarData?.data?.aadhar || "",
          age_range: aadhaarData?.data?.data?.details?.age_range || aadhaarData?.data?.details?.age_range || "",
          gender: aadhaarData?.data?.data?.details?.gender || aadhaarData?.data?.details?.gender || "",
          is_mobile: aadhaarData?.data?.data?.details?.is_mobile || aadhaarData?.data?.details?.is_mobile || false,
          state: aadhaarData?.data?.data?.details?.state || aadhaarData?.data?.details?.state || "",
          remarks: aadhaarData?.data?.data?.details?.remarks || aadhaarData?.data?.details?.remarks || ""
        }
      }
    }
  };

  return new Promise((resolve, reject) => {
    apiCall("los-poc/validate-kyc-linkage", {
      method: 'POST',
      body: requestBody
    })
      .then((response) => {
        if (response.status === 'SUCCESS') {
          resolve(response);
        } else {
          reject(response.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const saveCustomerDetails   = (body) => {
  return new Promise((resolve, reject) => {
    apiCall("los-poc/customer-details", {
      method: 'POST',
      body
    })
      .then((response) => {
        if (response.status === 'SUCCESS') {
          resolve(response);
        } else {
          reject(response.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const saveEmploymentDetails   = (body,applicant_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/applicant/${applicant_id}/employment`, {
      method: 'PUT',
      body
    })
      .then((response) => {
        if (response.status === 'SUCCESS') {
          resolve(response);
        } else {
          reject(response.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const saveCoApplicantDetails   = (body,delarership_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/dealership/${delarership_id}/coapplicant`, {
      method: 'POST',
      body
    })
      .then((response) => {
        if (response.status === 'SUCCESS') {
          resolve(response);
        } else {
          reject(response.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

/// Credit bureau details and Eligibility API

export const getCreditReport = (dealershipId, applicantId) => {
  return new Promise((resolve, reject) => {
    apiCall(
      `los-poc/dealership/${dealershipId}/applicant/${applicantId}/credit-report-cibil-mock`
    )
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const generateCreditReport = (dealershipId, applicantId) => {
  return new Promise((resolve, reject) => {
    apiCall(
      `los-poc/dealership/${dealershipId}/applicant/${applicantId}/credit-report-cibil-mock`,
      { method: 'POST' }
    )
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getLoanInfo = (dealershipId) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/dealership/${dealershipId}/loans`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') resolve(data);
        else reject(message);
      })
      .catch((e) => reject(e.message));
  });
};

export const createLoanInfo = (dealershipId, payload) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/dealership/${dealershipId}/loans`, {
      method: 'POST',
      body: payload,
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') resolve(data);
        else reject(message);
      })
      .catch((e) => reject(e.message));
  });
};

export const calculateEligibilityScore = (dealershipId, applicantId) => {
  return new Promise((resolve, reject) => {
    apiCall(
      `los-poc/dealership/${dealershipId}/applicant/${applicantId}/eligibility-score`
    )
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') resolve(data);
        else reject(message);
      })
      .catch((e) => reject(e.message));
  });
};

export const forwardLoanForApproval = (loanId, remarks) => {
  return new Promise((resolve, reject) => {
    apiCall(`los-poc/loans/${loanId}/status`, {
      method: 'POST',
      body: {
        action: 'forward',
        remarks,
      },
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') resolve(data);
        else reject(message);
      })
      .catch((e) => reject(e.message));
  });
};

