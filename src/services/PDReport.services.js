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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
    apiCall('asset')
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
export const updateAssetDetailsById = (data, dealer_id, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${dealer_id}/assets/${id}`, {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
export const getBankDetailsbyID = (id, resquestType) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/bank`)
      .then(({ status, data = [], message }) => {
        // Check whether the request type is a Credit Reload Request (CRR).
        // If it is, map the data to a new array of objects with 'label' and 'id' properties.
        // Otherwise, resolve the promise with the original data array to use it in Personal Description Report(PDR).
        if (status === 'SUCCESS') {
          if (resquestType?.type == 'CRR') {
            const result = data?.map((item) => ({
              label: `${item.account_no} - ${item.bank_name}`,
              id: item.id
            }));
            resolve(result || [])
          }
          else
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
  let url = `dealership/${id}/bank`;
  if (data?.id) {
    url += `/${data?.id}`
  }
  return new Promise((resolve, reject) => {
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
export const deleteBankDetailsByID = (data, id) => {
  let url = `dealership/${id}/bank`;
  if (data?.id) {
    url += `/${data?.id}`
  }
  return new Promise((resolve, reject) => {
    apiCall(url, {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
        if (status === 'SUCCESS') {
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
      .then(res => {
        if (res.status === 'SUCCESS') {
          resolve(res)
        } else {
          reject(res.message)
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
        if (status === 'SUCCESS') {
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
export const deleteIncomeDetailsByID = (data) => {
  return new Promise((resolve, reject) => {
    let url = `dealership/income/details/${data.id}`
    apiCall(url, {
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
export const getExpensesDetailsById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/expense/details`)
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
export const deleteExpenseDetailsByID = (data, id, isEdit) => {
  return new Promise((resolve, reject) => {
    let url = `dealership/expense/details/${data.id}`
    apiCall(url, {
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
export const getReferenceDetailsbyID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/references`)
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
  });
}
export const addReferenceDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/references`, {
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
export const updateReferenceById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/references`, {
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
export const deleteReferenceDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/references/${data.id}`, {
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
export const getOtherDetailsbyID = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/details`)
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
  });
}
export const addAdditionalDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/details`, {
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
export const updateAdditionalDetails = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/details/${data.id}`, {
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
export const deleteOtherDetailsByID = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/${id}/details/${data.id}`, {
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
export const bankAccValidate = (AccId = 1175155000148626, IFSC = 'KVBL0001175') => {
  return new Promise((resolve, reject) => {
    apiCall(`bank/${AccId}/${IFSC}`, {
      method: 'POST'
    })
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data?.[0])
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  });
}

