import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { action_id, resources_id } from '../../config/accessControl';
import { rulesList } from '../../config/userRules';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import CheckAllowed from '../../pages/rbac/CheckAllowed';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import Currency from '../Number/Currency';
import { permissionCheck } from '../UserCan/UserCan';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { ActionIcon, Loader, Modal, Paper, Tooltip } from '@mantine/core';


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
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const SubmittedTable = ({ title, loans = [], setLoansData, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loanId, setloanId] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setLoading(true);
    getLoansByStatus('submitted', filterQry)
      .then(data => {
        setLoansData('submitted', data);
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
    columnHelper.accessor('created_date', {
      header: 'Req. Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }),
    columnHelper.accessor('application_state', {
      header: 'Application State',
      cell: (value) => <span>{value?.getValue() || '-'}</span>
    }),
    columnHelper.accessor('action', {
      header: 'Documents',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <CheckAllowed currentUser={currentUser} resource={resources_id?.dashboard} action={action_id?.dashboard?.submitted_documents}>
          <Tooltip label={"eSign Application"} withArrow>
            <ActionIcon size="xs" color="blue" variant="subtle" onClick={() => { setloanId(row?.original?.['id']); setType('application'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); }}>
              <ESignIcon />
            </ActionIcon>
          </Tooltip>
        </CheckAllowed>
      )
    })
  ]

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex !== 7) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'submitted')
      }
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <DataTableViewer
        column={column}
        rowData={loans}
        title={title}
        count={loans?.length}
        excelDownload
        loading={loading}
        onRowClick={(i) => onRowClick(i?.dealership_id, i, 'submitted')}
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
  loans: loans.submitted
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmittedTable);