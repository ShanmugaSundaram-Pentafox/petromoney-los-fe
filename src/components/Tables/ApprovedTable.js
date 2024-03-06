import { List } from '@material-ui/icons';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import DocCheckListDetailsTable from '../Attachment/DocCheckListDetailsTable';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import Currency from '../Number/Currency';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { ActionIcon, Popover, Text, Tooltip } from '@mantine/core';
import { permissionCheck } from '../UserCan/UserCan';
import { rulesList } from '../../config/userRules';

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
  itemLists: {
    // padding: '10px',
    display: 'flex',
    gap: '6px',
    flexDirection: 'column',
  },
  listItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: '#f7f7f7',
    },
    height: '22px',
  },
  listIcon: {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
  }
}));

const ApprovedTable = ({ title, loans, setLoansData, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loanAmount, setLoanAmount] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [productTypeId, setProductTypeId] = useState();
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  useEffect(() => {
    setLoading(true);
    getLoansByStatus('approved', filterQry)
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])

  const getLoansTable = () => {
    setLoading(true);
    getLoansByStatus('approved')
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value.getValue()} />
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      key: 'approver',
      header: 'Approved By',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'action',
      header: 'Attachment',
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <Popover shadow='xl' withArrow position='top-end'>
            <Popover.Target>
              <Tooltip label={"click to view documents checklist"}>
                <ActionIcon variant={'subtle'} color={'gray'} size={'xs'} mt={4}><LinkIcon /></ActionIcon>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <DocCheckListDetailsTable title={row?.original} />
            </Popover.Dropdown>
          </Popover>
        )
      }
    }, {
      key: 'action',
      header: 'Documents',
      isHeaderDownload: false,
      isHeaderDisplay: Boolean(actionable),
      enableColumnFilter: false,
      cell: ({ row }) => (
        <>
          <Popover
            withArrow
            position='left-start'
            shadow="lg"
          >
            <Popover.Target>
              <Tooltip label={'Click to view documents'} withArrow color='gray' offset={10}>
                <span>
                  <ActionIcon size="xs" variant='subtle' color={'blue'} mt={4}><List /></ActionIcon>
                </span>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <div className={classes.itemLists}>
                <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['id']); setDealershipId(row?.original?.dealership_id); setType('sanction'); setModalVisible(true); }}>
                  <div className={classes.listIcon}>
                    <DescriptionIcon style={{ width: 19, color: 'blue' }} />
                  </div>
                  <Text>Sanction Letter</Text>
                </div>
                <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['id']); setDealershipId(row?.original?.dealership_id); setType('agreement'); setModalVisible(true); setLoanAmount(row?.original?.['amount_approved']); setProductTypeId(row?.original?.['product_id']) }}>
                  <div className={classes.listIcon} >
                    <LoanAgreementIcon width={12} style={{ color: 'blue' }} />
                  </div>
                  <Text>Loan Agreement</Text>
                </div>
                <div className={classes.listItem} style={{ padding: '3px 0' }} onClick={() => { setloanId(row?.original?.['id']); setType('application'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); }}>
                  <div className={classes.listIcon} style={{ marginLeft: '2px', width: '18px' }}>
                    <ESignIcon width={17} style={{ color: 'blue' }} />
                  </div>
                  <Text>eSign Application</Text>
                </div>
                <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['id']); setType('loc'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); setLoanAmount(row?.original?.['amount_approved']); }}>
                  <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                    <AssignmentIcon style={{ width: 19, color: 'blue' }} />
                  </div>
                  <Text>Letter Of Continuity</Text>
                </div>
              </div>
            </Popover.Dropdown>
          </Popover>

        </>
      )
    },
  ];

  return (
    <div>
      <DataTableViewer
        column={column}
        rowData={loans}
        excelDownload={true}
        title={title}
        count={loans?.length}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'approved')}
        loading={loading}
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        loanId={loanId}
        loanAmount={loanAmount}
        opened={modalVisible}
        productId={productTypeId}
        type={type}
        title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter of Continuity' : 'Sanction Letter'}
        onClose={() => setModalVisible(false)}
        callback={getLoansTable}
        currentUser={currentUser}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.approved
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovedTable);