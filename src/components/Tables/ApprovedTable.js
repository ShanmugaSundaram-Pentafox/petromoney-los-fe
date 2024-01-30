import { Dialog, Popover } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { List } from '@material-ui/icons';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import { rulesList } from '../../config/userRules';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import DocCheckListDetailsTable from '../Attachment/DocCheckListDetailsTable';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import Currency from '../Number/Currency';
import { permissionCheck } from '../UserCan/UserCan';
import { createColumnHelper } from '@tanstack/table-core';
import DataTableViewer from '../ReactTable/DataTableViewer';

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
    padding: '10px',
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
  const columnHelper = createColumnHelper();
  const [loanAmount, setLoanAmount] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [productTypeId, setProductTypeId] = useState();
  const [rowData, setRowData] = useState();
  const [anchorEl, setAnchorEl] = React.useState({});
  const open = Boolean(anchorEl?.attachments);
  const id = open ? 'simple-popover' : undefined;
  const documentPopover = Boolean(anchorEl?.document);
  const documentId = documentPopover ? 'document-popover' : undefined;

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

  const handleClose = () => {
    setAnchorEl({});
  };

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
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }),
    columnHelper.accessor('field_officer', {
      header: 'Field Officer',
    }),
    columnHelper.accessor('approved_amount', {
      header: 'Approved Amount',
      cell: (value) => <Currency value={value.getValue()} />
    }),
    columnHelper.accessor('loan_approved_rejected_date', {
      header: 'Approved Date',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }),
    columnHelper.accessor('approver', {
      header: 'Approved By',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('action', {
      header: 'Attachment',
      cell: ({ row }) => {
        console.log(row?.original?.dealership_id)
        return (
          <span>
            <Tooltip title="click to view documents checklist">
              <LinkIcon style={{ color: 'grey' }} onClick={(event) => {
                setAnchorEl({ attachments: event.currentTarget });
                setRowData(row?.original);
              }} />
            </Tooltip>
          </span>
        )
      }
    }),
    columnHelper.accessor('action', {
      header: 'Documents',
      cell: ({ row }) => (
        <>
          <Tooltip title={'Click to view documents'}>
            <IconButton size="small" color="primary" aria-label="application" onClick={(e) => setAnchorEl({ document: e.currentTarget, value: row?.original?.dealership_id, r: row?.original })} ><List /></IconButton>
          </Tooltip>
        </>
      )
    })
  ];

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length !== 0 ? (
          <DataTableViewer
            column={column}
            rowData={loans}
            excelDownload={true}
            title={`${title} (${loans.length})`}
            onRowClick={(i) => onRowClick(i.dealership_id, i, 'approved')}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No Approved Applications</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
      <Dialog fullWidth maxWidth="md" open={modalVisible} onClose={() => setModalVisible(false)}>
        <SignRequestLayout
          dealershipId={dealershipId}
          loanId={loanId}
          loanAmount={loanAmount}
          productId={productTypeId}
          type={type}
          title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter of Continuity' : 'Sanction Letter'}
          onClose={() => setModalVisible(false)}
          callback={getLoansTable}
          currentUser={currentUser}
        />
      </Dialog>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl?.attachments}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <DocCheckListDetailsTable title={rowData} />
      </Popover>

      <Popover
        id={documentId}
        open={documentPopover}
        anchorEl={anchorEl?.document}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.itemLists}>
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(anchorEl?.r?.['id']); setDealershipId(anchorEl?.value); setType('sanction'); setModalVisible(true); }}>
            <div className={classes.listIcon}>
              <DescriptionIcon style={{ width: 19, color: 'blue' }} />
            </div>
            <Typography>Sanction Letter</Typography>
          </div>
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(anchorEl?.r?.['id']); setDealershipId(anchorEl?.value); setType('agreement'); setModalVisible(true); setLoanAmount(anchorEl?.r?.['amount_approved']); setProductTypeId(anchorEl?.r?.['product_id']) }}>
            <div className={classes.listIcon} >
              <LoanAgreementIcon width={12} style={{ color: 'blue' }} />
            </div>
            <Typography>Loan Agreement</Typography>
          </div>
          <div className={classes.listItem} style={{ padding: '3px 0' }} onClick={() => { setAnchorEl({}); setloanId(anchorEl?.r?.['id']); setType('application'); setDealershipId(anchorEl?.value); setModalVisible(true); }}>
            <div className={classes.listIcon} style={{ marginLeft: '2px', width: '18px' }}>
              <ESignIcon width={17} style={{ color: 'blue' }} />
            </div>
            <Typography>eSign Application</Typography>
          </div>
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(anchorEl?.r?.['id']); setType('loc'); setDealershipId(anchorEl?.value); setModalVisible(true); setLoanAmount(anchorEl?.r?.['amount_approved']); }}>
            <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
              <AssignmentIcon style={{ width: 19, color: 'blue' }} />
            </div>
            <Typography>Letter Of Continuity</Typography>
          </div>
        </div>
      </Popover>
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