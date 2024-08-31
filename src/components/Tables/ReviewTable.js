import { makeStyles } from '@material-ui/styles';
import React from 'react';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import DataTableViewer from '../ReactTable/DataTableViewer';
import Currency from '../Number/Currency';
import { NavLink as RouterLink } from 'react-router-dom';
import moment from 'moment';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import COLORS from '../../theme/colors';

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

const ReviewerTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();

  const getLoanDetailsQuery = useQuery({
    queryKey: ['loan-details-review', filterQry],
    queryFn: () => getLoansByStatus('loan_review', filterQry),
  })

  // useEffect(() => {
  //   // if (!loans || !loans?.length) {
  //   setLoading(true);
  //   getLoansByStatus('loan_review', filterQry)
  //     .then(data => {
  //       setLoansData('loan_review', data);
  //       setLoading(false);
  //     })
  //     .catch(e => {
  //       setLoading(false);
  //     })
  //   // }
  // }, [filterQry]);

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}><span style={{color: COLORS.text.blue }}>{value?.getValue()}</span></RouterLink>,
      sorting: true,
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
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'loan_submitted_by',
      header: 'Login By',
      cell: (value) => <span>{value?.getValue() ? value?.getValue() : '-'}</span>
    }, {
      key: 'amount_requested',
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'modified_date',
      header: 'Req. Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>,
      sorting: true,
    }, {
      key: 'reviewer',
      header: 'Reviewer',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    },
  ];

  // const options = {
  //   // filterType: 'checkbox',
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => false,
  //   onRowClick: (rowData, { dataIndex }) => {
  //     onRowClick(loans[dataIndex].dealership_id, loans[dataIndex], 'loan_review')
  //   },
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   }
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        rowData={getLoanDetailsQuery?.data}
        column={column}
        title={title}
        count={getLoanDetailsQuery?.data?.length}
        excelDownload
        loading={getLoanDetailsQuery?.isLoading}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'loan_review')}
      />
    </div>
  )
}

export default ReviewerTable;