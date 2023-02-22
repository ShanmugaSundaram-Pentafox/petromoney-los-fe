import { URL } from '../config/serverUrls';


export const fileUpload = (values, apiUrl, currentUser ) => {

  console.log('values >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', apiUrl)
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });

  fetch(URL.base+apiUrl, {
    method: values?.id ? 'PUT' : 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
    },
  })
    // .then((res) => {
    //   return res.json();
    // })
    .then((res) => {
      if (res.status === 'SUCCESS') {
        console.log('response success >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', res)
        // enqueueSnackbar(res.message, {
        //   anchorOrigin: {
        //     vertical: 'top',
        //     horizontal: 'right',
        //   },
        //   variant: 'success',
        // });
        // queryClient.invalidateQueries(['applicant', id])
      } else {
        console.log('response error >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', res)
        // enqueueSnackbar(res.message, {
        //   anchorOrigin: {
        //     vertical: 'top',
        //     horizontal: 'right',
        //   },
        //   variant: 'error',
        // });
      }
    })
    .catch((err) => {
      console.log('error >>>>>>>>>>>>>>>>>>>>>>>>', err)
      // enqueueSnackbar(err.message, {
      //   anchorOrigin: {
      //     vertical: 'top',
      //     horizontal: 'right',
      //   },
      //   variant: 'error',
      // });
    });
}

export const addApplicants = (date_values,dealershipId, category, currentUser ) => {
  let obj = {};
  let values= date_values;
  console.log('d >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', values)
  console.log('dealershipID >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', dealershipId)
  console.log('cateory >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', category)
  console.log('curentuser >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', currentUser)

  // if (values.id) {
  //   obj = compareObject(data, date_values)
  // }
  // else {
  //   obj = { ...date_values }
  // }
  const apiURL = 'applicant'
  let url = `${apiURL}/${dealershipId}`;
  if (values?.id) {
    url += `/${values.id}`;
  }
  console.log(url, '-=-=-=-==-=-=--=--=-===-=--=>>>>');
  // values.first_name = values?.first_name.toUpperCase();
  // values.last_name = values?.last_name.toUpperCase();
  // values.father_name = values?.father_name.toUpperCase();

  const d = fileUpload(values, url, currentUser)
  // if (modelType !== 'GUARANTOR') {
  //   formData.append('user_id', currentUser.id);
  // }
  // if (modelType) {
  //   formData.append('category', modelType)
  // }

}