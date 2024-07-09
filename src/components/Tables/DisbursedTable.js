import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { getLoansByStatus } from '../../services/loans.service';
import Currency from '../Number/Currency';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { useQuery } from 'react-query';

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
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  }
}));

const DisbursedTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();

  const getLoanDetailsQuery = useQuery({
    queryKey: ['loan-details-disb', filterQry],
    queryFn: () => getLoansByStatus('disbursed', filterQry),
  })

  // useEffect(() => {
  //   setLoading(true);
  //   getLoansByStatus('disbursed', filterQry)
  //     .then(data => {
  //       setLoansData('disbursed', data);
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
      cell: (value) => <RouterLink to={`/dealership/${value.getValue()}`}>{value.getValue()}</RouterLink>,
      enableColumnFilter: false,
      sorting: true,
    }, {
      key: 'applicant_code',
      header: 'Customer Code',
      enableColumnFilter: false,
    }, {
      key: 'name',
      header: 'Name',
      cell: (value) => <span>{value.getValue()?.toUpperCase()}</span>,
      enableColumnFilter: false,
      sorting: true,
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.row?.original?.type}`])}>{value.getValue()}</span>,
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <>{value.getValue() ? value.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>,
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Sanction Amount',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Sanction Date',
      cell: (value) => <div>{value.getValue() ? moment(new Date(value.getValue())).format('DD-MM-YYYY') : '-'}</div>,
      enableColumnFilter: false,
      sorting: true,
    }, {
      key: 'amount_disbursed',
      header: 'Disbursed Amount',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }, {
      key: 'actual_amount_disbursed',
      header: 'Actual Disbursed',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }, {
      key: 'loan_disbursed_date',
      header: 'Disbursed Date',
      cell: (value) => <div>{value.getValue() ? moment(new Date(value.getValue())).format('DD-MM-YYYY') : '-'}</div>,
      enableColumnFilter: false,
      sorting: true,
    },
  ];

  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        column={column}
        rowData={getLoanDetailsQuery?.data || []}
        title={title}
        count={getLoanDetailsQuery?.data?.length}
        excelDownload={true}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'disbursed')}
        loading={getLoanDetailsQuery?.isLoading}
      />
    </div>
  )
}

export default DisbursedTable;