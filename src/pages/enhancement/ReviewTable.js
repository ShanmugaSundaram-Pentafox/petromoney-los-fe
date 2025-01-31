import clsx from 'clsx';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import classes from './Enhancement.module.css';
import COLORS from '../../theme/colors';

const ReviewTable = ({ title, onRowClick, filterQry }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data-review', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('review', filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination-review', filterQry],
    queryFn: () => getPageDetails('review', filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: 'enhancement-download-review',
    queryFn: () => downloadEnhancementData('review', filterQry),
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
    retry: Boolean(false)
  })

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}><span style={{color: COLORS.text.blue }}>{value?.getValue()}</span></RouterLink>,
      sorting: true,
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>,
      sorting: true,
    }, {
      key: 'old_product_name',
      header: 'Old Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'old_loan_amount',
      header: 'Old Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'new_loan_amount',
      header: 'New Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    },
  ]
  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        column={column}
        rowData={getEnhancementDataQuery?.data}
        title={title}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'review')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={getEnhancementPaginationQuery?.data?.total_number_of_pages}
        totalNoOfRecords={getEnhancementPaginationQuery?.data?.total_number_of_records}
        filter={false}
        columnsFilter
        loading={getEnhancementDataQuery?.isLoading}
        excelDownload
        downloadQuery={{ query: enhancementDownloadQuery?.refetch, isLoading: enhancementDownloadQuery?.isFetching }}
      />
    </div>
  )
}

export default ReviewTable;