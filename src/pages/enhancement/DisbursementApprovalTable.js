import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState, } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../components/CommonComponents/CustomToken';
import Currency from '../../components/Number/Currency';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getEnhancementSync, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import { ActionIcon, Group, Modal, Text, Tooltip, Button } from '@mantine/core';
import { IconCircleCheck, IconLink, IconRefresh, IconReload } from '@tabler/icons-react';
import DDMSModal from '../../components/Deferal-Devation/DDMSModal';
import classes from './Enhancement.module.css'
import { isAllowed } from '../../utils/cerbos';
import { action_id, resources_id } from '../../config/accessControl';
import COLORS from '../../theme/colors';

const DisbursementApprovalTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [enhancementId, setEnhancementId] = useState();
  const [openDialog, setOpenDialog] = useState(false)
  const [docModal, setDocModal] = useState({ modal: false })
  const { enqueueSnackbar } = useSnackbar();

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data-disbursement_approval', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('disbursement_approval', filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination-disbursement_approval', filterQry],
    queryFn: () => getPageDetails('disbursement_approval', filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: 'enhancement-download-disbursement_approval',
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
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        getEnhancementDataQuery?.refetch();
        setOpenDialog(false);
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
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}><span style={{color: COLORS.text.blue }}>{value?.getValue()}</span></RouterLink>,
      sorting: true,
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>,
      sorting: true,
    }, {
      key: 'old_product_name',
      header: 'Old Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'old_loan_amount',
      header: 'Old Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'new_loan_amount',
      header: 'New Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
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
                <IconRefresh color={'grey'} onClick={() => { setOpenDialog(true); setEnhancementId(row?.original?.['id']) }} />
              </Tooltip>
            </div>
        )
      }
    }, {
      key: 'action',
      header: 'Action',
      enableColumnFilter: false,
      cell: (value) => {
        if (isAllowed(currentUser.permissions, resources_id?.dashboard, action_id?.dashboard?.pdcChecklist)) {
          if (value?.row?.original?.is_pdc_completed) {
            return (
              <Group>
                <CustomToken label={'PDC Completed'} variant="success" icon="tick" />
                {isAllowed(currentUser?.permissions, resources_id?.dashboard, action_id?.dashboard?.pdc_re_initiate) ?
                  <Tooltip label={'Click to re-initiate PDC'} withArrow>
                    <ActionIcon size={'xs'} variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id, is_pdc_completed: value?.row?.original?.is_pdc_completed, type: 're-initiate' })}>
                      <IconReload size={16} />
                    </ActionIcon>
                  </Tooltip>
                  : null}
              </Group>
            )
          } else {
            return (
              <Tooltip label={'Click to view checklist'} color='gray' withArrow>
                <ActionIcon size="xs" variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id, is_pdc_completed: value?.row?.original?.is_pdc_completed })}><IconLink /></ActionIcon>
              </Tooltip>
            )
          }
        }
      }
    },
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        title={title}
        allowSorting={true}
        rowData={getEnhancementDataQuery?.data}
        column={column}
        onRowClick={i => onRowClick(i.dealership_id, i, 'disbursement_approval')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={getEnhancementPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        columnsFilter
        loading={getEnhancementDataQuery?.isLoading}
        excelDownload
        downloadQuery={{ query: enhancementDownloadQuery?.refetch, isLoading: enhancementDownloadQuery?.isFetching }}
      />

      <DDMSModal opened={Boolean(docModal?.modal)} currentUser={currentUser} onClose={() => setDocModal({})} modalObj={docModal} queryKey={'enhancement-data-disbursement_approval'} />

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