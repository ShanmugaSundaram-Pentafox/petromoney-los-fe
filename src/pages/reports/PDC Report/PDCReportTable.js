import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import { getSignedUrl } from '../../../services/common.service';
import { getPDCReportData, } from '../../../services/report.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';


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
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'applicant_type',
      header: 'Applicant Type',
    }, {
      key: 'account_number',
      header: 'Account Number',
    }, {
      key: 'bank_name',
      header: 'Bank',
    }, {
      key: 'ifsc_code',
      header: 'IFSC Code',
    }, {
      key: 'branch_name',
      header: 'Branch Name',
    }, {
      key: 'cheque_number',
      header: 'Cheque No',
    }, {
      key: 'cheque_status',
      header: 'Cheque Status',
    }, {
      key: 'cheque_type',
      header: 'Cheque Type',
    }, {
      key: 'event_date',
      header: 'Event Data',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }, {
      key: 'loan_status',
      header: 'Loan Status',
    },
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
        title={'PDC Report'}
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