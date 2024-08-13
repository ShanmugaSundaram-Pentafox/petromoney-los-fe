import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import Currency from '../Number/Currency';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { useQuery } from 'react-query';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
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
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  }
}));

const RejectedTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();

  const getLoanDetailsQuery = useQuery({
    queryKey: ['loan-details-reject', filterQry],
    queryFn: () => getLoansByStatus('rejected', filterQry),
  })

  // useEffect(() => {
  //   setLoading(true);
  //   getLoansByStatus('rejected', filterQry)
  //     .then(data => {
  //       setLoansData('rejected', data);
  //       setLoading(false);
  //     })
  //     .catch(e => {
  //       setLoading(false);
  //     })
  // }, [filterQry])

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>,
      sorting: true
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>,
      sorting: true,
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <>{value.getValue() ? value.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>,
    }, {
      key: 'loan_submitted_by',
      header: 'Login By',
      cell: (value) => <span>{value?.getValue() ? value?.getValue() : '-'}</span>
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>,
      sorting: true
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Rejected Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>,
      sorting: true
    },
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        column={column}
        rowData={getLoanDetailsQuery?.data || []}
        title={title}
        count={getLoanDetailsQuery?.data?.length}
        excelDownload={true}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'rejected')}
        loading={getLoanDetailsQuery?.isLoading}
      />
    </div>
  )
}

export default RejectedTable;