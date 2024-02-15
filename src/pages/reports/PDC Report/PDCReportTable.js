import { Button, Tooltip } from '@material-ui/core';
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


const PDCReportTable = ({ filterQry, currentUser }) => {
  const classes = useStyles();
  const [page, setPage] = useState();
  const [search, setSearch] = useState();
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
        if (res?.report_url) {
          getSignedUrl(res?.report_url)
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

  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership Id',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Applicant Type',
        name: 'applicant_type',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Account Number',
        name: 'account_number',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Bank',
        name: 'bank_name',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'IFSC Code',
        name: 'ifsc_code',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Branch Name',
        name: 'branch_name',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Cheque No',
        name: 'cheque_number',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Cheque Status',
        name: 'cheque_status',
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        label: 'Cheque Type',
        name: 'cheque_type',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Event Date',
        name: 'event_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <div>{value ? moment(new Date(value), 'YYYY-MM-DD').format('MMM, YY') : '-'}</div>
          }
        }
      },
      {
        label: 'Loan Status',
        name: 'loan_status',
        option: {
          filter: false,
          sort: false,
        }
      }
    ]
  }, [pdcReportQuery?.data?.data]);

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
    customToolbar: () => {
      return (
        <>
          <Tooltip title="Download">
            <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={() => handleDownload()}></Button>
          </Tooltip>
        </>
      );
    },
    customFooter: () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MuiTableFooter
            totalCount={pdcReportQuery?.data?.no_of_pages}
            pageSize={10}
            onPageChange={(value) => { setPage(value) }}
          />
        </div>
      )
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <MUIDataTable
        title={null}
        data={pdcReportQuery?.data?.data}
        style={classes.tableStyle}
        columns={columns}
        options={options}
      />
      {
        pdcReportQuery?.isLoading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

export default PDCReportTable;