import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DescriptionIcon from '@material-ui/icons/Description';
import SyncIcon from '@material-ui/icons/Sync';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../../components/CommonComponents/CustomToken';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import SignRequestLayout from '../../../components/Leegality/SignRequestLayout';
import Currency from '../../../components/Number/Currency';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { ReactComponent as ESignIcon } from '../../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../../icons/loan_agreement.svg';
import { getSignedUrl } from '../../../services/common.service';
import { downloadRenewalData, getPageDetails, getRenewalLoanByStatus, syncRenewalData } from '../../../services/renewal.service';
import { dateCustomSort } from '../../../utils/commonFunctions.util';

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


const ReviewTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loanId, setloanId] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const actionable = !permissionCheck(currentUser?.role_name, rulesList?.external_view);
  const [openDialog, setOpenDialog] = useState(false);
  const [renewalId, setRenewalId] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const pageDetailsQuery = useQuery(
    ['renewal_approvedRecordCount', filterQry, search],
    () => getPageDetails('approved', filterQry),
  );

  useEffect(() => {
    setLoading(true);
    getRenewalLoanByStatus('approved', filterQry, page, search)
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry, page, search])

  const onDownloadClick = () => {
    downloadRenewalData('approved', filterQry)
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
    syncRenewalData({renewal_application_id: renewalId})
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
      }, {
        label: 'Name',
        name: 'dealership_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      }, {
        label: 'Old Product Type',
        name: 'old_product_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      }, {
        label: 'New Product Type',
        name: 'new_product_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      }, {
        label: 'Region',
        name: 'region',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => (<>{value ? value.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>)
        }
      }, {
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
      }, {
        label: 'Month of renewal',
        name: 'renewal_month',
        options: {
          filter: true,
          filterWidth: '100%',
          sort: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: value => {
            return <div>{value ? moment(new Date(value), 'YYYY-MM-DD').format('MMM, YY') : '-'}</div>
          } 
        }
      }, {
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
                    <SyncIcon style={{ color: 'grey' }} onClick={() => { setOpenDialog(true); setRenewalId(loans?.[r.rowIndex]['loan_id']) }} />
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
          display: actionable ? true : 'excluded',
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, r) => {
            return (
              loans?.[r.rowIndex]['is_document_signed'] == 1 ? (
                <CustomToken label={'Renewed'} variant="success" icon="tick" />
              ) : (
                <div style={{ minWidth: 70 }}>
                  <Tooltip title="Sanction Letter">
                    <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['loan_id']); setLoanAmount(loans?.[r.rowIndex]['current_loan_amount']); setDealershipId(value); setType('sanction'); setModalVisible(true); }}>
                      <DescriptionIcon style={{ width: 19 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="eSign Application">
                    <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['loan_id']); setType('application'); setLoanAmount(loans?.[r.rowIndex]['current_loan_amount']); setDealershipId(value); setModalVisible(true); }}>
                      <ESignIcon width={17} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Loan Agreement">
                    <IconButton style={{ marginRight: 3 }} size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['loan_id']); setDealershipId(value); setType('agreement'); setModalVisible(true); setLoanAmount(loans?.[r.rowIndex]['current_loan_amount']); setProductTypeId(loans?.[r.rowIndex]['new_product_id']) }}>
                      <LoanAgreementIcon width={12} />
                    </IconButton>
                  </Tooltip>
                </div>
              ))
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
    download: false,
    sort: false,
    viewColumns: false,
    searchPlaceholder: 'Search by dealreship ID/Name',
    onSearchChange: (searchText) => {
      setSearch(searchText)
    },
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
      if (cellMeta.colIndex != 8 && cellMeta.colIndex != 7) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'approved')
      }
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
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <MUIDataTable
        title={title ? <Typography className={classes.title} variant="h4" component="h4">{title}</Typography> : null}
        data={loans}
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
          getStatus={true}
          title={type === 'application' ? 'eSign Application Form' : 'Sanction Letter'}
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
    </div>
  )
}

export default ReviewTable;