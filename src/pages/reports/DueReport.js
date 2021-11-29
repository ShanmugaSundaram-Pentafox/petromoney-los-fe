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
    // padding: theme.spacing(3),
    // paddingTop: 0,
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

const DueTable = () => {
  const classes = useStyles();

  const [loans, setLoans] = useState([])
  console.log(loans);
  const [loading, setLoading] = useState(false)
  const [remarksModal, setRemarksModal] = useState(false);

  useMount(async () => {
    setLoading(true)
    getReport()
      .then((data) => {
        setLoading(false);
        setLoans(data.due)
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
    // fetch('http://localhost:3333/data')
    // .then(res => res.json())
    // .then(setLoans)
  })
  usePageTitle('Report')
  const columns = useMemo(() => {
    return [
      {
        name: 'applicant_code',
        label: 'Applicant Code',
        options: {
          filter: false,
        }
      },
      {
        name: 'applicant_name',
        label: 'Applicant Name',
        options: {
          filter: false,
        }
      },
      {
        name: 'cust_code',
        label: 'Dealership ID',
        options: {
          filter: false,
        }
      },
      { name: 'cust_region',label: 'Customer Region' },
      {
        name: 'duedate',
        label: 'Due Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'disb_amt',
        label: 'disburse Amt',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <Currency value={value} />
          }
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
            return (
              <div style={{display: 'flex', alignItems: 'center'}}>
                <IconButton size="small" onClick={() => setRemarksModal(true)}>
                  <ChatIcon style={{color: 'grey'}} fontSize="small" />
                </IconButton>
                <p style={{color: 'rgb(0,0,0,0.4)'}}>(3)</p>
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
      {/* {
        (loans.length === 0) ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={"Due Reports"}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No Due Loans</Paper>
      } */}
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) : Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={'Loan Due Reports'}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : <Paper style={{ padding: 10 }}>No due Reports found</Paper>
      }
      <Dialog
        open={remarksModal}
        onClose={() => setRemarksModal(false)}
      >
        <DialogTitle>Due Remarks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            remarks
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarksModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DueTable