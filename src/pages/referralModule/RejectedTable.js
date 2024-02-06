import { Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Paper, Tooltip, Typography, makeStyles } from '@material-ui/core';
import moment from 'moment/moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import Currency from '../../components/Number/Currency';
import { TextEditor } from '../../components/TextEditor/TextEditor';
import { rejectDealerReferralById } from '../../services/dealerships.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
}));
const RejectedListTable = ({ loans, loading, fetchData }) => {
  const classes = useStyles();
  const [modalObj, setModalObj] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const columnHelper = createColumnHelper();

  const handlePushback = () => {
    rejectDealerReferralById({ id: modalObj?.id, data: { remarks: modalObj?.remarks, status: 'pushback' } })
      .then((res) => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setModalObj({})
        fetchData();
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
        setModalObj({})
      })
  }

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
          <Tooltip title="click to pushback">
            <Button variant='outlined' size='small' color='primary'
              onClick={() => setModalObj({ open: true, id: row?.original?.dealership_id })}
            >
              Pushback
            </Button>
          </Tooltip>
        )
      }
    }),
  ]

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    },
    viewColumns: false,
    print: false,
    filter: false,
  };

  return (
    <div>
      {Array.isArray(loans) && loans.length ?
        <DataTableViewer
          rowData={loans}
          column={column}
          title={'Rejected'}
        />
        : (!loading && <Paper style={{ padding: 10 }}>No Records found</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
      <Dialog
        open={modalObj?.open}
        onClose={() => setModalObj({})}
      >
        <DialogTitle>Are you sure you want to PUSHBACK this referral?</DialogTitle>
        <DialogContent>
          <div className={classes.dialog}>
            <DialogContentText id="pushback-remarks-desc">
              Please enter your remarks.
            </DialogContentText>
            <TextEditor setJSON={(e) => setModalObj(old => ({ ...old, remarks: e }))} toolBar={true} remarkData={modalObj?.remarks} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, marginBottom: 5 }}>
            <Button variant='outlined' onClick={() => setModalObj({})} style={{ marginRight: 8 }}>Cancel</Button>
            <LoaderButton
              variant='contained'
              color='primary'
              buttonLabel='Confirm'
              size='medium'
              isLoading={loading?.reject}
              loadingText="Submitting..."
              onClick={handlePushback}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RejectedListTable