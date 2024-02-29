import { Button, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import Currency from '../../../components/Number/Currency';
import { getSignedUrl } from '../../../services/common.service';
import { getDpdPageDetails, getDpdReportData, } from '../../../services/report.service';
import { dateCustomSort } from '../../../utils/commonFunctions.util';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';


const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
}));


const DpdReportTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const columnHelper = createColumnHelper();

  const pageDetailsQuery = useQuery({
    queryKey: ['dpd_pageCount', filterQry, search],
    queryFn: () => getDpdPageDetails(filterQry, search),
  })

  useEffect(() => {
    setLoading(true);
    getDpdReportData(filterQry, page, search, download)
      .then(({ data, report_url }) => {
        setLoans(data);
        if (report_url) {
          getSignedUrl(report_url)
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
        setDownload(false);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry, page, search, download])

  const column = [
    columnHelper.accessor('customer_code', {
      header: 'Customer Code',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('prospect_code', {
      header: 'Prospect Code',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()}</span>
    }),
    columnHelper.accessor('customer_name', {
      header: 'Customer Name',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('region', {
      header: 'Region',
    }),
    columnHelper.accessor('omc', {
      header: 'OMC',
    }),
    columnHelper.accessor('disbursal_date', {
      header: 'Disbursal Data',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }),
    columnHelper.accessor('due_date', {
      header: 'Due Data',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }),
    columnHelper.accessor('loan_amount', {
      header: 'Loan Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('principle_amount', {
      header: 'Principle Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('loan_status', {
      header: 'Loan Status',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('last_receipt_date', {
      header: 'Last Receipt Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }),
    columnHelper.accessor('dpd', {
      header: 'DPD',
      enableColumnFilter: false,
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
    customToolbar: () => {
      return (
        <>
          <Tooltip title="Download">
            <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={() => setDownload(true)}></Button>
          </Tooltip>
        </>
      );
    },
    customFooter: () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MuiTableFooter
            totalCount={pageDetailsQuery?.data}
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
      <DataTableViewer
        rowData={loans}
        column={column}
        styles={{ overflowX: "auto", whiteSpace: "nowrap", maxWidth: "100vw" }}
        title={title}
        loading={loading}
        useAPIPagination
        totalNoOfPages={pageDetailsQuery?.data}
        page={page}
        setPage={setPage}
      />
    </div>
  )
}

export default DpdReportTable;