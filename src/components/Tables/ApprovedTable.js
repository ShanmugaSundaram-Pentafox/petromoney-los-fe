import React, { useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Typography from '@material-ui/core/Typography';
import { useMount } from 'react-use';
// import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import Currency from '../Number/Currency';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    minWidth: '80px',
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

const ApprovedTable = ({ title, loans, setLoansData, onRowClick }) => {
  const classes = useStyles();

  useMount(() => {
    if(!loans || !loans.length) {
      getLoansByStatus('approved')
        .then(data => {
          setLoansData('approved', data);
        })
        .catch(e => null)
    }
  });
  
  const columns = useMemo(() => {
    return [
      {
        label: 'Delaership Id',
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
          sort: true
        }
      },
      {
        label: 'Loan Type',
        name: 'type',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <div className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</div>
        }
      },
      {
        label: 'Approved Amount',
        name: 'amount_approved',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'right',
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Approved Date',
        name: 'loan_approved_rejected_date',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: value => {
            return <div>
              {value ? moment(new Date(value)).format('DD MMM, YYYY') : '-'}
            </div>
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
      // console.log(rowData, rowMeta);
      onRowClick(loans[dataIndex].dealership_id, 'approved')
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
        ) : <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.approved
});

const mapDispatchToProps = dispatch => ({
  setLoansData : (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovedTable);