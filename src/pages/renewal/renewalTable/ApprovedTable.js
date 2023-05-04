import { Dialog } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import MuiTableFooter from '../../../components/CommonComponents/MuiTableFooter';
import SignRequestLayout from '../../../components/Leegality/SignRequestLayout';
import Currency from '../../../components/Number/Currency';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { ReactComponent as ESignIcon } from '../../../icons/e-sign.svg';
import CheckAllowed from '../../../pages/rbac/CheckAllowed';
import { getPageDetails, getRenewalLoanByStatus } from '../../../services/renewal.service';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState();
  const [pageData, setPageData] = useState();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const actionable = !permissionCheck(currentUser?.role_name, rulesList?.external_view);

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

  useEffect(() => {
    getPageDetails('approved')
      .then((res) => {
        setPageData(res)
      })
      .catch((e) => console.log('getPageCountError >>>', e))
  }, [])

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
          filter: true,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },
      {
        label: 'Region',
        name: 'region_name',
        options: {
          filter: true,
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
            return <div>
              {value ? value : '-'}
            </div>
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
      {
        label: 'Documents',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: false,
          display: actionable ? true : 'excluded',
          customBodyRender: (value, r) => {
            return (
              <CheckAllowed currentUser={currentUser} resource={resources_id?.dashboard} action={action_id?.dashboard?.submitted_documents}>
                <Tooltip title="eSign Application">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['id']); setType('application'); setDealershipId(value); setModalVisible(true); }}>
                    <div>
                      <ESignIcon width={24} />
                    </div>
                  </IconButton>
                </Tooltip>
              </CheckAllowed>
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
    searchPlaceholder: 'Search by dealreship ID/Name',
    onSearchChange: (searchText) => {
      setSearch(searchText)
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
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
          type={type}
          title={'eSign Application Form'}
          onClose={() => setModalVisible(false)}
          currentUser={currentUser}
        />
      </Dialog>
    </div>
  )
}

export default ReviewTable;