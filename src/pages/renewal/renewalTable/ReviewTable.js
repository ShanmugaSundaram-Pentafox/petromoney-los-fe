import clsx from 'clsx';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../../components/Number/Currency';
import { getSignedUrl } from '../../../services/common.service';
import { downloadRenewalData, getPageDetails, getRenewalLoanByStatus, sendRenewalReminder } from '../../../services/renewal.service';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { Button, Modal, Group, Text, Title, } from '@mantine/core';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { IconInfoCircle, IconSend } from '@tabler/icons-react';
import classes from './Renewal.module.css';
import COLORS from '../../../theme/colors';

const ReviewTable = ({ title, onRowClick, filterQry }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const pageDetailsQuery = useQuery({
    queryKey: ['renewal_reviewRecordCount', filterQry, search],
    queryFn: () => getPageDetails('review', filterQry),
  });

  const getRenewalDataQuery = useQuery({
    queryKey: ['renewal_review', filterQry, page, search],
    queryFn: () => getRenewalLoanByStatus('review', filterQry, page, search),
  });

  const renewalDownloadQuery = useQuery({
    queryKey: 'renewal-download-review',
    queryFn: () => downloadRenewalData('review', filterQry),
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

  const handleReminder = () => {
    sendRenewalReminder('review',filterQry,search)
      .then(res => {
        setOpenModal(false);
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch(e => {
        setOpenModal(false);
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
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
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>,
      sorting: true,
    },
  ]

  return (
    <>
      <DataTableViewer
        allowSorting={true}
        rowData={getRenewalDataQuery?.data}
        column={column}
        title={title}
        onRowClick={i => onRowClick(i.dealership_id, i, 'review')}
        useAPIPagination
        apiSearch={setSearch}
        loading={getRenewalDataQuery?.isLoading}
        page={page}
        setPage={setPage}
        totalNoOfPages={pageDetailsQuery?.data?.total_number_of_pages}
        totalNoOfRecords={pageDetailsQuery?.data?.total_number_of_records}
        filter={false}
        action={<Button size='xs' onClick={() => setOpenModal(true)}>Send Reminder</Button>}
        downloadQuery={{ query: renewalDownloadQuery?.refetch, isLoading: renewalDownloadQuery?.isFetching }}
        excelDownload
      />
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        centered
        size={'md'}
        shadow='lg'
        withCloseButton={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Group justify='center' mb={'md'}>
            <IconInfoCircle size={48} color={'#f0ad4e'} />
          </Group>
          <Title order={3}>Are you certain?</Title>
        </div>
        <Text ta={'center'}>Were you planning to inform all the regional managers, dealers, and sales teams that their loan renewal is currently in progress?</Text>
        <Group justify='center' gap={10} mt={'lg'}>
          <Button variant='outline' size='xs' onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button color='green' leftSection={<IconSend size={16} />} size='xs' onClick={handleReminder}>
            Send
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default ReviewTable;