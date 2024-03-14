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
import DataTableViewer from '../ReactTable/DataTableViewer';
import { ActionIcon, Tooltip } from '@mantine/core';


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
    {
      header: 'Dealership Id',
      key: 'dealership_id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      header: 'Name',
      enableColumnFilter: false,
      key: 'name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      header: 'Type',
      key: 'type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      header: 'Region',
      key: 'region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      header: 'Field Officer',
      key: 'field_officer',
    }, {
      header: 'Req. Amount',
      key: 'amount_requested',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      header: 'Req. Date',
      key: 'created_date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      header: 'Application State',
      key: 'application_state',
      cell: (value) => <span>{value?.getValue() || '-'}</span>
    }, {
      header: 'Documents',
      key: 'action',
      isHeaderDisplay: Boolean(actionable),
      isHeaderDownload: false,
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
    },
  ]

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex !== 8) {
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