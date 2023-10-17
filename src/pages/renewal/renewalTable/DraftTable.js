import { Button, Tooltip, Dialog, DialogContent, DialogContentText, makeStyles, } from '@material-ui/core';
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


const DraftTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const pageDetailsQuery = useQuery({
    queryKey: ['renewal_draftRecordCount', filterQry, search],
    queryFn: () => getPageDetails('draft', filterQry),
  })

  useEffect(() => {
    setLoading(true);
    getRenewalLoanByStatus('draft', filterQry, page, search)
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry, page, search])

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
        label: 'Type',
        name: 'product_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },
      {
        label: 'Region',
        name: 'region_name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => (<>{value ? value.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>)
        }

      },
      {
        label: 'Approved Amount',
        name: 'approved_amount',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
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
      },
      {
        label: 'Renewal Fee status',
        name: 'renewal_fee_payment_status',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
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
    // search: false,
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
          <Button
            color='primary'
            variant='contained'
            onClick={() => setOpenModal(true)}
          >
            Send Reminder
          </Button>
        </>
      );
    },
    customFooter: () => {
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
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'draft')
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
        title={title ? <Typography className={classes.title} variant="h4" component="h4">{title}</Typography> : null}
        data={loans}
        style={classes.tableStyle}
        columns={columns}
        options={options}
      />
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <InfoCircleOutlined style={{ fontSize: 48, color: '#f0ad4e', margin: 16, marginBottom: 20 }} />
            <Typography variant='h3'>Are you certain?</Typography>
          </div>
          <DialogContentText style={{ textAlign: 'center' }}>Were you planning to inform all the regional managers, dealers, and sales teams that their loan renewal is currently in progress?</DialogContentText>
        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 19 }}>
          <Button size='medium' variant='outlined' onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant='contained' size='medium' style={{ backgroundColor: '#f0ad4e', color: 'white', marginLeft: 16 }} onClick={handleReminder}>
            Yes
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default DraftTable;