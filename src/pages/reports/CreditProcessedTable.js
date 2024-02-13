import { Button, Grid, Tooltip, Drawer } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import CreditReload, { TableFooter } from './CreditReload';
import CreditReloadForm from './CreditReloadForm';
import CreditReloadRemarks from './CreditReloadRemarks';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import {
  getCreditReload,
  getCreditReportById,
} from '../../services/users.service';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';


const CreditProcessedTable = ({ currentUser }) => {
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [filterQry, setFilterQry] = useState();
  const [offset, setOffset] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const columnHelper = createColumnHelper();
  usePageTitle('Credit Reload');
  const view = permissionCheck(currentUser.role_name, rulesList.dealer_view)

  const { data = [], refetch, error, isLoading: searchLoading } = useQuery(['processed-request', offset], () => getCreditReload({ processed: 1, filterQry: filterQry, dealershipId: currentUser?.dealership_id, offset: offset, category: (filterQry?.dealership_id || currentUser?.dealership_id) ? undefined : 'today' }), { refetchOnWindowFocus: false, enabled: true })
  const { data: fileData } = useQuery(['view-credit-report'], () => getCreditReportById(filterQry, 'view=1'), { refetchOnWindowFocus: false })


  const handleDownload = () => {
    setDownloadLoading(true)
    getCreditReportById(filterQry, 'download=1')
      .then(({ message }) => {
        queryClient.invalidateQueries(['view-credit-report'])
        setDownloadLoading(false)
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((err) => {
        setDownloadLoading(false)
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }

  const DisplayValue = ({ value, row }) => {
    const handleClick = () => {
      let d = [];
      d.push({
        ...row,
        payment_proof_attachment: typeof (row?.payment_proof_attachment) === 'string' ? JSON.parse(row?.payment_proof_attachment) : (row?.payment_proof_attachment || [])
      })
      setRowData(d[0])
      setStatusModal(true)
    }
    return (
      <div style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => handleClick()}>{value}</div>
    )
  }

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: ({ row }) => <DisplayValue row={row?.original} value={row?.original?.dealership_id} />
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => <DisplayValue row={row?.original} value={row?.original?.dealership_id} />
    }),
    columnHelper.accessor('request_id', {
      header: 'Request Id',
    }),
    columnHelper.accessor('product_name', {
      header: 'Scheme',
    }),
    columnHelper.accessor('utr', {
      header: 'UTR',
    }),
    columnHelper.accessor('created_date', {
      header: 'Requested Date',
    }),
    columnHelper.accessor('region', {
      header: 'Region',
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('account_no', {
      header: 'Account number',
    }),
    columnHelper.accessor('created_by', {
      header: 'Created By',
    }),
    columnHelper.accessor('last_modified_by', {
      header: 'Processed By',
    }),
    columnHelper.accessor('origin', {
      header: 'Origin',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (value) => {
        if (value?.getValue() === 'Declined') {
          return (
            <div><CustomToken label={value?.getValue()} variant='error' icon='cross' /></div>
          )
        }
        else if (value?.getValue() === 'Disbursed') {
          return (
            <div><CustomToken label={value?.getValue()} variant='success' icon='tick' /></div>
          )
        }
        else return <CustomToken label={value?.getValue()} variant='success' />
      }
    }),
    columnHelper.accessor('disbursed_declined_date', {
      label: 'Disbursed / Declined Date',
    }),
  ]

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 25,
    filter: false,
    download: false,
    search: false,
    viewColumns: false,
    setRowProps: (row, dataIndex) => {
      if (row[12]) {
        return { style: { backgroundColor: '#ffb99b69' } }
      }
      if (data?.data?.[dataIndex]?.reload_type === 'express') {
        return { style: { backgroundColor: '#ff21161a' } }
      }
    },
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
          ...data?.data[cellMeta.dataIndex],
          payment_proof_attachment: typeof (data?.data[cellMeta.dataIndex]?.payment_proof_attachment) === 'string' ? JSON.parse(data?.data[cellMeta.dataIndex]?.payment_proof_attachment) : (data?.data[cellMeta.dataIndex]?.payment_proof_attachment || [])
        })
        setRowData(d[0])
        setStatusModal(true)
      }
    },
  };
  return (
    <div>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant='rect' width='100%' height={400} />
        </Grid>
      ) : (
        <>
          <CreditReload
            currentUser={currentUser}
            filterQry={setFilterQry}
            refetch={refetch}
            filterList={['period', 'type']}
            filterType={'processed'}
            handleDownload={handleDownload}
            fileData={fileData?.data[0]}
            downloadLoading={downloadLoading}
            searchLoading={searchLoading}
          />
          {/* <MUIDataTable
            title={'Processed'}
            columns={columns}
            options={options}
            data={error ? [] : data?.data}
            components={{
              TableFooter: () => <TableFooter offset={offset} stats={data?.stats} handleIncrease={() => setOffset(offset + 1)} handleDecrease={() => setOffset(offset - 1)} />
            }}
          /> */}
          <DataTableViewer
            rowData={error ? [] : data?.data}
            column={column}
            title={'Processed'}
          />
        </>
      )}
      <Drawer
        anchor='right'
        open={statusModal}
        onClose={() => setStatusModal(false)}
        variant='temporary'
      >
        <CreditReloadRemarks callback={() => setStatusModal(false)} rowData={rowData} currentUser={currentUser} />
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
            currentUser={currentUser}
            view={view}
          />
        }
      </Drawer>
    </div>
  )
}
export default CreditProcessedTable;