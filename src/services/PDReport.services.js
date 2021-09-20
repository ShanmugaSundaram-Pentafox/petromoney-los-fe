import { URL } from '../config/serverUrls';
import apiCall from '../utils/api.util';

export const addOmcDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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

export const getOmcDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}`)
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
  });
};

export const updateOmcDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/omc`, {
      method: 'POST',
      body: data
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
  });
};

export const addOutletDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/outlet`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}

export const updateOutletDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/outlet`, {
      method: 'POST',
      body: data
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
  });
}

export const getOutletDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/outlet`)
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
  });
}

export const getInfrastructureDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/infrastructure`)
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
  });
}

export const addInfrastructureDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/infrastructure`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const getAssetList = () => {
  return new Promise((resolve, reject) => {
    apiCall(`asset`)
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
  });
}


export const addAssetDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/assets`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const updateAssetDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/assets/${data.id}`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const deleteAssetDetailsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/assets/${data.id}`, {
      method: 'DELETE',
      body: data,
    })
      .then(({ status, message }) => {
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
}

export const getAssetDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/assets`)
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
  });
}

export const getTankersById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker`)
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
  });
}

export const addNewTanker = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const deleteTanker = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker/${data.vehicle_no}`, {
      method: 'DELETE',
    })
      .then(({ status, message }) => {
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
}


export const updateTankerByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/tanker`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}


export const getBankDetailsbyID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank`)
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
  });
}
export const updateBankDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const deleteBankDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank`, {
      method: 'DELETE',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const updateBusinessDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/business/details`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const getBusinessDetailsbyID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/business/details`)
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
  });
}
export const AddNewPartnersByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/business/partner`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const getPartnerDetailsbyID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/business/partner`)
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
  });
}
export const updatePartnersByID = (data, dealer_id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealer_id}/business/partner/${data.id}`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const getLoanDetailsbyID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank/loans`)
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
  });
}
export const addLoanDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank/loans`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const updateLoanDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank/loans/${data.loan_id}`, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}
export const deleteLoanDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank/loans/${data.loan_id}`, {
      method: 'DELETE',
      body: data,
    })
      .then(({ status, message }) => {
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
}

export const downloadPDReport = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/pdr`)
      .then(({ status, base64, message }) => {
        if (status === "SUCCESS") {
          resolve(base64)
        } else {
          reject(message)
        }
      })
      .catch(({ message }) => {
        reject(message)
      })
  });
}

export const getIncomeDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/income/details`)
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
  });
}

export const addIncomeDetailsByID = (data, id, isEdit) => {
  return new Promise((resolve, reject) => {
    let url = isEdit ? `dealership/income/details/${data.id}` : `dealership/${id}/income/details`
    apiCall(url, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}

export const getExpensesDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/expense/details`)
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
  });
}
export const addExpenseDetailsByID = (data, id, isEdit) => {
  return new Promise((resolve, reject) => {
    let url = isEdit ? `dealership/expense/details/${data.id}` : `dealership/${id}/expense/details`
    apiCall(url, {
      method: 'POST',
      body: data,
    })
      .then(({ status, message }) => {
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
}

