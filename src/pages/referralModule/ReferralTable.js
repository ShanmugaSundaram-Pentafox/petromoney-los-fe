import { Button, Drawer, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
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

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
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

  // const fetchData = () => {
  //   setLoading(true);
  //   getDealershipReferral()
  //     .then(data => {
  //       setLoans(data);
  //       setLoading(false);
  //     })
  //     .catch(e => {
  //       setLoading(false);
  //     })
  // }

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
                <Tooltip title="click to add settlement">
                  <Button variant='outlined' size='small' color='primary'
                    onClick={() => setOpen({ open: true, id: value })}
                  >
                    Add settlement
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
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex === 5) {
        setRowData(loans[cellMeta.dataIndex])
      }
      else {
        currentUser.role_id == 1 &&
          onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex]);
      }
    },
    filter: false,
    viewColumns: false,
    print: false,
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h4" component="h4">{'Referral List'}</Typography>}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No Records found</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
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
    </div>
  )
}


export default ReferralTable;