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

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
}));
const RejectedListTable = ({loans, loading, fetchData}) => {
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

  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership Id',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Dealership Name',
        name: 'name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Disbursed Date',
        name: 'loan_disbursed_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{moment(value).format('DD/MM/YYYY')}</>
          },
        }
      },
      {
        label: 'Created By',
        name: 'created_by',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Referred by Id',
        name: 'referred_dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <>{value}</>
        }
      },
      {
        label: 'Referred by Name',
        name: 'referred_dealership_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Bonus Amount',
        name: 'current_eligible_bonus',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value ? value : '-'} />
        }
      },
      {
        label: 'Action',
        name: 'dealership_id',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            return (
              !tableMeta?.rowData[8] ?
                <Tooltip title="click to pushback">
                  <Button variant='outlined' size='small' color='primary'
                    onClick={() => setModalObj({ open: true, id: value })}
                  >
                    Pushback
                  </Button>
                </Tooltip> : '-'
            )
          }
        }
      },
    ]
  }, [loans]);

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
        <MUIDataTable
          title={<Typography className={classes.title} variant="h4" component="h4">{'Settled'}</Typography>}
          data={loans}
          columns={columns}
          options={options}
        /> : (!loading && <Paper style={{ padding: 10 }}>No Records found</Paper>)
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
            <TextEditor setJSON={(e) => setModalObj(old => ({...old, remarks: e}))} toolBar={true} remarkData={modalObj?.remarks} />
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