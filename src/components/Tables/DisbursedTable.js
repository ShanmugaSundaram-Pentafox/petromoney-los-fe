import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import Currency from '../Number/Currency';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { createColumnHelper } from '@tanstack/table-core';

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

const DisbursedTable = ({ title, loans, setLoansData, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setLoading(true);
    getLoansByStatus('disbursed', filterQry)
      .then(data => {
        setLoansData('disbursed', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value.getValue()}`}>{value.getValue()}</RouterLink>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('applicant_code', {
      header: 'Customer Code',
      enableColumnFilter: false,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (value) => <span>{value.getValue()?.toUpperCase()}</span>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.row?.original?.type}`])}>{value.getValue()}</span>,
    }),
    columnHelper.accessor('region', {
      header: 'Region',
      cell: (value) => <>{value.getValue() ? value.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>,
    }),
    columnHelper.accessor('field_officer', {
      header: 'Field Officer',
    }),
    columnHelper.accessor('amount_approved', {
      header: 'Sanction Amount',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('loan_approved_rejected_date', {
      header: 'Sanction Date',
      cell: (value) => <div>{value.getValue() ? moment(new Date(value.getValue())).format('DD-MM-YYYY') : '-'}</div>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('amount_disbursed', {
      header: 'Disbursed Amount',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('loan_disbursed_date', {
      header: 'Disbursed Date',
      cell: (value) => <div>{value.getValue() ? moment(new Date(value.getValue())).format('DD-MM-YYYY') : '-'}</div>,
      enableColumnFilter: false,
    }),
  ];

  return (
    <div className={classes.root}>
      <DataTableViewer
        column={column}
        rowData={loans || []}
        title={title}
        count={loans?.length}
        excelDownload={true}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'disbursed')}
        loading={loading}
      />
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.disbursed
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DisbursedTable);