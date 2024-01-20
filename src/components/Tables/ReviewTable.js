import { Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import Currency from '../Number/Currency';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3),
    // paddingTop: 0,
  },
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '500',
    minWidth: '30px',
    textAlign: 'center',
  },
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  }
}));

const ReviewerTable = ({ title, loans, setLoansData, onRowClick, filterQry }) => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    // if (!loans || !loans.length) {
    setLoading(true);
    getLoansByStatus('loan_review', filterQry)
      .then(data => {
        setLoansData('loan_review', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
    // }
  }, [filterQry]);
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
        name: 'name',
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
        name: 'type',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => (<>{value ? value.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>)
        }

      },
      {
        label: 'Req. Amount',
        name: 'amount_requested',
        options: {
          filter: false,
          sort: true,
          // setCellProps: () => ({
          //   align: 'right',
          // }),
          customBodyRender: value => <Currency value={value} />
        }
      },
      {
        label: 'Req. Date',
        name: 'modified_date',
        options: {
          filter: false,
          sort: true,
          // setCellProps: () => ({
          //   align: 'left',
          // }),
          customBodyRender: value => {
            return <div>
              {value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}
              {/* {value ? value : '-'} */}
            </div>
          }
        }
      },
      {
        label: 'Reviewer',
        name: 'reviewer',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <>{value?.toUpperCase() || '-'}</>
          }
        }
      }
    ]
  }, []);

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(loans[dataIndex].dealership_id, loans[dataIndex], 'loan_review')
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} ({loans.length})</Typography> : null}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }} >No Pending loans for Review</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.loan_review
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewerTable);