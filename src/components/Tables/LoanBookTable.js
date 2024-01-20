import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { getLoanBookData } from '../../services/loans.service';
import { setLoanBook } from '../../store/loans/loans.actions';
import Currency from '../Number/Currency';

const useStyles = makeStyles(theme => ({
  root: {
  },
  title: {
    fontWeight: 500
  },
}));

const LoanBookTable = ({ title, loanBookData, setLoanBookData, view }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLoanBookData(view)
      .then(data => {
        setLoanBookData(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [view]);

  const columns = useMemo(() => {
    return [
      {
        label: 'Name',
        name: 'applicant_name',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Region',
        name: 'cust_region',
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        label: 'Customer Sales Area',
        name: 'cust_salesarea',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Customer Code',
        name: 'customer_code',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Disbursed Amount',
        name: 'disb_amt',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value} />
        }
      },
      {
        label: 'Disbursed Date',
        name: 'disb_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <div>
              {value || '-'}
            </div>
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
      {
        label: 'Due Date',
        name: 'due_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <div>
              {value || '-'}
            </div>
          }
        }
      },
      {
        label: 'EOD Date',
        name: 'eod_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <div>
              {value || '-'}
            </div>
          }
        }
      },
      {
        label: 'Int OverDue',
        name: 'int_overdue',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value} />
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
        label: 'Penal OverDue',
        name: 'penal_overdue',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value} />
        }
      },
      {
        label: 'Print Due',
        name: 'prin_due',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value} />
        }
      },
      {
        label: 'Prin OverDue',
        name: 'prin_overdue',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <Currency value={value} />
        }
      },
      {
        label: 'Prospect Code',
        name: 'prospectcode',
        options: {
          filter: false,
          sort: true,
        }
      },
    ]
  }, []);

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(loanBookData) && loanBookData.length ? (
          <MUIDataTable
            title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} ({loanBookData.length})</Typography> : null}
            data={loanBookData}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }} >No Loan Book Records</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }

    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loanBookData: loans.loanBook
});

const mapDispatchToProps = dispatch => ({
  setLoanBookData: (data) => dispatch(setLoanBook(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoanBookTable);