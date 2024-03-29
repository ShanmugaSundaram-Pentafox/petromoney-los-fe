import clsx from 'clsx';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../../components/Number/Currency';
import { getPageDetails, getRenewalLoanByStatus } from '../../../services/renewal.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import classes from './Renewal.module.css';

const ReviewTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const pageDetailsQuery = useQuery({
    queryKey: ['renewal_rejectedRecordCount', filterQry, search],
    queryFn: () => getPageDetails('rejected', filterQry),
  });

  const getRenewalDataQuery = useQuery({
    queryKey: ['renewal_rejected', filterQry, page, search],
    queryFn: () => getRenewalLoanByStatus('rejected', filterQry, page, search),
  });

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
      header: 'Old Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
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
        rowData={getRenewalDataQuery?.data}
        column={column}
        loading={getRenewalDataQuery?.isLoading}
        title={title}
        onRowClick={i => onRowClick(i?.dealership_id, i, 'rejected')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={pageDetailsQuery?.data?.total_number_of_pages}
        filter={false}
      />
    </div>
  )
}

export default ReviewTable;