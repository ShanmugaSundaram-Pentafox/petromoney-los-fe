import React from 'react';
import { makeStyles } from '@material-ui/styles';
import usePageTitle from '../../hooks/usePageTitle';
import { useMemo } from 'react';
import { classes } from 'istanbul-lib-coverage';
import MUIDataTable from 'mui-datatables';
import { useState } from 'react';
import { useMount } from 'react-use';
import {
  getCreditReport,
  getCreditReportById,
  getReport,
  getTypeOfAccount,
} from '../../services/users.service';
import Currency from '../../components/Number/Currency';
import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { borderRadius, display } from '@material-ui/system';
import CachedIcon from '@material-ui/icons/Cached';
import { Dialog } from '@material-ui/core';
import { DialogTitle } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { DialogActions } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ReplayIcon from '@material-ui/icons/Replay';
import { Tooltip } from '@material-ui/core';
import { Drawer } from '@material-ui/core';
import CreditReloadForm from './CreditReloadForm';
import { getAllDealership } from '../../services/dealerships.service';
import CreditReloadRemarks from './CreditReloadRemarks';

const useStyes = makeStyles((theme) => ({
  root: {},
}));

const CreditReload = ({ currentUser }) => {
  const [loans, setLoans] = useState([]);
  const [tableData, setTableData] = useState();
  const [accountType, setAccountType] = useState();
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [reloadDialog, setReloadDialog] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [dealershipData, setDealershipData] = useState();


  useMount(async () => {
    // setLoading(true)
    getCreditReport()
      .then((data) => {
        if(data != 0){
          setTableData(data);
        }
        // setLoading(false);
      })
      .catch((e) => {
        // setLoading(false);
        console.log(e);
      });
    getTypeOfAccount()
      .then((data) => {
        // setLoading(false);
        setAccountType(
          data.map(({ id, type_of_account }) => ({
            label: type_of_account,
            id: id,
          }))
        );
      })
      .catch((e) => {
        // setLoading(false);
        console.log(e);
      });

    getAllDealership()
      .then((data) => {
        setDealershipData(
          data.map(({ id }) => ({
            label: id,
            value: id,
          }))
        );
      })
      .catch((e) => {
        console.log(e);
      });
  });

  // const handleCreditReload = () => {
  //   setReloadDialog(true);
  // };

  const handleClose = () => {
    setReloadDialog(false);
  };

  const handleSubmit = () => {
    //     setSubmitLoading(true)
    //     // setTimeout(() => {
    //     //     window.location.reload();
    //     // }, 3000)
    //     const data = {'request_source': 'MDM', 'amount': rowData.amount, 'mobile': rowData.mobile, 'account_id': 1}
    //     console.log(data);
  };

  usePageTitle('Credit Report');
  const columns = useMemo(() => {
    return [
      { name: 'dealership_id', label: 'Dealership ID' },
      { name: 'mobile', label: 'Mobile' },
      { name: 'request_id', label: 'Request ID' },
      { name: 'amount', label: 'Amount' },
      { name: 'type_of_account', label: 'Account Type' },
    ];
  }, []);

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
    customToolbar: () => {
      return (
        <Button
          color='primary'
          variant='contained'
          onClick={() => setOpenModal(true)}
        >
          Add
        </Button>
      );
    },
    onRowClick: (rowData) => {
        getCreditReportById(rowData[0])
        .then((data) => {
          setRowData(data[0])
          setStatusModal(true)
      })
    }
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant='rect' width='100%' height={400} />
        </Grid>
      ) : (
        <MUIDataTable
          title={'Credit Reload Moderation'}
          columns={columns}
          options={options}
          data={tableData}
        />
      )}


      {/* <Dialog open={reloadDialog} onClose={handleClose}>
        <DialogTitle>Credit Reload Request</DialogTitle>
        <DialogContent style={{ width: 450 }}>
          <Typography variant='h7'>
            Do you want to reload your credit?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            onClick={handleClose}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          {submitLoading ? (
            <CircularProgress size={30} />
          ) : (
            <Button
              variant='contained'
              style={{ backgroundColor: '#50CB93', color: 'white' }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog> */}


      <Drawer
        anchor='right'
        open={true}
        onClose={() => setStatusModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadRemarks callback={() => setStatusModal(false)}/>
        }
      </Drawer>

      <Drawer
        anchor='right'
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadForm
            callback={() => setOpenModal(false)}
            data={accountType}
            dealershipData={dealershipData}
            currentUser={currentUser}
          />
        }
      </Drawer>
    </div>
  );
};

export default CreditReload;
