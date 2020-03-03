import React, { useMemo } from 'react';
import { createStructuredSelector } from 'reselect';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Typography from '@material-ui/core/Typography';
import { selectAllLoans } from '../../../store/loans/loans.selector';
import { setAllLoans } from '../../../store/loans/loans.actions';
import { getAllLoans } from '../../../services/loans.service';
import Currency from '../../../components/Number/Currency';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  title: {
    fontWeight: 600
  }
}));
// {
//   "amount_approved":0
//   "amount_disbursed":0
//   "amount_requested":2300000
//   "commission":0.0
//   "created_date":"Thu
//    16 Jan 2020 18:00:02 GMT"
//   "dealership_id":11727030
//   "downpayment":0
//   "id":47
//   "insurance":0.0
//   "loan_approved_rejected_date":"0000-00-00 00:00:00"
//   "loan_disbursed_date":"0000-00-00 00:00:00"
//   "modified_date":"Tue
//    28 Jan 2020 13:56:57 GMT"
//   "need_microatm":0
//   "roi":18.0
//   "status":"SUBMITTED"
//   "tenure":15
//   "type":"FUEL"}

const convertToCurrency = value => <Currency value={value} />;

const LoansTable = ({ all_loans, setAllLoans }) => {
  const classes = useStyles();
  
  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          },
        }
      },
      {
        label: 'Requested',
        name: 'amount_requested',
        options: {
          filter: false,
          sort: true,
          align: 'right',
          customBodyRender: convertToCurrency,
        }
      },
      {
        label: 'Approved',
        name: 'amount_approved',
        options: {
          filter: false,
          sort: true,
          align: 'right',
          customBodyRender: convertToCurrency,
        }
      },
      {
        label: 'Disbursed',
        name: 'amount_disbursed',
        align: 'right',
        options: {
          filter: false,
          sort: true,
          customBodyRender: convertToCurrency,
        }
      },
      {
        label: 'Loan Type',
        name: 'type',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        label: 'Status',
        name: 'status',
        options: {
          filter: true,
          sort: true
        }
      }
    ]
  }, []);

  useMount(() => {
    if(!all_loans.length) {
      getAllLoans()
        .then(data => {
          setAllLoans(data);
        })
        .catch(e => null)
    }
  })

  const options = {
    filterType: 'checkbox',
    selectableRowsHeader: false,
    isRowSelectable: () => false
  };

  return (
    <div className={classes.root}>
      <MUIDataTable
        title={<Typography className={classes.title} variant="h5" component="h5">Loans</Typography>}
        data={all_loans}
        columns={columns}
        options={options}
      />
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  all_loans: selectAllLoans
});

const mapDispatchToProps = dispatch => ({
  setAllLoans : loans => dispatch(setAllLoans(loans))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoansTable);