// import { API } from "../config/api"
import { URL } from '../config/serverUrls'
// import { store } from "../store";
import apiCall from '../utils/api.util';

export const getBusinessTypes = () => {
  return new Promise((resolve, reject) => {
    apiCall('business/types')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
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
    apiCall('omcs')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
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

export const downloadPDF = ({ file, isBase64, name }) => {
  const linkSource = isBase64 ? `data:application/pdf;base64,${file}` : file;
  const downloadLink = document.createElement('a');
  const fileName = `${name}.pdf`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

export const getAllRegions = () => {
  return new Promise((resolve, reject) => {
    apiCall('regions', {}, 'GET')
      .then(response => {
        if (response?.status === 'SUCCESS') {
          const result = response?.data.map(item => ({
            label: item.region,
            value: item.id,
          }))
          resolve(result || [])
        } else {
          reject(new Error(response.message || 'Unable to get regions'))
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const getAllRegion = () => {
  return new Promise((resolve, reject) => {
    apiCall(URL.region)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);

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
export const updateMappedRegion = (data, id) => {

  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/map/region`, {
      method: 'POST',
      body: {
        'regions': data
      }
    })
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
export const deleteMappedRegion = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${id}/map/region`, {
      method: 'DELETE',
      body: {
        'regions': data
      }
    })
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
export const updatePassword = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`user/${id}`, {
      method: 'POST',
      body: {
        password: data.password
      }
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
export const updateUserDetails = (data, id) => {

  return new Promise((resolve, reject) => {
    apiCall(`user/${id}`, {
      method: 'POST',
      body: data

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
export const SendReports = () => {
  return new Promise((resolve, reject) => {
    apiCall('loan/report/1', {
      method: 'POST',
    })
      .then(({ status, message }) => {

        if (status === 'SUCCESS') {
          console.log(status, 'status')
          console.log(message, 'status')
          resolve({ status, message });
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
export const getStates = () => {
  return new Promise((resolve, reject) => {
    apiCall('master/states')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const getAssetType = () => {
  return new Promise((resolve, reject) => {
    apiCall('asset')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const getActiveStates = () => {
  return new Promise((resolve, reject) => {
    apiCall('states')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}
export const getMenuItemsCount = () => {
  return new Promise((resolve, reject) => {
    apiCall('count')
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || {});
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}
// export const getMasterRegionById = (res) => {
//   return new Promise((resolve, reject) => {
//     apiCall(`master/regions/${res}`)
//       .then(({ status, data, message }) => {
//         if (status === "SUCCESS") {
//           resolve(data);
//         } else {
//           reject(message);
//         }
//       })
//       .catch(err => {
//         reject(err.message);
//       })
//   })
// }

export const getRegionById = (res) => {
  return new Promise((resolve, reject) => {
    apiCall(`states/regions/${res}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
          resolve(data || []);
        } else {
          reject(message);
        }
      })
      .catch(err => {
        reject(err.message);
      })
  })
}

export const updateOmcsById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`omcs/${id}`, {
      method: 'POST',
      body: data,
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

export const updateRegionById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`master/regions/${id}`, {
      method: 'POST',
      body: data,
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

export const updateStateById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`master/states/${id}`, {
      method: 'POST',
      body: data,
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

export const updateAssetById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`asset/${id}`, {
      method: 'POST',
      body: data,
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

export const updateBusinessById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`business/types/${id}`, {
      method: 'POST',
      body: data,
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

export const updateLoanById = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`loan/types/${id}`, {
      method: 'POST',
      body: data,
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

export const addOmcs = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('omcs', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const addRegion = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('regions', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

}
export const addState = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('master/states', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const addBusinessType = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('business/types', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const addLoanType = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('loan/types', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const addAssetType = (data) => {
  return new Promise((resolve, reject) => {
    apiCall('asset', {
      method: 'POST',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const deleteOmcs = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`omcs/${id}`, {
      method: 'DELETE',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const deleteRegion = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`master/regions/${id}`, {
      method: 'DELETE',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

}
export const deleteState = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`master/states/${id}`, {
      method: 'DELETE',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}
export const deleteAsset = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`asset/${id}`, {
      method: 'DELETE',
      body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}
export const deleteBusiness = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`business/types/${id}`, {
      method: 'DELETE',
      // body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}
export const deleteLoan = (data, id) => {
  return new Promise((resolve, reject) => {
    apiCall(`loan/types/${id}`, {
      method: 'DELETE',
      // body: data
    })
      .then(({ status, message }) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}

export const getDealershipForSearch = (id) => {
  return new Promise((resolve, reject) => {
    apiCall(`dealership/search?status=disbursed&dealership=${id}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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

export const getLoanTypes = () => {
  return new Promise((resolve, reject) => {
    apiCall('loan/types')
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

export const getUserRoleForReview = (status) => {
  return new Promise((resolve, reject) => {
    apiCall(`users?${status}`)
      .then(({ status, data, message }) => {
        if (status === 'SUCCESS') {
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