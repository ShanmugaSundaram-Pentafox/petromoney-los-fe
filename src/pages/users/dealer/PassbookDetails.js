import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useState, useMemo } from 'react'
import { useMount } from 'react-use';
import Currency from '../../../components/Number/Currency';
// import usePageTitle from '../../../hooks/usePageTitle';
import { getPassbookDetails } from '../../../services/common.service';
import { getDealerDetails } from '../../../services/dealers.service';
const useStyles = makeStyles(theme => ({

  credit: {
    color: '#FA8072'
  },
  debit: {
    color: '#90EE90'
  }

}));


const PassbookDetails = ({ CurrentUser }) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  useMount(() => {
    setLoading(true)
    getDealerDetails()
      .then((data) => {
        const id = data.cust_details[0].cust_code
        getPassbookDetails(id)
          .then((res) => {
            setData(res?.data)
            setLoading(false)
          })
          .catch((e) => {
            setLoading(false)
          });
      })
      .catch((e) => {
        setLoading(false)
      });
  });
  const columns = useMemo(() => {
    return [
      { name: 'customer_id', label: 'Dealership ID' },
      { name: 'narrative', label: 'Payment Details' },
      {
        name: 'transaction_date',
        label: 'Date',
        options: {
          filter: false,
        }
      },
      {
        name: 'disbursement',
        label: 'Disbursement',
        options: {
          filter: false,
          sort: false,
          customBodyRender: value => {
            return <Currency value={value} />
          }
        }
      },
      {
        name: 'repayment',
        label: 'Repayment',
        options: {
          filter: false,
          sort: false,
          customBodyRender: value => {
            return (<Currency value={value} />)
          }
        }
      },
      {
        name: 'disbursement',
        label: ' ',
        options: {
          customBodyRender: value => <span>{value === 0 ? <div className={classes.credit}><CallMadeIcon /></div> : <div className={classes.debit}><CallReceivedIcon /></div>}</span>
        }
      },
    ]
  }, []);
  const options = {
    selectableRowsHeader: false,
    download: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],

  };
  // usePageTitle('Passbook')
  return (
    <>
      <div className={classes.root} >
        {
          loading ? (
            <Grid item xs={12}>
              <Skeleton variant="rect" width="100%" height={400} />
            </Grid>
          ) : (
            Array.isArray(data) && data.length ? (
              <MUIDataTable
                title={'Transaction Details'}
                data={data}
                columns={columns}
                options={options}
              />
            ) : <Paper style={{ padding: 10 }}>No details found</Paper>
          )
        }
      </div>
    </>

  )
}
export default PassbookDetails;