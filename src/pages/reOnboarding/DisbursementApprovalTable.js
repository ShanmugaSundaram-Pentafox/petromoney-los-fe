import clsx from 'clsx';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getEnhancementSync, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import { ActionIcon, Button, Group, Modal, Text, Tooltip } from '@mantine/core';
import { IconCircleCheck, IconLink, IconRefresh } from '@tabler/icons-react';
import DDMSModal from '../../components/Deferal-Devation/DDMSModal';
import classes from './ReOnboarding.module.css';

const DisbursementApprovalTable = ({ title, onRowClick, filterQry }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [enhancementId, setEnhancementId] = useState();
  const [openDialog, setOpenDialog] = useState(false)
  const [docModal, setDocModal] = useState({ modal: false })

  const getReOnboardingDataQuery = useQuery({
    queryKey: ['re-onboarding-data-disbursement_approval', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('disbursement_approval', filterQry, page, search),
  })

  const getReOnboardingPaginationQuery = useQuery({
    queryKey: ['re-onboarding-pagination-disbursement_approval', filterQry],
    queryFn: () => getPageDetails('disbursement_approval', filterQry),
  })

  const reOnboardingDownloadQuery = useQuery({
    queryKey: 'reOnboarding-download-disbursement_approval',
    queryFn: () => downloadEnhancementData('disbursement_approval', filterQry),
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
    getEnhancementSync(enhancementId)
      .then(res => {
        displayNotification({
          message: res,
          variant: 'success',
        })
        getReOnboardingDataQuery?.refetch()
        setOpenDialog(false)
      })
      .catch(err => {
        displayNotification({
          message: err,
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
      header: 'Old Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: value => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'old_loan_amount',
      header: 'Old Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }, {
      key: 'new_loan_amount',
      header: 'New Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }, {
      key: 'action',
      header: 'Sync',
      isHeaderDownload: false,
      cell: ({ row }) => {
        return (
          row?.original?.is_sync == 1 ?
            <Tooltip label='Already synced' withArrow color='gray'>
              <IconCircleCheck color={'green'} />
            </Tooltip> :
            <div>
              <Tooltip label="click to sync" withArrow color='gray'>
                <IconRefresh color={'gray'} onClick={() => { setOpenDialog(true); setEnhancementId(row?.original?.['id']) }} />
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
  ];

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => true,
  //   rowsPerPage: 10,
  //   filter: false,
  //   print: false,
  //   sort: false,
  //   download: false,
  //   viewColumns: false,
  //   searchPlaceholder: 'Search by dealreship ID/Name',
  //   onSearchChange: (searchText) => {
  //     setSearch(searchText)
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
  //   customFooter: () => {
  //     return (
  //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  //         <MuiTableFooter
  //           totalCount={getReOnboardingPaginationQuery?.data?.total_number_of_pages}
  //           pageSize={10}
  //           onPageChange={(value) => { setPage(value) }}
  //         />
  //       </div>
  //     )
  //   },
  //   onCellClick: (colData, cellMeta) => {
  //     if ((cellMeta.colIndex !== 8) && (cellMeta.colIndex !== 7)) {
  //       onRowClick(getReOnboardingDataQuery?.data[cellMeta.dataIndex].dealership_id, getReOnboardingDataQuery?.data[cellMeta.dataIndex], 'disbursement_approval')
  //     }
  //   },
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   }
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        title={title}
        count={getReOnboardingDataQuery?.data?.length}
        rowData={getReOnboardingDataQuery?.data}
        column={column}
        onRowClick={i => onRowClick(i?.dealership_id, i, 'disbursement_approval')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        isLoading={getReOnboardingDataQuery?.isLoading}
        totalNoOfPages={getReOnboardingPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        downloadQuery={{ query: reOnboardingDownloadQuery?.refetch, isLoading: reOnboardingDownloadQuery?.isFetching }}
        excelDownload
      />

      <DDMSModal opened={Boolean(docModal?.modal)} onClose={() => setDocModal({})} modalObj={docModal} queryKey='re-onboarding-data-disbursement_approval' />

      <Modal opened={openDialog} onClose={() => setOpenDialog(true)} size={'lg'}>
        <Text>Ready to sync data with LMS?</Text>
        <Group justify='flex-end'>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color='green' onClick={() => syncData()}>Yes</Button>
        </Group>
      </Modal>
    </div>
  )
}

export default DisbursementApprovalTable;