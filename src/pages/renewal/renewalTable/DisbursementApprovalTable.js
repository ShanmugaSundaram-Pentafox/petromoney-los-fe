import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import SyncIcon from '@material-ui/icons/Sync';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import Currency from '../../../components/Number/Currency';
import { getSignedUrl } from '../../../services/common.service';
import { downloadRenewalData, getPageDetails, getRenewalLoanByStatus, syncRenewalData } from '../../../services/renewal.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import DDMSModal from '../../../components/Deferal-Devation/DDMSModal';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '12px',
    fontWeight: '500',
    minWidth: '30px',
    textAlign: 'center',
  },
  itemLists: {
    padding: '10px',
    display: 'flex',
    gap: '6px',
    flexDirection: 'column',
  },
  listItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: '#f7f7f7',
    },
    height: '22px',
  },
  listIcon: {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
  }
}));


const DisbursementApprovalTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [renewalId, setRenewalId] = useState();
  const [docModal, setDocModal] = useState({ modal: false })
  const { enqueueSnackbar } = useSnackbar();

  const pageDetailsQuery = useQuery(
    ['renewal-disbursement_approval-recordCount', filterQry, search],
    () => getPageDetails('disbursement_approval', filterQry),
  );

  const getRenewalDataQuery = useQuery(
    ['renewal-disbursement_approval', filterQry, page, search],
    () => getRenewalLoanByStatus('disbursement_approval', filterQry, page, search),
  );

  const renewalDownloadQuery = useQuery({
    queryKey: 'renewal-download-disbursement_approval',
    queryFn: () => downloadRenewalData('disbursement_approval', filterQry),
    onSuccess: (data) => {
      getSignedUrl(data[0]?.url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          displayNotification({ message: e, variant: 'error' });
        })
    },
    onError: (e) => {
      displayNotification({ message: e, variant: 'error' })
    },
    enabled: Boolean(false),
    retry: Boolean(false),
  });

  const syncData = () => {
    syncRenewalData({ renewal_application_id: renewalId })
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setOpenDialog(false)
      })
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
        setOpenDialog(false)
      })
  }

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'old_product_name',
      header: 'Old Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'new_loan_amount',
      header: 'Disbursed Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'renewal_month',
      header: 'Month Of Renewal',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }, {
      key: 'action',
      header: 'Sync',
      isHeaderDownload: false,
      cell: ({ row }) => {
        return (
          row?.original?.is_sync == 1 ?
            <Tooltip label='Already synced' withArrow color='gray'>
              <CheckCircleTwoToneIcon style={{ color: green[200] }} />
            </Tooltip> :
            <div>
              <Tooltip label="click to sync" withArrow color='gray'>
                <SyncIcon style={{ color: 'grey' }} onClick={() => { setOpenDialog(true); setRenewalId(row?.original?.['loan_id']) }} />
              </Tooltip>
            </div>
        )
      },
    }, {
      key: 'action',
      header: 'Action',
      enableColumnFilter: false,
      cell: (value) => {
        if (value?.row?.original?.is_pdc_completed) {
          return (
            <CustomToken label={'PDC Completed'} variant="success" icon="tick" />
          )
        } else {
          return (
            <Tooltip label={'Click to view checklist'} color='gray' withArrow>
              <ActionIcon size="xs" variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id, is_pdc_completed: value?.row?.original?.is_pdc_completed })}><IconLink /></ActionIcon>
            </Tooltip>
          )
        }
      }
    },
  ]

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => true,
  //   rowsPerPage: 10,
  //   filter: false,
  //   print: false,
  //   download: false,
  //   sort: false,
  //   viewColumns: false,
  //   searchPlaceholder: 'Search by dealreship ID/Name',
  //   onSearchChange: (searchText) => {
  //     setSearch(searchText)
  //   },
  //   customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
  //     return (
  //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  //         <MuiTableFooter
  //           totalCount={pageDetailsQuery?.data?.total_number_of_pages}
  //           pageSize={10}
  //           onPageChange={(value) => { setPage(value) }}
  //         />
  //       </div>
  //     )
  //   },
  //   onCellClick: (colData, cellMeta) => {
  //     if (cellMeta.colIndex != 8 && cellMeta.colIndex != 7) {
  //       onRowClick(getRenewalDataQuery?.data[cellMeta.dataIndex].dealership_id, getRenewalDataQuery?.data[cellMeta.dataIndex], 'disbursement_approval')
  //     }
  //   },
  //   // customToolbar: () => {
  //   //   return (
  //   //     <>
  //   //       <Tooltip title="Download">
  //   //         <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={onDownloadClick}></Button>
  //   //       </Tooltip>
  //   //     </>
  //   //   );
  //   // },
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   }
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={getRenewalDataQuery?.data}
        column={column}
        title={title}
        onRowClick={i => onRowClick(i?.dealership_id, i, 'disbursement_approval')}
        useAPIPagination
        apiSearch={setSearch}
        loading={getRenewalDataQuery?.isLoading}
        page={page}
        setPage={setPage}
        totalNoOfPages={pageDetailsQuery?.data?.total_number_of_pages}
        filter={false}
        downloadQuery={{ query: renewalDownloadQuery?.refetch, isLoading: renewalDownloadQuery?.isFetching }}
        excelDownload
      />

      <DDMSModal opened={Boolean(docModal?.modal)} onClose={() => setDocModal({})} modalObj={docModal} queryKey='renewal-disbursement_approval' />

      <Dialog fullWidth maxWidth="xs" open={openDialog} onClose={() => setOpenDialog(true)}>
        <DialogContent dividers>
          <Typography>Ready to sync data with LMS?</Typography>
        </DialogContent>
        <DialogActions>
          <div>
            <Button variant='outlined' onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant='contained' color='primary' style={{ color: 'white', marginLeft: 15 }} onClick={() => syncData()}>Yes</Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DisbursementApprovalTable;