import { Button, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import Currency from '../../../components/Number/Currency';
import { downloadRenewalData, getPageDetails, getRenewalLoanByStatus } from '../../../services/renewal.service';
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


const ReviewTable = ({ title, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);

  const pageDetailsQuery = useQuery({
    queryKey: ['renewal_reviewRecordCount', filterQry, search],
    queryFn: () => getPageDetails('review', filterQry),
  })

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
        window.open(data[0]?.url, '_blank')
      })
      .catch(e => console.log('Download error >>>', e))
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
        label: 'Req. Amount',
        name: 'requested_amount',
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
    filter:false,
    print:false,
    download:false,
    sort:false,
    viewColumns:false,
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
    </div>
  )
}

export default ReviewTable;