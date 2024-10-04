import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { rulesList } from '../../config/userRules';
import { getLoansByStatus } from '../../services/loans.service';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import { permissionCheck } from '../UserCan/UserCan';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import Currency from '../Number/Currency';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { ActionIcon, Tooltip } from '@mantine/core';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
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

const ApprovalReqestTable = ({ title, onRowClick, filterQry, currentUser, chartData }) => {
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);
  const classes = useStyles();

  const getLoanDetailsQuery = useQuery({
    queryKey: ['loan-details-approval', filterQry],
    queryFn: () => getLoansByStatus('loan_approval', filterQry),
  })

  // useEffect(() => {
  //   setLoading(true);
  //   getLoansByStatus('loan_approval', filterQry)
  //     .then(data => {
  //       setLoansData('loan_approval', data);
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
      sorting: true
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>,
      sorting: true
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'city',
      header: 'City',
      cell: (value) => <span style={{textTransform: 'capitalize'}}>{value?.getValue() ? value?.getValue().toLowerCase() : '-'}</span>
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
      sorting: true
    }, {
      key: 'reviewer',
      header: 'Reviewed By',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'approver',
      header: 'Approver',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'action',
      header: 'Document',
      isHeaderDownload: false,
      isHeaderDisplay: Boolean(actionable),
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <Tooltip label="eSign Application" withArrow color='gray'>
            <ActionIcon size="xs" color="blue" variant="subtle" onClick={() => { setloanId(row?.original['id']); setType('application'); setDealershipId(row?.original['dealership_id']); setModalVisible(true); }}>
              <ESignIcon />
            </ActionIcon>
          </Tooltip>
        )
      }
    },
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        allowSorting={true}
        column={column}
        rowData={getLoanDetailsQuery?.data}
        title={title}
        count={getLoanDetailsQuery?.data?.length}
        showStatusTab={chartData}
        onRowClick={(e) => onRowClick(e.dealership_id, e, 'loan_approval')}
        loading={loading}
        excelDownload
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        opened={modalVisible}
        loanId={loanId}
        type={type}
        title={'eSign Application Forms'}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}
      />
    </div>
  )
}

export default ApprovalReqestTable;