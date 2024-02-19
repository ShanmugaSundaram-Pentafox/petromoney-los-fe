import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import { getSignedUrl } from '../../../services/common.service';
import { getPDCReportData, } from '../../../services/report.service';
import { dateCustomSort } from '../../../utils/commonFunctions.util';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { createColumnHelper } from '@tanstack/react-table';


const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
}));


const PDCReportTable = ({ filterQry }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const { enqueueSnackbar } = useSnackbar();

  // getting the PDC report details
  const pdcReportQuery = useQuery({
    queryKey: ['pdc-report', filterQry, page, search],
    queryFn: () => getPDCReportData({ filterQry, page, search }),
    onSuccess: (data) => {
      if (data?.report_url) {
        getSignedUrl(data?.report_url)
          .then((res) => {
            window.open(res?.url, '_blank');
          })
          .catch(e => {
            enqueueSnackbar(e, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          })
      }
    }
  })

  // used to handle the download
  const handleDownload = () => {
    setLoading(true)
    getPDCReportData({ filterQry, page, search, download: 'yes' })
      .then((res) => {
        if (res?.data) {
          getSignedUrl(res?.data)
            .then((res) => {
              window.open(res?.url, '_blank');
            })
            .catch(e => {
              enqueueSnackbar(e, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'error',
              });
            })
        } else {
          enqueueSnackbar('No Document found', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        }
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('applicant_type', {
      header: 'Applicant Type',
    }),
    columnHelper.accessor('account_number', {
      header: 'Account Number',
    }),
    columnHelper.accessor('bank_name', {
      header: 'Bank',
    }),
    columnHelper.accessor('ifsc_code', {
      header: 'IFSC Code',
    }),
    columnHelper.accessor('branch_name', {
      header: 'Branch Name',
    }),
    columnHelper.accessor('cheque_number', {
      header: 'Cheque No',
    }),
    columnHelper.accessor('cheque_status', {
      header: 'Cheque Status',
    }),
    columnHelper.accessor('cheque_type', {
      header: 'Cheque Type',
    }),
    columnHelper.accessor('event_date', {
      header: 'Event Data',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }),
    columnHelper.accessor('loan_status', {
      header: 'Loan Status',
    }),
  ];

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => true,
    rowsPerPage: 10,
    filter: false,
    print: false,
    sort: false,
    download: false,
    viewColumns: false,
    searchPlaceholder: 'Search by dealreship ID/Name',
    onSearchChange: (searchText) => {
      setSearch(searchText)
    },
  };

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={pdcReportQuery?.data?.data}
        column={column}
        loading={pdcReportQuery?.isLoading}
        useAPIPagination
        page={page}
        setPage={setPage}
        columnsFilter={false}
        filter={false}
        totalNoOfPages={pdcReportQuery?.data?.no_of_pages}
        apiSearch={setSearch}
        excelDownload
        downloadQuery={{ isLoading: loading, query: handleDownload }}
      />
    </div>
  )
}

export default PDCReportTable;