import { Button, Tooltip, Dialog, DialogContent, DialogActions } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
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
import MuiTableFooter from '../../components/CommonComponents/MuiTableFooter';
import SignRequestLayout from '../../components/Leegality/SignRequestLayout';
import Currency from '../../components/Number/Currency';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { downloadEnhancementData, getEnhancedLoanByStatus, getEnhancementSync, getPageDetails } from '../../services/enhancement.service';
import { getLoansByStatus } from '../../services/loans.service';
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
  const [loansData, setLoansData] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [dealershipId, setDealershipId] = useState();
  const [openDialog, setOpenDialog] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    getEnhancementApprovedData();
  }, [filterQry, page, search])

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
        window.open(data[0]?.url, '_blank')
      })
      .catch(e => console.log('Download error >>>', e))
  }

  const getLoansTable = () => {
    setLoading(true);
    getLoansByStatus('approved')
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }

  const syncData = (enhancementId) => {
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
                    <SyncIcon style={{ color: 'grey' }} onClick={() => setOpenDialog(true)} />
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
              <div style={{ minWidth: 70 }}>
                <Tooltip title="Sanction Letter">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['id']); setLoanAmount(loans?.[r.rowIndex]['enhancement_amount']); setDealershipId(value); setType('sanction'); setModalVisible(true); }}>
                    <DescriptionIcon style={{ width: 19 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="eSign Application">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['id']); setType('application'); setLoanAmount(loans?.[r.rowIndex]['enhancement_amount']); setDealershipId(value); setModalVisible(true); }}>
                    <ESignIcon width={17} />
                  </IconButton>
                </Tooltip>
                {
                  loans?.[r.rowIndex]['enhancement_category'] != 'decrease' && (
                    <Tooltip title="Loan Agreement">
                      <IconButton style={{ marginRight: 3 }} size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['id']); setDealershipId(value); setType('agreement'); setModalVisible(true); setLoanAmount(loans?.[r.rowIndex]['amount_approved']); setProductTypeId(loans?.[r.rowIndex]['product_id']) }}>
                        <LoanAgreementIcon width={12} />
                      </IconButton>
                    </Tooltip>
                  )
                }
              </div>
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
          type={type}
          title={type === 'application' ? 'eSign Application Form' : 'Sanction Letter'}
          onClose={() => setModalVisible(false)}
          callback={getLoansTable}
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
    </div>
  )
}

export default ApprovedTable;