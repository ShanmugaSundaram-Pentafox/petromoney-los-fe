import { Button, Drawer, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import AddSettlementForm from './AddSettlementForm';
import Currency from '../../components/Number/Currency';
import { getDealershipReferral } from '../../services/dealerships.service';
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

const ReferralTable = ({ currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getDealershipReferral()
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }

  useMount(() => {
    fetchData() 
  })

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
        name: 'dealership_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Dealer Region',
        name: 'dealership_region',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
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
        label: 'Referred by Region',
        name: 'referred_dealership_region',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span>{value}</span>
        }
      },
      {
        label: 'Bonus Amount',
        name: 'bonus_amount',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <Currency value={value ? value : '-'} />
        }
      },
      {
        label: 'Settlement Type',
        name: 'settlement_type',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span>{value ? value : '-'}</span>
        }
      },
      {
        label: 'Reference Number',
        name: 'referrence_number',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span>{value ? value : '-'}</span>
        }
      },
      {
        label: 'Action',
        name: 'dealership_id',
        options: {
          customBodyRender: value => {
            return (
              <Tooltip title="click to add settlement">
                <Button variant='outlined' size='small' color='primary'
                  onClick={() => setOpen({ open: true, id: value })}
                >
                  Add settlement
                </Button>
              </Tooltip>
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
    }
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h4" component="h4">{'Referral List'} ({loans.length})</Typography>}
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
          <AddSettlementForm id={open?.id} data={loans} callback={() => {setOpen({ ...open, open: false });fetchData()}} currentUser={currentUser} />
        </div>
      </Drawer>
    </div>
  )
}


export default ReferralTable;