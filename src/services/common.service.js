// import { API } from "../config/api"
// import { URL } from "../config/serverUrls"
// import { store } from "../store";
import apiCall from "../utils/api.util";

export const getBusinessTypes = () => {
  return new Promise((resolve, reject) => {
    apiCall("business/types")
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const getOmcList = () => {
  return new Promise((resolve, reject) => {
    apiCall("omcs")
      .then(({ status, data, message }) => {
        if(status === "SUCCESS") {
          resolve(data);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const getExperianReportById = (id, type) => {
  return new Promise((resolve, reject) => {
    apiCall(`experian/report/${id}/${type}`)
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

export const refreshExperianReportById = (id, type) => {
  // const currentUser = store.getState().user.currentUser;
  return new Promise((resolve, reject) => {
    /**
     * , {
      headers: {
        'Authorization': `Bearer ${currentUser.token}`
      }
    }
     */
    apiCall(`refresh/experian/report/consumer/${id}`)
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

export const downloadPDF = ({ file, isBase64, name }) => {
  const linkSource = isBase64 ? `data:application/pdf;base64,${file}` : file;
  const downloadLink = document.createElement("a");
  const fileName = `${name}.pdf`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
export const getAllRegion = () => {
  return new Promise((resolve, reject) => {
    apiCall(`regions`)
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
export const getMappedRegion = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/map/region`)
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
export const updateMappedRegion = (data, id) => {

  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/map/region`, {
      method: 'POST',
      body: {
        "regions": data
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
export const deleteMappedRegion = (data, id) => {
  console.log(data, "data while deleting");
  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/map/region`, {
      method: 'DELETE',
      body: {
        "regions": data
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
export const updatePassword = (password, mobile, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/update`, {
      method: 'POST',
      body: {
        mobile,
        password
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
export const updateUserDetails = (name, mail, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/update`, {
      method: 'POST',
      body: {
        "name": name,
        "email": mail
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
export const SendReports = () => {
  return new Promise((resolve, reject) => {
    apiCall(`loan/report/1`, {
      method: 'POST',
    })
      .then(({ status, message }) => {

        if (status === "SUCCESS") {   
        console.log(status,"status")
        console.log(message,"status")
          resolve({status,message});
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
export const getPassbookDetails = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`passbook/dealership/${id}`)
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