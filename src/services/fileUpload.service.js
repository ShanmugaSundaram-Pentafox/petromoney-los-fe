import { URL } from '../config/serverUrls';

export const addApplicants = (values, dealershipId, currentUser,rowId ) => {
  return new Promise((resolve, reject) => {
    let url = `applicant/${dealershipId}`;
    if (rowId) {
      url += `/${rowId}`;
    }
    
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
  
    fetch(URL.base+url, {
      method: rowId ? 'PUT' : 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then((res) => res.json())
      .then(({status, message}) => {
        if (status === 'SUCCESS') {
          resolve(message)
        } else {
          reject(message)
        }
      })
      .catch((err) => {
        reject(err)
      });
  })
}
