import { Drawer } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import CreditReload from './CreditReload';
import CreditReloadForm from './CreditReloadForm';
import CreditReloadRemarks from './CreditReloadRemarks';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import {
  getCreditReload,
  getCreditReportById,
} from '../../services/users.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Paper } from '@mantine/core';


const CreditProcessedTable = ({ currentUser }) => {
  const [rowData, setRowData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [filterQry, setFilterQry] = useState();
  const [offset, setOffset] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  // usePageTitle('Credit Reload');
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
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: ({ row }) => <DisplayValue row={row?.original} value={row?.original?.dealership_id} />
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: ({ row }) => <DisplayValue row={row?.original} value={row?.original?.name} />
    }, {
      key: 'request_id',
      header: 'Request Id',
      enableColumnFilter: false,
    }, {
      key: 'product_name',
      header: 'Scheme',
    }, {
      key: 'utr',
      header: 'UTR',
      enableColumnFilter: false,
    }, {
      key: 'created_date',
      header: 'Requested Date',
      enableColumnFilter: false,
    }, {
      key: 'region',
      header: 'Region',
    }, {
      key: 'amount',
      header: 'Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'account_no',
      header: 'Account number',
      enableColumnFilter: false,
    }, {
      key: 'created_by',
      header: 'Created By',
      enableColumnFilter: false,
    }, {
      key: 'last_modified_by',
      header: 'Processed By',
      enableColumnFilter: false,
    }, {
      key: 'origin',
      header: 'Origin',
    }, {
      key: 'status',
      header: 'Status',
      enableColumnFilter: false,
      cell: ({ row }) => {
        if (row?.original?.status === 'Declined') {
          return (
            <div><CustomToken label={row?.original?.status} variant='error' icon='cross' /></div>
          )
        }
        else if (row?.original?.status === 'Disbursed') {
          return (
            <div><CustomToken label={row?.original?.status} variant='success' icon='tick' /></div>
          )
        }
        else if (row?.original?.is_withheld == 1)
          return <CustomToken label="Withheld" variant='warn' />
        else return <CustomToken label={row?.original?.status} variant='success' />
      }
    }, {
      key: 'disbursed_declined_date',
      label: 'Disbursed / Declined Date',
      enableColumnFilter: false,
    },
  ]

  return (
    <div>
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
      <Paper>
        <DataTableViewer
          rowData={error ? [] : data?.data}
          column={column}
          loading={searchLoading}
          title={'Processed'}
        />
      </Paper>
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
        styles={{ root: { position: 'absolute', zIndex: 9999 } }}
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