import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';


const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '12px',
    fontWeight: '500',
    minWidth: '30px',
    textAlign: 'center',
  },
}));


const ApprovalTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const getReOnboardingDataQuery = useQuery({
    queryKey: ['re-onboarding-data-approval', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('approval', filterQry, page, search),
  })

  const getReOnboardingPaginationQuery = useQuery({
    queryKey: ['re-onboarding-pagination-approval', filterQry],
    queryFn: () => getPageDetails('approval', filterQry),
  })

  const reOnboardingDownloadQuery = useQuery({
    queryKey: 'reOnboarding-download-approval',
    queryFn: () => downloadEnhancementData('approval', filterQry),
    onSuccess: (data) => {
      getSignedUrl(data[0]?.url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          displayNotification({ message: e, variant: 'error' });
        })
    },
    onError: (e) => {
      displayNotification({ message: e, variant: 'error' })
    },
    enabled: Boolean(false),
    retry: Boolean(false),
  });


  const onDownloadClick = () => {
    downloadEnhancementData('approval', filterQry)
      .then(data => {
        getSignedUrl(data[0]?.url)
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
      })
      .catch(e => console.log('Download error >>>', e))
  }

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'old_product_name',
      header: 'Old Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: value => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'old_loan_amount',
      header: 'Old Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }, {
      key: 'new_loan_amount',
      header: 'New Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
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
  //   // customToolbar: () => {
  //   //   return (
  //   //     <>
  //   //       <Tooltip title="Download">
  //   //         <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={onDownloadClick}></Button>
  //   //       </Tooltip>
  //   //     </>
  //   //   );
  //   // },
  //   customFooter: () => {
  //     return (
  //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  //         <MuiTableFooter
  //           totalCount={getReOnboardingPaginationQuery?.data?.total_number_of_pages}
  //           pageSize={10}
  //           onPageChange={(value) => { setPage(value) }}
  //         />
  //       </div>
  //     )
  //   },
  //   onCellClick: (colData, cellMeta) => {
  //     if (cellMeta.colIndex !== 7) {
  //       onRowClick(getReOnboardingDataQuery?.data[cellMeta.dataIndex].dealership_id, getReOnboardingDataQuery?.data[cellMeta.dataIndex], 'approval')
  //     }
  //   },
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   }
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={getReOnboardingDataQuery?.data}
        column={column}
        title={title}
        count={getReOnboardingDataQuery?.data?.length}
        onRowClick={i => onRowClick(i?.dealership_id, i, 'approval')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={getReOnboardingPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        downloadQuery={{ query: reOnboardingDownloadQuery?.refetch, isLoading: reOnboardingDownloadQuery?.isFetching }}
        excelDownload
      />
    </div>
  )
}

export default ApprovalTable;