import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIcon from '@material-ui/icons/Assignment';
// import CloseIcon from '@material-ui/icons/Close';
// import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Paper from '@material-ui/core/Paper';
// import Button from "@material-ui/core/Button";
// import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
// import moment from 'moment';
import clsx from 'clsx';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import Currency from '../Number/Currency';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import PdfViewer from '../CommonComponents/PdfViewer/PdfViewer';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';

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
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const SubmittedTable = ({ title, loans, setLoansData, onRowClick }) => {
  const classes = useStyles();
  // const [ data, setData ] = useState([]);
  const [loanId, setloanId] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  useMount(() => {
    if (!loans || !loans.length) {
      getLoansByStatus('submitted')
        .then(data => {
          setLoansData('submitted', data);
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
        label: 'Type',
        name: 'type',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value.charAt(0)}</span>
        }
      },
      {
        label: 'Req. Amount',
        name: 'amount_requested',
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
        label: 'Req. Date',
        name: 'created_date',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: value => {
            // moment(new Date(value)).format('DD MMM, YYYY')
            return <div>
              {/* {value ? moment(new Date(value)).format('DD MMM, YYYY') : '-'} */}
              {value ? value : '-'}
            </div>
          }
        }
      },
      {
        label: 'Documents',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, r) => {
            return (
              <Tooltip title="eSign Application">
                <IconButton size="small" color="primary" aria-label="application" onClick={() => {  setloanId(loans?.[r.rowIndex]['id']); setDealershipId(value); setModalVisible(true); }}>
                  <div>
                    <ESignIcon width={24} />
                    {/* <img
                      alt="Under development"
                      src={eSign}
                    /> */}
                  </div>
                </IconButton>
              </Tooltip>
            )
          }
        }
      }
    ]
  }, [loans]);

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    // downloadOptions: {
    //   customCSVdata: loans,
    // },
    // onRowClick: (rowData, { dataIndex }) => {
    //   // console.log(rowData, rowMeta);
    //   onRowClick(loans[dataIndex].dealership_id, 'submitted')
    // }
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
        ) : <Paper style={{ padding: 10 }}>No Submitted Records</Paper>
      }

      <SignRequestLayout
        open={modalVisible}
        dealershipId={dealershipId}
        loanId={loanId}
        title={'eSign Application Form'}
        onClose={() => setModalVisible(false)}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.submitted
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmittedTable);