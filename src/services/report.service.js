import apiCall from '../utils/api.util';


export const getDpdReportData = (filterQry, page, searchText, download) => {
  return new Promise((resolve, reject) => {
    const { from, to, entity } = filterQry;
    let qry = []
    let apiUrl = 'lms/reports/dpd';
    if (entity) qry.push(`entity_id=${entity}`)
    if (page) qry.push(`page=${page}`)
    if (searchText) qry.push(`customer_id_name=${searchText}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (download) qry.push('download_csv=yes')
    if (qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
      .then(({ status, data, report_url, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve({ data, report_url });
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}

export const getDpdPageDetails = (filterQry,page, searchText) => {
  return new Promise((resolve, reject) => {
    const { from, to, entity } = filterQry;
    let qry = []
    let apiUrl = 'lms/reports/record_count/dpd';
    if (entity) qry.push(`entity_id=${entity}`)
    if (page) qry.push(`page=${page}`)
    if (searchText) qry.push(`customer_id_name=${searchText}`)
    if (from && to) qry.push(`from=${from}&to=${to}`)
    if (qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
      .then(({ status, total_number_of_pages, message }) => {
        if (status.toUpperCase() === 'SUCCESS') {
          resolve(total_number_of_pages);
        } else {
          reject(message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}