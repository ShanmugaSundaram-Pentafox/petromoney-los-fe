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

  });


  usePageTitle('Credit Report');
  const columns = useMemo(() => {
    return [
      { name: 'dealership_id', label: 'Dealership ID' },
      { name: 'request_id', label: 'Request ID' },
      { name: 'mobile', label: 'Mobile' },
      { name: 'amount', label: 'Amount' },
      { name: 'type_of_account', label: 'Account Type' },
      { name: 'name', label: 'Submited By', options: {
        customBodyRender: (value, tableMeta) => {
          return <div>{`${value} (${tableMeta?.rowData[9]})`}</div>
        }
      }},
      { name: 'is_cancel', options: {display: 'excluded'}},
      { name: 'is_status', label: 'Status', options: {
        customBodyRender: (value, tableMeta) => {
          return <Tooltip title={tableMeta?.rowData[8]}>{tableMeta?.rowData[6] === 1 ? <div style={{color: '#FF5C58'}}>Declined</div> : tableMeta?.rowData[7] === 1 ? <div>Dispersed</div>:<div>-</div>}</Tooltip>
        }
      }},
      { name: 'remarks', options: {display: 'excluded'}},
      { name: 'role_name', options: {display: 'excluded'}}
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


      <Drawer
        anchor='right'
        open={statusModal}
        onClose={() => setStatusModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser}/>
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
