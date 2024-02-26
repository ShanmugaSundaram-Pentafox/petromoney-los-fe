import { Dialog, Popover } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import DocCheckListDetailsTable from '../../components/Attachment/DocCheckListDetailsTable';
import SignRequestLayout from '../../components/Leegality/SignRequestLayout';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getRenewalLoans } from '../../services/loans.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
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
  },
  anchorTag: {
    textDecoration: 'none',
    color: '#d35178',
  },
}));

const RenewalTable = ({ currentUser }) => {
  const classes = useStyles();
  const [loanAmount, setLoanAmount] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [productTypeId, setProductTypeId] = useState();
  const [rowData, setRowData] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const columnHelper = createColumnHelper();

  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  const getRenewalApplicationQuery = useQuery({
    queryKey: ['renewal-application'],
    queryFn: () => getRenewalLoans(),
  })

  const handleClose = () => {
    setAnchorEl(null);
  };

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue}</RouterLink>
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
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }),
    columnHelper.accessor('amount_approved', {
      header: 'Approved Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('amount_date', {
      header: 'Approved Date',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }),
    columnHelper.accessor('action', {
      header: 'Attachment',
      cell: ({ row }) => {
        return (
          <div>
            <Tooltip title="click to view documents checklist">
              <LinkIcon style={{ color: 'grey' }} onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setDealershipId(row?.original?.attachment)
              }} />
            </Tooltip>
          </div>
        )
      }
    }),
    columnHelper.accessor('action', {
      header: 'Documents',
      cell: ({ row }) => {
        return (
          <div style={{ minWidth: 70 }}>
            <Tooltip title="Sanction Letter">
              <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(row?.original?.['loan_id']); setDealershipId(row?.original?.dealership_id); setType('sanction'); setModalVisible(true); }}>
                <DescriptionIcon style={{ width: 19 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Loan Agreement">
              <IconButton style={{ marginRight: 3 }} size="small" color="primary" aria-label="application" onClick={() => { setloanId(row?.original?.['loan_id']); setDealershipId(row?.original?.dealership_id); setType('agreement'); setModalVisible(true); setLoanAmount(row?.original?.['amount_approved']); setProductTypeId(row?.original?.['product_id']) }}>
                <LoanAgreementIcon width={12} />
              </IconButton>
            </Tooltip>
            <Tooltip title="eSign Application">
              <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(row?.original?.['loan_id']); setType('application'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); }}>
                <ESignIcon width={17} />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    })
  ]

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onCellClick: (colData, cellMeta) => {
      setRowData(loans[cellMeta.dataIndex])
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <DataTableViewer
        title={`Renewal Application`}
        rowData={getRenewalApplicationQuery?.data}
        column={column}
        onRowClick={i => setRowData(i)}
        loading={getRenewalApplicationQuery?.isLoading}
      />
      <Dialog fullWidth maxWidth="md" open={modalVisible} onClose={() => setModalVisible(false)}>
        <SignRequestLayout
          open={modalVisible}
          dealershipId={dealershipId}
          loanId={loanId}
          loanAmount={loanAmount}
          productId={productTypeId}
          type={type}
          title={type === 'application' ? 'eSign Application Form' : 'Sanction Letter'}
          onClose={() => setModalVisible(false)}
          currentUser={currentUser}
        />
      </Dialog>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
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
    </div>
  )
}

export default RenewalTable;