import { makeStyles, } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
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
import { Button, Group, Modal, Text, } from '@mantine/core';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';


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
}));


const DraftTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const pageDetailsQuery = useQuery({
    queryKey: ['renewal_draftRecordCount', filterQry, search],
    queryFn: () => getPageDetails('draft', filterQry),
  });

  const getRenewalDataQuery = useQuery({
    queryKey: ['renewal_draft', filterQry, page, search],
    queryFn: () => getRenewalLoanByStatus('draft', filterQry, page, search),
  });

  const renewalDownloadQuery = useQuery({
    queryKey: 'renewal-download-draft',
    queryFn: () => downloadRenewalData('draft', filterQry),
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
    sendRenewalReminder('draft')
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

  const onDownloadClick = () => {
    downloadRenewalData('draft', filterQry)
      .then(data => {
        getSignedUrl(data[0]?.url)
          .then((res) => {
            window.open(res?.url, '_blank');
          })
          .catch(e => {
            enqueueSnackbar(e, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          })
      })
      .catch(e => {
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
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'new_product_name',
      header: 'Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'new_loan_amount',
      header: 'Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'renewal_month',
      header: 'Month Of Renewal',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    }, {
      key: 'renewal_fee_payment_status',
      header: 'Renewal Fee Status',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    },
  ]

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => true,
  //   rowsPerPage: 10,
  //   filter: false,
  //   print: false,
  //   sort: false,
  //   download: false,
  //   // search: false,
  //   viewColumns: false,
  //   searchPlaceholder: 'Search by dealreship ID/Name',
  //   onSearchChange: (searchText) => {
  //     setSearch(searchText)
  //   },
  //   // customToolbar: () => {
  //   //   return (
  //   //     <>
  //   //       <Tooltip label="Download" withArrow color='gray'>
  //   //         <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={onDownloadClick}></Button>
  //   //       </Tooltip>
  //   //       <Button
  //   //         color='primary'
  //   //         variant='contained'
  //   //         onClick={() => setOpenModal(true)}
  //   //       >
  //   //         Send Reminder
  //   //       </Button>
  //   //     </>
  //   //   );
  //   // },
  //   customFooter: () => {
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
  //     if (cellMeta.colIndex !== 7) {
  //       onRowClick(getRenewalDataQuery?.data[cellMeta.dataIndex].dealership_id, getRenewalDataQuery?.data[cellMeta.dataIndex], 'draft')
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
        rowData={getRenewalDataQuery?.data}
        column={column}
        title={title}
        onRowClick={i => onRowClick(i.dealership_id, i, 'draft')}
        page={page}
        setPage={setPage}
        loading={getRenewalDataQuery?.isLoading}
        useAPIPagination
        apiSearch={setSearch}
        totalNoOfPages={pageDetailsQuery?.data?.total_number_of_pages}
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
          <InfoCircleOutlined style={{ fontSize: 48, color: '#f0ad4e', margin: 16, marginBottom: 20 }} />
          <Typography variant='h3'>Are you certain?</Typography>
        </div>
        <Text ta={'center'}>Were you planning to inform all the regional managers, dealers, and sales teams that their loan renewal is currently in progress?</Text>
        <Group justify='center' gap={10} mt={'lg'}>
          <Button variant='outline' onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button color='green' onClick={handleReminder}>
            Yes
          </Button>
        </Group>
      </Modal>
    </div>
  )
}

export default DraftTable;