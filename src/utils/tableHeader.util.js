import { createColumnHelper } from '@tanstack/react-table';
const React = require('react');

// used to create a react table column
const columnHelper = createColumnHelper();

// used to render the data
const Cell = (value) => <span>{value?.getValue()}</span>

/**
 * this function is used to generate the header for table.
 *
 * @param {array} data - Headers of table in array of object format.
 */
export const generateTableHeader = ({ data }) => {
  return data?.filter((i) => i?.isHeaderDisplay != false)?.map((item, index) => {
    return columnHelper.accessor(item?.key, {
      header: item?.header,
      cell: item?.cell ? item?.cell : Cell,
      enableColumnFilter: item?.enableColumnFilter || item?.key !== 'action' ? true : false,
      key: `${index}-${item?.header}`,
    });
  });
};

/**
 * this function is used to generate the csv headers to download.
 *
 * @param {array} data - Headers of table in array of object format.
 */
export const generateCSVHeader = ({ data }) => {
  const column = {};
  data?.filter((i) => i?.isHeaderDownload != false)?.forEach((item) => {
    column[item?.key] = item?.header;
  });
  return column;
};