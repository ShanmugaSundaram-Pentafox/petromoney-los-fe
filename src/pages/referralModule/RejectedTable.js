import { Dialog, DialogContent, DialogContentText, DialogTitle, makeStyles } from '@material-ui/core';
import moment from 'moment/moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import Currency from '../../components/Number/Currency';
import { TextEditor } from '../../components/TextEditor/TextEditor';
import { rejectDealerReferralById } from '../../services/dealerships.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Button, Paper, Tooltip } from '@mantine/core';
import COLORS from '../../theme/colors';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
}));
const RejectedListTable = ({ loans, loading, fetchData }) => {
  const classes = useStyles();
  const [modalObj, setModalObj] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}><span style={{color: COLORS.text.blue }}>{value?.getValue()}</span></RouterLink>
    }, {
      key: 'name',
      header: 'Dealership Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'loan_disbursed_date',
      header: 'Disbursed Date',
      cell: (value) => <span>{moment(value?.getValue()).format('DD/MM/YYYY')}</span>
    }, {
      key: 'created_by',
      header: 'Created By',
    }, {
      key: 'referred_dealership_id',
      header: 'Referred By Id',
    }, {
      key: 'referred_dealership_name',
      header: 'Referred By Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'current_eligible_bonus',
      header: 'Bonus Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'action',
      header: 'Action',
      isHeaderDownload: false,
      cell: ({ row }) => {
        return (
          <Tooltip label="click to pushback" color='gray' withArrow>
            <Button variant='outline' size='compact-xs'
              onClick={() => setModalObj({ open: true, id: row?.original?.dealership_id })}
            >
              Pushback
            </Button>
          </Tooltip>
        )
      }
    },
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
    <Paper>
      <DataTableViewer
        rowData={loans}
        column={column}
        filter={false}
        loading={loading}
        title={'Rejected'}
        excelDownload
      />
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
    </Paper>
  )
}

export default RejectedListTable