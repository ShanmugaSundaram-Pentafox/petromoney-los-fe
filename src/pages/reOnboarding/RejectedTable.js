import { Button, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../components/CommonComponents/MuiTableFooter';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { createColumnHelper } from '@tanstack/react-table';
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


const RejectedTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const columnHelper = createColumnHelper();

  const getReOnboardingDataQuery = useQuery({
    queryKey: ['re-onboarding-data-rejected', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('rejected', filterQry, page, search),
  })

  const getReOnboardingPaginationQuery = useQuery({
    queryKey: ['re-onboarding-pagination-rejected', filterQry],
    queryFn: () => getPageDetails('rejected', filterQry),
  })

  const reOnboardingDownloadQuery = useQuery({
    queryKey: 'reOnboarding-download-rejected',
    queryFn: () => downloadEnhancementData('rejected', filterQry),
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
    downloadEnhancementData('rejected', filterQry)
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

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('dealership_name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('old_product_name', {
      header: 'Old Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('new_product_name', {
      header: 'New Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
      cell: value => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }),
    columnHelper.accessor('old_loan_amount', {
      header: 'Old Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('new_loan_amount', {
      header: 'New Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }),
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
  //       onRowClick(getReOnboardingDataQuery?.data[cellMeta.dataIndex].dealership_id, getReOnboardingDataQuery?.data[cellMeta.dataIndex], 'rejected')
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
        title={`${title} (${getReOnboardingDataQuery?.data?.length})`}
        onRowClick={i => onRowClick(i?.dealership_id, i, 'rejected')}
        useAPIPagination
        page={page}
        setPage={setPage}
        loading={getReOnboardingDataQuery?.isLoading}
        totalNoOfPages={getReOnboardingPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        downloadQuery={{ query: reOnboardingDownloadQuery?.refetch, isLoading: reOnboardingDownloadQuery?.isFetching }}
        excelDownload
      />
    </div>
  )
}

export default RejectedTable;