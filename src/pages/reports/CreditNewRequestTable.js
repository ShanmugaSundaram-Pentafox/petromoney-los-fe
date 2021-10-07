import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import usePageTitle from '../../hooks/usePageTitle';
import { useMemo } from 'react';
import { classes } from 'istanbul-lib-coverage';
import MUIDataTable from 'mui-datatables';
import { useMount } from 'react-use';
import {
  getCreditReport,
  getCreditReportById,
  getReport,
  getTypeOfAccount,
} from '../../services/users.service';
import Currency from '../../components/Number/Currency';
import { Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Tooltip } from '@material-ui/core';
import { Badge } from '@material-ui/core';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import { Drawer } from '@material-ui/core';
import CreditReloadForm from './CreditReloadForm';
import CreditReloadRemarks from './CreditReloadRemarks';


const CreditNewRequestTable = ({ data, currentUser }) => {
  const [tableData, setTableData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [accountType, setAccountType] = useState();
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("processed");
  const [dealershipData, setDealershipData] = useState();


  useMount(() => {
    getTypeOfAccount()
      .then((data) => {
        setLoading(false);
        setAccountType(
          data.map(({ id, type_of_account }) => ({
            label: type_of_account,
            id: id,
          }))
        );
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      })
  });
  usePageTitle('Credit Report');
  const columns = useMemo(() => {
    return [
      {
        name: 'dealership_id',
        label: 'Dealership ID',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value}</div>
          }
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'request_id',
        label: 'Request ID',
        options: { filter: false }
      },
      {
        name: 'created_date',
        label: 'Requested Date',
        options: { filter: false }
      },
      {
        name: 'region',
        label: 'Region',
        options: { filter: false }
      },
      {
        name: 'amount', label: 'Amount',
        options: {
          filter: false,
          customBodyRender: (value) => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'type_of_account',
        label: 'Account Type'
      },
      {
        name: 'last_modified_by',
        label: 'Submitted or Modified by',
        options: {
          customBodyRender: (value, tableMeta) => {
            return <div>{value}</div>
          }
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          customBodyRender: (value, tableMeta) => {
            if (value === 'Declined') {
              return (
                <Tooltip title={tableMeta.rowData[7]}>
                  <div style={{ color: '#FF5C58' }}>{value}</div>
                </Tooltip>
              )
            }
            else if (value === 'Disbursed') {
              return (
                <Tooltip title={tableMeta.rowData[7]}>
                  <div>{value}</div>
                </Tooltip>
              )
            }
            else
              return value
          },
          filter: false
        }
      },
      { name: 'remarks', options: { display: 'excluded', filter: false } },
      { name: 'role_name', options: { display: 'excluded', filter: false } }
    ];
  }, [data]);
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
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex === 0 || cellMeta.colIndex === 1) {
        let d = [];
        d.push({
          ...data[cellMeta.dataIndex],
          payment_proof_attachment: typeof (data[cellMeta.dataIndex].payment_proof_attachment) === "string" ? JSON.parse(data[cellMeta.dataIndex].payment_proof_attachment) : (data[cellMeta.dataIndex].payment_proof_attachment || [])
        })
        setRowData(d[0])
        setStatusModal(true)
      }
    },
  };
  return (
    <div className={classes.root}>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant='rect' width='100%' height={400} />
        </Grid>
      ) : (
        <MUIDataTable
          title={'New Request'}
          columns={columns}
          options={options}
          data={data}
        />
      )}
      <Drawer
        anchor='right'
        open={statusModal}
        onClose={() => setStatusModal(false)}
        variant='temporary'
      >
        {
          <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser} />
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
  )
}
export default CreditNewRequestTable;