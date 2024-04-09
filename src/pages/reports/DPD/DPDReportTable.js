
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../../components/Number/Currency';
import { getSignedUrl } from '../../../services/common.service';
import { getDpdPageDetails, getDpdReportData, } from '../../../services/report.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';


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


const DpdReportTable = ({ title, filterQry }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const pageDetailsQuery = useQuery({
    queryKey: ['dpd_pageCount', filterQry, search],
    queryFn: () => getDpdPageDetails(filterQry, search),
  })

  const dpdReportDetails = useQuery({
    queryKey: ['dpd_details', filterQry, page, search],
    queryFn: () => getDpdReportData(filterQry, page, search),
  })

  const handleDownload = () => {
    setIsLoading(true);
    getDpdReportData(filterQry, page, search, true)
      .then(({ data, report_url }) => {
        if (report_url) {
          getSignedUrl(report_url)
            .then((res) => {
              window.open(res?.url, '_blank');
            })
            .catch(e => {
              displayNotification({
                message: e,
                variant: 'error',
              })
            })
        }
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      })
  }

  const column = [
    {
      key: 'customer_code',
      header: 'Customer Code',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'prospect_code',
      header: 'Prospect Code',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'customer_name',
      header: 'Customer Name',
      enableColumnFilter: false,
    }, {
      key: 'region',
      header: 'Region',
    }, {
      key: 'omc',
      header: 'OMC',
    }, {
      key: 'disbursal_date',
      header: 'Disbursal Data',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }, {
      key: 'due_date',
      header: 'Due Data',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }, {
      key: 'loan_amount',
      header: 'Loan Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'principle_amount',
      header: 'Principle Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'loan_status',
      header: 'Loan Status',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'last_receipt_date',
      header: 'Last Receipt Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }, {
      key: 'dpd',
      header: 'DPD',
      enableColumnFilter: false,
    },
  ];

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => true,
  //   rowsPerPage: 10,
  //   filter: false,
  //   print: false,
  //   sort: false,
  //   download: false,
  //   viewColumns: false,
  //   searchPlaceholder: 'Search by dealreship ID/Name',
  //   onSearchChange: (searchText) => {
  //     setSearch(searchText)
  //   },
  //   customToolbar: () => {
  //     return (
  //       <>
  //         <Tooltip title="Download">
  //           <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={() => setDownload(true)}></Button>
  //         </Tooltip>
  //       </>
  //     );
  //   },
  //   customFooter: () => {
  //     return (
  //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  //         <MuiTableFooter
  //           totalCount={pageDetailsQuery?.data}
  //           pageSize={10}
  //           onPageChange={(value) => { setPage(value) }}
  //         />
  //       </div>
  //     )
  //   },
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   }
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={dpdReportDetails?.data?.data}
        column={column}
        styles={{ overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100vw' }}
        title={title}
        loading={dpdReportDetails?.isLoading}
        useAPIPagination
        apiSearch={setSearch}
        totalNoOfPages={pageDetailsQuery?.data}
        page={page}
        setPage={setPage}
        excelDownload
        downloadQuery={{ query: () => handleDownload(), isLoading: isLoading }}
      />
    </div>
  )
}

export default DpdReportTable;