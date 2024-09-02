import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { getLoansByStatus } from '../../services/loans.service';
import Currency from '../Number/Currency';
import DataTableViewer from '../ReactTable/DataTableViewer';
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
  },
  sidePanelWrapper: {
    width: '60vw',
    maxWidth: '80vw'
  }
}));

const DisbursementApprovedTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();

  const getLoanDetailsQuery = useQuery({
    queryKey: ['loan-details-disb-approved', filterQry],
    queryFn: () => getLoansByStatus('disbursement_approved', filterQry),
  })

  // useEffect(() => {
  //   setLoading(true);
  //   getLoansByStatus('disbursement_approved', filterQry)
  //     .then(data => {
  //       setLoansData('disbursement_approved', data);
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
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'loan_disbursement_approved_rejected_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>,
      sorting: true,
    },
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        rowData={getLoanDetailsQuery?.data}
        column={column}
        title={title}
        count={getLoanDetailsQuery?.data?.length}
        excelDownload
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'disbursement_approved')}
        loading={getLoanDetailsQuery?.isLoading}
      />
    </div>
  )
}

export default DisbursementApprovedTable;