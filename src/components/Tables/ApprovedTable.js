import React, { useMemo, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import { useMount } from 'react-use';
import Paper from '@material-ui/core/Paper';
// import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import Currency from '../Number/Currency';
// import { URL } from '../../config/serverUrls';
import SignRequestLayout from '../Leegality/SignRequestLayout';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';


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

const ApprovedTable = ({ title, loans, setLoansData, onRowClick }) => {
  const classes = useStyles();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  useMount(() => {
    if (!loans || !loans.length) {
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
        label: 'Type',
        name: 'type',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value.charAt(0)}</span>
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
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
                <Tooltip title="Sanction Letter">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setDealershipId(value); setModalVisible(true); }}>
                    <DescriptionIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Loan Agreement">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setDealershipId(value); setModalVisible(true); }}>
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
  }, []);

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    // onRowClick: (rowData, { dataIndex }) => {
    //   // console.log(rowData, rowMeta);
    //   onRowClick(loans[dataIndex].dealership_id, 'approved')
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
        ) : <Paper style={{ padding: 10 }}>No Approved Applications</Paper>
      }

      <SignRequestLayout
        open={modalVisible}
        dealershipId={dealershipId}
        title={'eSign Application Form'}
        onClose={() => setModalVisible(false)}
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