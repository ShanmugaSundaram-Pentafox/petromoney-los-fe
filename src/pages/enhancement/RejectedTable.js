import { Button, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../components/CommonComponents/MuiTableFooter';
import Currency from '../../components/Number/Currency';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
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


const RejectedTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [pageData, setPageData] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEnhancedLoanByStatus('rejected', filterQry, page, search)
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry, page, search])

  useEffect(() => {
    getPageDetails('rejected', filterQry)
      .then((res) => {
        setPageData(res)
      })
      .catch((e) => console.log('getPageCountError >>>', e))
  }, [filterQry])


  const onDownloadClick = () => {
    downloadEnhancementData('rejected', filterQry)
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
            align: 'left',
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
            align: 'left',
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
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
      if (cellMeta.colIndex !== 7) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'rejected')
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
    </div>
  )
}

export default RejectedTable;