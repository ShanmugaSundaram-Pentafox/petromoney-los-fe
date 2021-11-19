import { URL } from "../config/serverUrls";
import apiCall from "../utils/api.util";
import { cryptoDecrypt, decrypt } from "./crypto.service";

export const getAllDealership = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.dealership)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          const result = data.map((item, i) => {
            let pan = item.pan;
            let gst = item.gst;
            if (pan) {
              pan = decrypt(pan)
            }
            if (gst) {
              gst = decrypt(gst)
            }
            return {
              ...item,
              pan,
              gst,
            }
          })
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          const result = data[0];
          if (result?.pan) {
            result.pan = decrypt(result.pan);
          }
          if (result?.gst) {
            result.gst = decrypt(result.gst);
          }
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipLoansById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/loans`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipIncomeById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/income/details`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipIncomeById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${id}/income/details`, body)
    apiCall(`${URL.dealership}/${id}/income/details`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipIncomeById(id);
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const updateDealershipIncomeById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/income/details/${body.id}`, body)
    apiCall(`${URL.dealership}/income/details/${body.id}`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipIncomeById(id);
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipExpensesById = (id) => {
  return new Promise((resolve, reject) => {
    // API.get(`${URL.dealership}/${id}/expense/details`)
    apiCall(`${URL.dealership}/${id}/expense/details`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipExpensesById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${id}/expense/details`, body)
    apiCall(`${URL.dealership}/${id}/expense/details`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipExpensesById(id)
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const updateDealershipExpenseById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/expense/details/${body.id}`, body)
    apiCall(`${URL.dealership}/expense/details/${body.id}`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipExpensesById(id);
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipSalesById = (id) => {
  return new Promise((resolve, reject) => {
    // API.get(`${URL.salesInfo}/${id}`)
    // API.get(`${URL.dealership}/${id}/salesdata`)
    apiCall(`${URL.dealership}/${id}/salesdata`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipSalesById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${id}/salesdata`, body)
    apiCall(`${URL.dealership}/${id}/salesdata`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipSalesById(id)
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const deleteDealershipSalesById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${id}/salesdata`, body)
    apiCall(`${URL.dealership}/${id}/salesdata`, {
      method: 'DELETE',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipSalesById(id)
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipCheckList = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.checklist}/${id}`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          const result = data.filter(item => item.doc_type === "dealership");
          resolve(result);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const uploadDocument = (dealershipID, docID, files) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.checklist}/${dealershipID}/doc/${docID}`, files)
    apiCall(`${URL.checklist}/${dealershipID}/doc/${docID}`, {
      method: 'POST',
      body: files
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
export const deleteDealershipDocument = (data, id) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.checklist}/${dealershipID}/doc/${docID}`, files)
    apiCall(`dealership/${id}`, {
      method: 'DELETE',
      body: data
    })
      .then(({ message }) => {
        resolve(message);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};



export const getDealershipFinancialsById = (id, from, to) => {
  return new Promise((resolve, reject) => {
    // API.get(`${URL.dealership}/${id}/financials`)
    apiCall(`${URL.dealership}/${id}/financials?from_year=${from}&to_year=${to}`)
      .then(({ data, status, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipFinancialsById = (id, body) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${id}/financials`, body)
    apiCall(`${URL.dealership}/${id}/financials`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipFinancialsById(id, body.from_year, body.to_year);
          resolve(res[0]);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
export const deleteDocsImage = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.checklist}/${id}`, {
      method: 'DELETE',
      body: {
        id: data
      }
    })
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

export const getDealershipMonthlySalesById = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/month/salesdata`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
export const postDealershipMonthlySalesById = (id, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/month/salesdata`, {
      method: 'POST',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipMonthlySalesById(id)
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
export const updateDealershipMonthlySalesById = (id, body) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/month/salesdata`, {
      method: 'PUT',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipMonthlySalesById(id)
          resolve(res);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const deleteDealershipMonthlySalesById = (dealershipId, body, id) => {
  return new Promise((resolve, reject) => {
    // API.post(`${URL.dealership}/${id}/salesdata`, body)
    apiCall(`${URL.dealership}/${dealershipId}/month/salesdata`, {
      method: 'DELETE',
      body: body
    })
      .then(async ({ status, data, message }) => {
        if (status === "SUCCESS") {
          const res = await getDealershipMonthlySalesById(dealershipId)
          resolve(res, message);
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getCreditReport = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`${URL.dealership}/${id}/credit/report`)
      .then(({ status, data, message }) => {
        if (status === "SUCCESS") {
          resolve(data[0] || {});
        } else {
          reject(message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
