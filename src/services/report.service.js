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

export const getDpdPageDetails = (filterQry, page, searchText) => {
  return new Promise((resolve, reject) => {
    const { from, to, entity } = filterQry;
    let qry = [];
    let apiUrl = 'lms/reports/record_count/dpd';
    if (entity) qry.push(`entity_id=${entity}`);
    if (page) qry.push(`page=${page}`);
    if (searchText) qry.push(`customer_id_name=${searchText}`);
    if (from && to) qry.push(`from=${from}&to=${to}`);
    if (page) qry.push(`page=${page}`);
    if (searchText) qry.push(`customer_id_name=${searchText}`);
    if (qry.length) apiUrl += '?' + qry.join('&');
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
      });
  });
}

export const getPDCReportData = ({ filterQry = {}, download, page, searchText }) => {
  return new Promise((resolve, reject) => {
    let qry = []
    let apiUrl = 'pdc/report';
    if (filterQry?.zone && filterQry?.zone !== '0') qry.push(`zone_id=${filterQry?.zone}`)
    if (filterQry?.region && filterQry?.region !== '0') qry.push(`region_id=${filterQry?.region}`)
    if (filterQry?.products && filterQry?.products !== '0') qry.push(`product_id=${filterQry?.products}`)
    if (filterQry?.from && filterQry?.to) qry.push(`from_date=${filterQry?.from}&to_date=${filterQry?.to}`)
    if (download) qry.push('download_csv=yes')
    if (qry.length) apiUrl += '?' + qry.join('&')
    apiCall(apiUrl)
      .then((res) => {
        if (res?.status.toUpperCase() === 'SUCCESS') {
          resolve(res);
        } else {
          reject(res?.message);
        }
      })
      .catch(e => {
        reject(e.message);
      })
  });
}
