import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
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
    fontWeight: '600',
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

const DisbursedTable = ({ title, loans, setLoansData, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLoansByStatus('disbursed', filterQry)
      .then(data => {
        setLoansData('disbursed', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])

  // useMount(() => {
  //   if (!loans || !loans.length) {
  //     setLoading(true);
  //     getLoansByStatus('disbursed')
  //       .then(data => {
  //         setLoansData('disbursed', data);
  //         setLoading(false);
  //       })
  //       .catch(e => {
  //         setLoading(false);
  //       })
  //   }
  // });
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
        label: 'Customer code',
        name: 'applicant_code',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <>{value}</>
          },
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
        label: 'Sanctioned Amount',
        name: 'amount_approved',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Sanctioned Date',
        name: 'loan_approved_rejected_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <div>{value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}</div>
          }
        }
      },

      {
        label: 'Disbursed Amount',
        name: 'amount_disbursed',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Disbursed Date',
        name: 'loan_disbursed_date',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: value => {
            return <div>
              {value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}
              {/* {value ? value : '-'} */}
            </div>
          }
        }
      }
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(loans[dataIndex].dealership_id, loans[dataIndex], 'disbursed')
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 7
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
        ) : (!loading && <Paper style={{ padding: 10 }}>No Disbursed Loans</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.disbursed
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DisbursedTable);