import { Button, Tooltip, Dialog, DialogContent, DialogActions, Popover } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { List } from '@material-ui/icons';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import DescriptionIcon from '@material-ui/icons/Description';
import SyncIcon from '@material-ui/icons/Sync';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState, } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../components/CommonComponents/CustomToken';
import SignRequestLayout from '../../components/Leegality/SignRequestLayout';
import Currency from '../../components/Number/Currency';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getEnhancementSync, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';


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


const ApprovedTable = ({ title, onRowClick, filterQry, currentUser, actionable }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [type, setType] = useState('');
  const [loanId, setloanId] = useState();
  const [enhancementId, setEnhancementId] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [dealershipId, setDealershipId] = useState();
  const [openDialog, setOpenDialog] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState({});
  const documentPopover = Boolean(anchorEl?.document);
  const documentId = documentPopover ? 'document-popover' : undefined;

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data-approved', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('approved', filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination-approved', filterQry],
    queryFn: () => getPageDetails('approved', filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: 'enhancement-download-approved',
    queryFn: () => downloadEnhancementData('approved', filterQry),
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

  const handleClose = () => {
    setAnchorEl({});
  };

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
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
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
            <Tooltip title='Already synced'>
              <CheckCircleTwoToneIcon style={{ color: green[200] }} />
            </Tooltip> :
            <div>
              <Tooltip title="click to sync">
                <SyncIcon style={{ color: 'grey' }} onClick={() => { setOpenDialog(true); setEnhancementId(row?.original?.['id']) }} />
              </Tooltip>
            </div>
        )
      }
    }, {
      key: 'action',
      header: 'Documents',
      isHeaderDownload: false,
      cell: ({ row }) => {
        return (
          row?.original?.['is_document_signed'] ? (
            <CustomToken label={'Signed'} variant="success" icon="tick" />
          ) : (
            <>
              <Tooltip title={'Click to view Documents'}>
                <IconButton size="small" color="primary" aria-label="application" onClick={(e) => setAnchorEl({ document: e.currentTarget, value: row?.original?.dealership_id, r: row?.original })} ><List /></IconButton>
              </Tooltip>
            </>
          )
        )
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
  //           totalCount={pageData?.total_number_of_pages}
  //           pageSize={10}
  //           onPageChange={(value) => { setPage(value) }}
  //         />
  //       </div>
  //     )
  //   },
  //   onCellClick: (colData, cellMeta) => {
  //     if ((cellMeta.colIndex !== 8) && (cellMeta.colIndex !== 7)) {
  //       onRowClick(getEnhancementDataQuery?.data[cellMeta.dataIndex].dealership_id, getEnhancementDataQuery?.data[cellMeta.dataIndex], 'approved')
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
        count={getEnhancementDataQuery?.data?.length}
        rowData={getEnhancementDataQuery?.data}
        column={column}
        onRowClick={i => onRowClick(i.dealership_id, i, 'approved')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={getEnhancementPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        columnsFilter={false}
        loading={getEnhancementDataQuery?.isLoading}
        excelDownload
        downloadQuery={{ query: enhancementDownloadQuery?.refetch, isLoading: enhancementDownloadQuery?.isFetching }}
      />
      <Dialog fullWidth maxWidth="md" open={modalVisible} onClose={() => setModalVisible(false)}>
        <SignRequestLayout
          dealershipId={dealershipId}
          loanId={loanId}
          loanAmount={loanAmount}
          productId={productTypeId}
          getStatus={true}
          type={type}
          title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter of Continuity' : 'Sanction Letter'}
          onClose={() => setModalVisible(false)}
          currentUser={currentUser}
        />
      </Dialog>
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

      <Popover
        id={documentId}
        open={documentPopover}
        anchorEl={anchorEl?.document}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.itemLists}>
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['loan_id']); setDealershipId(anchorEl?.value); setType('sanction'); setModalVisible(true); }}>
            <div className={classes.listIcon}>
              <DescriptionIcon style={{ width: 19, color: 'blue' }} />
            </div>
            <Typography>Sanction Letter</Typography>
          </div>
          {getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex?.enhancement_category] != 'decrease' ?
            <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['loan_id']); setDealershipId(anchorEl?.value); setType('agreement'); setModalVisible(true); setLoanAmount(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['current_loan_amount']); setProductTypeId(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['new_product_id']) }}>
              <div className={classes.listIcon} >
                <LoanAgreementIcon width={12} style={{ color: 'blue' }} />
              </div>
              <Typography>Loan Agreement</Typography>
            </div> : null
          }
          <div className={classes.listItem} style={{ padding: '3px 0' }} onClick={() => { setAnchorEl({}); setloanId(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['loan_id']); setType('application'); setDealershipId(anchorEl?.value); setModalVisible(true); }}>
            <div className={classes.listIcon} style={{ marginLeft: '2px', width: '18px' }}>
              <ESignIcon width={17} style={{ color: 'blue' }} />
            </div>
            <Typography>eSign Application</Typography>
          </div>
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['loan_id']); setType('loc'); setDealershipId(anchorEl?.value); setModalVisible(true); setLoanAmount(getEnhancementDataQuery?.data?.[anchorEl?.r?.rowIndex]['current_loan_amount']); }}>
            <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
              <AssignmentIcon style={{ width: 19, color: 'blue' }} />
            </div>
            <Typography>Letter Of Continuity</Typography>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default ApprovedTable;