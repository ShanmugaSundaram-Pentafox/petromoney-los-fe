import { Drawer } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import AddSettlementForm from './AddSettlementForm';
import EditReferralDataForm from './EditReferralDataForm';
import Currency from '../../components/Number/Currency';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Button, Paper, Tooltip } from '@mantine/core';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  sidePanelWrapper: {
    width: '40vw',
    maxWidth: '50vw'
  },
}));

const ReferralTable = ({ currentUser, loans, loading, fetchData }) => {
  const classes = useStyles();
  // const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const columnHelper = createColumnHelper();

  const onRowClick = (dealershipId, rowData) => {
    if (!rowData?.settlement_type) {
      setOpen({
        ...open,
        open: true,
        id: dealershipId,
        is_edit: true,
      });
      setRowData(rowData);
    }
    else {
      enqueueSnackbar('You are not allowed to edit, settlement is already made', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      })
    }
  };

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('name', {
      header: 'Dealership Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }),
    columnHelper.accessor('loan_disbursed_date', {
      header: 'Disbursed Date',
      cell: (value) => <span>{moment(value?.getValue()).format('DD/MM/YYYY')}</span>
    }),
    columnHelper.accessor('created_by', {
      header: 'Created By',
    }),
    columnHelper.accessor('referred_dealership_id', {
      header: 'Referred By Id',
    }),
    columnHelper.accessor('referred_dealership_name', {
      header: 'Referred By Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }),
    columnHelper.accessor('current_eligible_bonus', {
      header: 'Bonus Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => {
        return (
          <Tooltip label="click to add settlement" color='gray' withArrow>
            <Button variant='outline' size='compact-xs' style={{ fontSize: '12px' }}
              onClick={() => { setOpen({ open: true, id: row?.original?.dealership_id }); setRowData(row?.original) }}
            >
              Add settlement
            </Button>
          </Tooltip>
        )
      }
    }),
  ]

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => false,
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   },
  //   onCellClick: (colData, cellMeta) => {
  //     if (cellMeta.colIndex === 7) {
  //       setRowData(loans[cellMeta.dataIndex])
  //     }
  //     else {
  //       (currentUser.role_id == 1 || currentUser.role_id == 9) &&
  //         onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex]);
  //     }
  //   },
  //   filter: false,
  //   viewColumns: false,
  //   print: false,
  // };

  return (
    <Paper>
      <DataTableViewer
        rowData={loans}
        column={column}
        filter={false}
        loading={loading}
        title={'Referral List'}
        onRowClick={i => {
          (currentUser.role_id == 1 || currentUser.role_id == 9) &&
            onRowClick(i?.dealership_id, i);
        }}
      />
      <Drawer
        anchor="right"
        ModalProps={{
          onBackdropClick: () => { setOpen({ ...open, open: false }) }
        }}
        open={open?.open}
        variant={'temporary'}
      >
        <div className={classes.sidePanelWrapper}>
          {open?.is_edit ?
            <EditReferralDataForm dealershipId={open?.id} rowData={rowData} callback={() => { setOpen({ ...open, open: false, is_edit: false }); fetchData() }} currentUser={currentUser} /> :
            <AddSettlementForm dealershipId={open?.id} rowData={rowData} callback={() => { setOpen({ ...open, open: false }); fetchData() }} currentUser={currentUser} />
          }
        </div>
      </Drawer>
    </Paper>
  )
}


export default ReferralTable;