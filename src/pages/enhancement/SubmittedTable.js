import clsx from 'clsx';
import React, { useState, } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import classes from './Enhancement.module.css';

const SubmittedTable = ({ title, onRowClick, filterQry }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data-submit', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('submit', filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination-submit', filterQry],
    queryFn: () => getPageDetails('submit', filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: 'enhancement-download-submit',
    queryFn: () => downloadEnhancementData('submit', filterQry),
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
  })

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>,
      sorting: true,
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()}</span>,
      sorting: true,     
    }, {
      key: 'new_product_name',
      header: 'Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'new_loan_amount',
      header: 'Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    },
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        rowData={getEnhancementDataQuery?.data}
        column={column}
        title={title}
        count={getEnhancementDataQuery?.data?.length}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'submit')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={getEnhancementPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        columnsFilter={false}
        loading={getEnhancementDataQuery?.isLoading}
        excelDownload
        downloadQuery={{ query: enhancementDownloadQuery?.refetch, isLoading: enhancementDownloadQuery?.isFetching }}
      />
    </div>
  )
}

export default SubmittedTable;