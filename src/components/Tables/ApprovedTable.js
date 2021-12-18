import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import Currency from '../Number/Currency';
// import { URL } from '../../config/serverUrls';
// import CircularProgress from '@material-ui/core/CircularProgress';



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
  anchorTag: {
    textDecoration: 'none',
    color: '#d35178',
  },
}));

const ApprovedTable = ({ title, loans, setLoansData, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [loanAmount, setLoanAmount] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');

  useEffect(() => {
    setLoading(true);
    getLoansByStatus('approved', filterQry)
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])


  // useMount(() => {
  //   if (!loans || !loans.length) {
  //     setLoading(true);
  //     getLoansByStatus('approved')
  //       .then(data => {
  //         setLoansData('approved', data);
  //         setLoading(false);
  //       })
  //       .catch(e => {
  //         setLoading(false);
  //       })
  //   }
  // });

  const getLoansTable = () => {
    setLoading(true);
    getLoansByStatus('approved')
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }

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
        label: 'Approved Amount',
        name: 'amount_approved',
        options: {
          filter: false,
          sort: true,
          // setCellProps: () => ({
          //   align: 'right',
          // }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Approved Date',
        name: 'loan_approved_rejected_date',
        options: {
          filter: false,
          sort: true,
          // setCellProps: () => ({
          //   align: 'center',
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
        label: 'Approved by',
        name: 'approver',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase() || '-'}</>
          },
        }
      },
      {
        label: 'Documents',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, r) => {
            return (
              <>
                <Tooltip title="Sanction Letter">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['id']); setDealershipId(value); setType('sanction'); setModalVisible(true); }}>
                    <DescriptionIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Loan Agreement">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['id']); setDealershipId(value); setType('agreement'); setModalVisible(true); setLoanAmount(loans?.[r.rowIndex]['amount_approved'])}}>
                    <LoanAgreementIcon width={14} />
                  </IconButton>
                </Tooltip>
              </>
              // <a className={classes.anchorTag} href={`${URL.base}loans/sanction/${tableMeta.rowData[0]}`} download={'Sanction_Letter'}>
              //   <Tooltip title='Sanction Letter'>
              //     <GetAppOutlinedIcon style={{ width: '20px' }}> </GetAppOutlinedIcon>
              //   </Tooltip>
              // </a>
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
    onCellClick: (colData, cellMeta) => {
      if (cellMeta.colIndex !== 7) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'approved')
      }
    },
    // onRowClick: (rowData, { dataIndex }) => {
    //   // console.log(rowData, rowMeta);
    //   onRowClick(loans[dataIndex].dealership_id, loans[dataIndex], 'approved')
    // }
  };
  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length !== 0 ? (
          <MUIDataTable
            title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} ({loans.length})</Typography> : null}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No Approved Applications</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
      <SignRequestLayout
        open={modalVisible}
        dealershipId={dealershipId}
        loanId={loanId}
        loanAmount={loanAmount}
        type={type}
        title={'Sanction Letter'}
        onClose={() => setModalVisible(false)}
        callback={getLoansTable}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.approved
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovedTable);