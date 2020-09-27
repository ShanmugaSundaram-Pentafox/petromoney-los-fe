import { API } from "../config/api";
import { URL } from "../config/serverUrls";

export const getAllDealership = () => {
  return new Promise((resolve, reject) => {
    API.get(URL.dealership)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipById = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data[0]);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipLoansById = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}/loans`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipIncomeById = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}/income/details`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipIncomeById = (id, body) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.dealership}/${id}/income/details`, body)
      .then(async ({ data }) => {
        if (data.status === "SUCCESS") {
          const res = await getDealershipIncomeById(id);
          resolve(res);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipExpensesById = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}/expense/details`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipExpensesById = (id, body) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.dealership}/${id}/expense/details`, body)
      .then(async ({ data }) => {
        if (data.status === "SUCCESS") {
          const res = await getDealershipExpensesById(id)
          resolve(res);
        } else {
          reject(data.message);
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
    API.get(`${URL.dealership}/${id}/salesdata`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipSalesById = (id, body) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.dealership}/${id}/salesdata`, body)
      .then(async ({ data }) => {
        if (data.status === "SUCCESS") {
          const res = await getDealershipSalesById(id)
          resolve(res);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipCheckList = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.checklist}/${id}`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const uploadDocument = (dealershipID, docID, files) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.checklist}/${dealershipID}/doc/${docID}`, files)
      .then(({ data }) => {
          resolve(data);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const getDealershipFinancialsById = (id) => {
  return new Promise((resolve, reject) => {
    API.get(`${URL.dealership}/${id}/financials`)
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export const postDealershipFinancialsById = (id, body) => {
  return new Promise((resolve, reject) => {
    API.post(`${URL.dealership}/${id}/financials`, body)
      .then(async ({ data }) => {
        if (data.status === "SUCCESS") {
          const res = await getDealershipFinancialsById(id);
          resolve(res);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};
