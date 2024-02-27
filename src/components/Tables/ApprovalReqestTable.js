import { Dialog, IconButton, Paper, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { rulesList } from '../../config/userRules';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import Currency from '../Number/Currency';
import { permissionCheck } from '../UserCan/UserCan';
import { createColumnHelper } from '@tanstack/table-core';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { ActionIcon, Loader } from '@mantine/core';

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

const ApprovalReqestTable = ({ title, loans, setLoansData, onRowClick, filterQry, currentUser }) => {
  const columnHelper = createColumnHelper();
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  const classes = useStyles();
  useEffect(() => {
    setLoading(true);
    getLoansByStatus('loan_approval', filterQry)
      .then(data => {
        setLoansData('loan_approval', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }),
    columnHelper.accessor('field_officer', {
      header: 'Field Officer',
    }),
    columnHelper.accessor('amount_requested', {
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('modified_date', {
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }),
    columnHelper.accessor('reviewer', {
      header: 'Reviewed By',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('approver', {
      header: 'Approver',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('action', {
      header: 'Document',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Tooltip title="eSign Application">
          <ActionIcon size="xs" color="blue" variant="subtle" onClick={() => { setloanId(row?.['id']); setType('application'); setDealershipId(row?.dealership_id); setModalVisible(true); }}>
            <ESignIcon />
          </ActionIcon>
        </Tooltip>
      )
    }),
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        column={column}
        rowData={loans}
        title={title}
        count={loans?.length}
        onRowClick={(e) => onRowClick(e.dealership_id, e, 'loan_approval')}
        loading={loading}
        excelDownload
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        opened={modalVisible}
        loanId={loanId}
        type={type}
        title={'eSign Application Form'}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.loan_approval
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalReqestTable);