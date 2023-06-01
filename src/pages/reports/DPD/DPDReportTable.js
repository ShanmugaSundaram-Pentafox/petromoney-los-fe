import { Button, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import Currency from '../../../components/Number/Currency';
import { getDpdPageDetails, getDpdReportData, } from '../../../services/report.service';
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


const DpdReportTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);

  const pageDetailsQuery = useQuery({
    queryKey: ['dpd_pageCount', filterQry,page, search],
    queryFn: () => getDpdPageDetails(filterQry,page, search),
  })

  useEffect(() => {
    setLoading(true);
    getDpdReportData(filterQry, page, search, download)
      .then(({ data, report_url }) => {
        setLoans(data);
        if (report_url) {
          window.open(report_url, '_blank')
        }
        setDownload(false);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry, page, search, download])

  const columns = useMemo(() => {
    return [
      {
        label: 'Customer Code',
        name: 'customer_code',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Prospect Code',
        name: 'prospect_code',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Customer Name',
        name: 'customer_name',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({ style: { minWidth: '200px', maxWidth: '200px' } }),
        }
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'OMC',
        name: 'omc',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Disbursal Date',
        name: 'disbursal_date',
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
        label: 'Due date',
        name: 'due_date',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: '100px', maxWidth: '100px' },
          }),
          customBodyRender: value => {
            return <div>{value ? moment(new Date(value), 'YYYY-MM-DD').format('MMM, YY') : '-'}</div>
          }
        }
      },
      {
        label: 'Loan Amount',
        name: 'loan_amount',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: '100px', maxWidth: '100px' },
            align: 'right'
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Principle Amount',
        name: 'principle_amount',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            style: { minWidth: '100px', maxWidth: '100px' },
            align: 'right'
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Loan status',
        name: 'loan_status',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Last Receipt Date',
        name: 'last_receipt_date',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({ style: { minWidth: '100px', maxWidth: '100px' } }),
          customBodyRender: value => {
            return <div>{value ? moment(new Date(value), 'YYYY-MM-DD').format('MMM, YY') : '-'}</div>
          }
        }
      },
      {
        label: 'DPD',
        name: 'dpd',
        options: {
          filter: false,
          sort: true,
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
    viewColumns: false,
    searchPlaceholder: 'Search by dealreship ID/Name',
    onSearchChange: (searchText) => {
      setSearch(searchText)
    },
    customToolbar: () => {
      return (
        <>
          <Tooltip title="Download">
            <Button style={{ marginTop: 0 }} size='small' startIcon={<CloudDownloadIcon style={{ width: 24, height: 24, color: '#525252' }} color="#f5f5f5" />} onClick={() => setDownload(true)}></Button>
          </Tooltip>
        </>
      );
    },
    customFooter: () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MuiTableFooter
            totalCount={pageDetailsQuery?.data}
            pageSize={10}
            onPageChange={(value) => { setPage(value) }}
          />
        </div>
      )
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
    </div>
  )
}

export default DpdReportTable;