import { Button, Tooltip, Dialog, DialogContent, DialogActions, Popover } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { List } from '@material-ui/icons';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DescriptionIcon from '@material-ui/icons/Description';
import SyncIcon from '@material-ui/icons/Sync';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../components/CommonComponents/CustomToken';
import MuiTableFooter from '../../components/CommonComponents/MuiTableFooter';
import SignRequestLayout from '../../components/Leegality/SignRequestLayout';
import Currency from '../../components/Number/Currency';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getEnhancementSync, getPageDetails } from '../../services/enhancement.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';


const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
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
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [pageData, setPageData] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    getEnhancementApprovedData();
  }, [filterQry, page, search])

  const handleClose = () => {
    setAnchorEl({});
  };

  const getEnhancementApprovedData = () => {
    getEnhancedLoanByStatus('approved', filterQry, page, search)
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }

  useEffect(() => {
    getPageDetails('approved', filterQry)
      .then((res) => {
        setPageData(res)
      })
      .catch((e) => console.log('getPageCountError >>>', e))
  }, [filterQry])


  const onDownloadClick = () => {
    downloadEnhancementData('approved', filterQry)
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

  const syncData = () => {
    getEnhancementSync(enhancementId)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        getEnhancementApprovedData()
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


  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership Id',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Name',
        name: 'dealership_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Old Product Type',
        name: 'old_product_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },

      {
        label: 'New Product Type',
        name: 'new_product_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => (<>{value ? value.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>)
        }

      },
      {
        label: 'Old loan Amount',
        name: 'old_loan_amount',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'right',
          }),
          setCellHeaderProps: () => ({
            align: 'right',
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'New Loan Amount',
        name: 'new_loan_amount',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'right',
          }),
          setCellHeaderProps: () => ({
            align: 'right',
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Sync',
        name: 'is_sync',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, r) => {
            return (
              value == 1 ?
                <Tooltip title='Already synced'>
                  <CheckCircleTwoToneIcon style={{ color: green[200] }} />
                </Tooltip> :
                <div>
                  <Tooltip title="click to sync">
                    <SyncIcon style={{ color: 'grey' }} onClick={() => { setOpenDialog(true); setEnhancementId(loans?.[r.rowIndex]['id']) }} />
                  </Tooltip>
                </div>
            )
          },
        }
      },
      {
        label: 'Documents',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, r) => {
            return (
              loans?.[r.rowIndex]['is_document_signed'] ? (
                <CustomToken label={'Signed'} variant="success" icon="tick" />
              ) : (
                <>
                  <Tooltip title={'Click to view Documents'}>
                    <IconButton size="small" color="primary" aria-label="application" onClick={(e) => setAnchorEl({ document: e.currentTarget, value, r })} ><List /></IconButton>
                  </Tooltip>
                </>
              )
            )
          }
        }
      }
    ]
  }, [loans]);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => true,
    rowsPerPage: 10,
    filter: false,
    print: false,
    sort: false,
    download: false,
    viewColumns: false,
    searchPlaceholder: 'Search by dealreship ID/Name',
    onSearchChange: (searchText) => {
      setSearch(searchText)
    },
    customToolbar: () => {
      return (
        <>
          <Tooltip title="Download">
            <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={onDownloadClick}></Button>
          </Tooltip>
        </>
      );
    },
    customFooter: () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MuiTableFooter
            totalCount={pageData?.total_number_of_pages}
            pageSize={10}
            onPageChange={(value) => { setPage(value) }}
          />
        </div>
      )
    },
    onCellClick: (colData, cellMeta) => {
      if ((cellMeta.colIndex !== 8) && (cellMeta.colIndex !== 7)) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'approved')
      }
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <MUIDataTable
        title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} ({loans.length})</Typography> : null}
        data={loans}
        style={classes.tableStyle}
        columns={columns}
        options={options}
      />
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
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
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(loans?.[anchorEl?.r?.rowIndex]['id']); setDealershipId(anchorEl?.value); setType('sanction'); setModalVisible(true); }}>
            <div className={classes.listIcon}>
              <DescriptionIcon style={{ width: 19, color: 'blue' }} />
            </div>
            <Typography>Sanction Letter</Typography>
          </div>
          {loans?.[anchorEl?.r?.rowIndex?.enhancement_category] != 'decrease' ?
            <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(loans?.[anchorEl?.r?.rowIndex]['id']); setDealershipId(anchorEl?.value); setType('agreement'); setModalVisible(true); setLoanAmount(loans?.[anchorEl?.r?.rowIndex]['amount_approved']); setProductTypeId(loans?.[anchorEl?.r?.rowIndex]['product_id']) }}>
              <div className={classes.listIcon} >
                <LoanAgreementIcon width={12} style={{ color: 'blue' }} />
              </div>
              <Typography>Loan Agreement</Typography>
            </div> : null
          }
          <div className={classes.listItem} style={{ padding: '3px 0' }} onClick={() => { setAnchorEl({}); setloanId(loans?.[anchorEl?.r?.rowIndex]['id']); setType('application'); setDealershipId(anchorEl?.value); setModalVisible(true); }}>
            <div className={classes.listIcon} style={{ marginLeft: '2px', width: '18px' }}>
              <ESignIcon width={17} style={{ color: 'blue' }} />
            </div>
            <Typography>eSign Application</Typography>
          </div>
          <div className={classes.listItem} onClick={() => { setAnchorEl({}); setloanId(loans?.[anchorEl?.r?.rowIndex]['id']); setType('loc'); setDealershipId(anchorEl?.value); setModalVisible(true); }}>
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