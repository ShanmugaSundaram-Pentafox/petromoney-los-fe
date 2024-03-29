import clsx from 'clsx';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import classes from './Enhancement.module.css'

const ApprovalTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data-approval', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('approval', filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination-approval', filterQry],
    queryFn: () => getPageDetails('approval', filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: 'enhancement-download-approval',
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
  })

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
        rowData={getEnhancementDataQuery?.data}
        column={column}
        onRowClick={i => onRowClick(i.dealership_id, i, 'approval')}
        title={title}
        count={getEnhancementDataQuery?.data?.length}
        apiSearch={setSearch}
        useAPIPagination
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

export default ApprovalTable;