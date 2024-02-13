import { makeStyles, } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import Currency from '../../../components/Number/Currency';
import { getSignedUrl } from '../../../services/common.service';
import { downloadRenewalData, getPageDetails, getRenewalLoanByStatus, sendRenewalReminder } from '../../../services/renewal.service';
import { dateCustomSort } from '../../../utils/commonFunctions.util';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../../components/ReactTable/DataTableViewer';
import { Button, Modal, Group, Text, Tooltip } from '@mantine/core';
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


const ReviewTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const columnHelper = createColumnHelper();

  const pageDetailsQuery = useQuery({
    queryKey: ['renewal_reviewRecordCount', filterQry, search],
    queryFn: () => getPageDetails('review', filterQry),
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
    sendRenewalReminder('review')
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

  useEffect(() => {
    setLoading(true);
    getRenewalLoanByStatus('review', filterQry, page, search)
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry, page, search])

  const onDownloadClick = () => {
    downloadRenewalData('review', filterQry)
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
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('dealership_name', {
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('old_product_name', {
      header: 'Old Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('new_product_name', {
      header: 'New Scheme',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }),
    columnHelper.accessor('new_loan_amount', {
      header: 'Disbursed Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('renewal_month', {
      header: 'Month Of Renewal',
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue()), 'YYYY-MM-DD').format('MMM, YY') : '-'}</span>
    })
  ]

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => true,
    rowsPerPage: 10,
    filter: false,
    print: false,
    download: false,
    sort: false,
    viewColumns: false,
    searchPlaceholder: 'Search by dealreship ID/Name',
    onSearchChange: (searchText) => {
      setSearch(searchText)
    },
    // customToolbar: () => {
    //   return (
    //     <>
    //       <Tooltip label="Download" withArrow color='gray'>
    //         <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={onDownloadClick}></Button>
    //       </Tooltip>
    //       <Button
    //         color='primary'
    //         variant='contained'
    //         onClick={() => setOpenModal(true)}
    //       >
    //         Send Reminder
    //       </Button>
    //     </>
    //   );
    // },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MuiTableFooter
            totalCount={pageDetailsQuery?.data?.total_number_of_pages}
            pageSize={10}
            onPageChange={(value) => { setPage(value) }}
          />
        </div>
      )
    },
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex !== 7) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'review')
      }
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <>
      <DataTableViewer
        rowData={loans}
        column={column}
        title={title}
        onRowClick={i => onRowClick(i.dealership_id, i, 'review')}
        useAPIPagination
        page={page}
        setPage={setPage}
        totalNoOfPages={pageDetailsQuery?.data?.total_number_of_pages}
        filter={false}
        action={<Button size='xs' onClick={() => setOpenModal(true)}>Send Reminder</Button>}
        downloadQuery={{ query: renewalDownloadQuery?.refetch, isLoading: renewalDownloadQuery?.isFetching }}
        excelDownload
      />
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
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
    </>
  )
}

export default ReviewTable;