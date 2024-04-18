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
import { ActionIcon, Button, Group, Modal, Text, Tooltip } from '@mantine/core';
import { IconCircleCheck, IconLink, IconRefresh } from '@tabler/icons-react';
import DDMSModal from '../../../components/Deferal-Devation/DDMSModal';
import classes from './Renewal.module.css';
import { isAllowed } from '../../../utils/cerbos';
import { action_id, resources_id } from '../../../config/accessControl';

const DisbursementApprovalTable = ({ title, onRowClick, filterQry,currentUser }) => {
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
              <IconCircleCheck color={'green'} />
            </Tooltip> :
            <div>
              <Tooltip label="click to sync" withArrow color='gray'>
                <IconRefresh color='green' onClick={() => { setOpenDialog(true); setRenewalId(row?.original?.['loan_id']) }} />
              </Tooltip>
            </div>
        )
      },
    }, {
      key: 'action',
      header: 'Action',
      enableColumnFilter: false,
      cell: (value) => {
        if (isAllowed(currentUser.permissions, resources_id?.dashboard, action_id?.dashboard?.pdcChecklist)) {
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
      }
    },
  ]

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