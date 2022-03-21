import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import usePageTitle from '../../hooks/usePageTitle';
import { getDpdReportData } from '../../services/loans.service';
import Currency from '../Number/Currency';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  tableHead: {
    '&.MuiTableCell-root.MuiTableCell-body': {
      backgroundColor: '#eee',
      position: 'sticky',
      left: 0
    },
    fontSize: 10
  },
  item: {
    fontSize: 10
  },
  horizondalTable: {
    width: '100%',
    overflow: 'auto',
    marginTop: 15
  }
}));

const DpdReport = ({ title, currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dpdReportData, setDpdReportData] = useState()
  usePageTitle('Report')

  useMount(() => {
    setLoading(true);
    getDpdReportData()
      .then(data => {
        setDpdReportData(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  });

  const columns = useMemo(() => {
    return [
      {
        label: 'Cust Name',
        name: 'customer_name',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Prospect Code',
        name: 'prospectcode',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Applicant Code',
        name: 'applicantcode',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        label: 'Disbursal Date',
        name: 'disbursaldate',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Due Date',
        name: 'due_date',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'DPD',
        name: 'days_past_due',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: value => {
            if(value >= 0){
              return(<span style={{color:'#FC4F4F'}}>{value}</span>)
            }else{
              return(<span>{value}</span>)
            }
          }
        }
      },
      {
        label: 'Last Receipt Date',
        name: 'last_receipt_date',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        label: 'Loan Amount',
        name: 'loanamount',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <strong><Currency value={value}/></strong>
        }
      },
      {
        label: 'Loan Status',
        name: 'loanstatusname',
        options: {
          filter: true,
          sort: true,
        }
      }
    ]
  }, []);

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    isRowSelectable: () => false,
  };

  return (
    <div className={classes.root}>
      {
        Array.isArray(dpdReportData) && dpdReportData.length ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h4" component="h4">Dpd Report ({dpdReportData.length})</Typography>}
            data={dpdReportData}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }} >No Dpd Records</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
    </div>
  )
}

export default DpdReport;