import React, { useState, useMemo } from 'react'
import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
import Currency from '../../../components/Number/Currency';
import usePageTitle from '../../../hooks/usePageTitle';
import { getPassbookDetails } from '../../../services/common.service';
import { getDealerDetails } from '../../../services/dealers.service';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import DisbursementApprovedTable from '../../../components/Tables/DisbursementApprovedTable';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
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
          .then((data) => {
            setData(data)
            setLoading(false)
          })
          .catch((e) => {
            setLoading(false)
            console.log(e);
          });
      })
      .catch((e) => {
        setLoading(false)
        console.log(e);
      });
  });
  const columns = useMemo(() => {
    return [
      { name: 'cust_code', label: 'Dealership ID' },
      { name: 'narrative', label: 'Payment Details' },
      {
        name: 'trans_date',
        label: 'Date',
        options: {
          filter: false,
          customBodyRender: value => {
            return <div style={{ width: 80 }}>
              {value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}
            </div>
          }
        }
      },
      {
        name: 'disbursement',
        label: 'Credit',
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
        label: 'Debit',
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
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],

  };
  usePageTitle("Passbook")
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
                title={"Transaction Details"}
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