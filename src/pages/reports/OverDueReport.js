import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ChatIcon from '@material-ui/icons/Chat';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import Currency from '../../components/Number/Currency';
import usePageTitle from '../../hooks/usePageTitle';
import { getReport } from '../../services/users.service';

const useStyles = makeStyles(theme => ({
  root: {
  },
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
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  }
}));

const OverDueTable = () => {
  const classes = useStyles();

  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [remarksModal, setRemarksModal] = useState({open: false})
  console.log(remarksModal);
  useMount(async () => {
    setLoading(true)
    getReport()
      .then((data) => {
        setLoading(false);
        setLoans(data.overdue)
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  })
  usePageTitle('Report')
  const columns = useMemo(() => {
    return [
      { name: 'applicant_code', label: 'Applicant Code' },
      { name: 'applicant_name', label: 'Applicant Name' },
      { name: 'cust_code', label: 'Customer Code' },
      { name: 'cust_region', label: 'Customer Region' },
      {
        name: 'penal_overdue',
        label: 'Penal Overdue',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'tot_due',
        label: 'Total Due',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'remarks',
        label: 'Remarks',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            // console.log(value);
            return (
              <div style={{display: 'flex', alignItems: 'center'}}>
                <IconButton size="small" onClick={() => setRemarksModal({open:true, data: value})}>
                  <ChatIcon style={{color: 'grey'}} fontSize="small" />
                </IconButton>
                {/* <p style={{color: 'rgb(0,0,0,0.4)'}}>{value.length}</p> */}
              </div>
            )
          }
        }
      },
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  return (
    <div className={classes.root}>
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={'Loan Overdue Reports'}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No overdue Reports found</Paper>
      }
      <Dialog
        open={remarksModal?.open}
        onClose={() => setRemarksModal({open: false})}
      >
        <DialogTitle>Overdue Remarks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              remarksModal?.data?.map((data, i) => {
                console.log(data);
                // return(
                //   <ul>
                //     <li>{`${data?.label} by`}</li>
                //   </ul>
                // )
              })
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarksModal({open: false})}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default OverDueTable