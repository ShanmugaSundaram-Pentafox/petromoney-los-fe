import { URL } from '../config/serverUrls';

//  this function is alternate for apiCall  because its not supporting formData, this is a common function which supports formdata for fileupload.
export const addApplicants = (values, currentUser, apiUrl, rowId) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    fetch(URL.base + apiUrl, {
      method: rowId ? 'PUT' : 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then((res) => res.json())
      .then(({ status, message }) => {
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
