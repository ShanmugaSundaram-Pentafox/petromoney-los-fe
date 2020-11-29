import React, { useMemo, useState } from 'react';
import { createStructuredSelector } from 'reselect';
// import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
// import clsx from 'clsx';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
// import MUIDataTable from "mui-datatables";
import Grid from '@material-ui/core/Grid';
import { selectAllLoans } from '../../../store/loans/loans.selector';
import { setAllLoans } from '../../../store/loans/loans.actions';
import { getAllLoans, getDisbursementLoanData } from '../../../services/loans.service';
import Currency from '../../../components/Number/Currency';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
// import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { getDealershipById, getDealershipLoansById } from '../../../services/dealerships.service';
import { getDealersByDealershipId } from '../../../services/dealers.service';
import DealershipDetails from './DealershipDetails';
import SubmittedTable from '../../../components/Tables/SubmittedTable';
import ApprovedTable from '../../../components/Tables/ApprovedTable';
import DisbursedTable from '../../../components/Tables/DisbursedTable';
import ApprovalReqestTable from '../../../components/Tables/ApprovalReqestTable';
import DisbursementReqestTable from '../../../components/Tables/DisbursementReqestTable';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import DisbursementApprovedTable from '../../../components/Tables/DisbursementApprovedTable';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    // paddingTop: theme.spacing(0),
  },
  tableContainer: {
    borderRadius: 6,
    // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.12)',
    marginBottom: theme.spacing(3)
  },
  categoryContainer: {
    display: 'flex',
  },
  categoryCard: {
    flex: 1,
    marginRight: theme.spacing(3),
    '&:last-child': {
      marginRight: 0
    }
  },
  title: {
    fontWeight: 400,
    fontSize: 18,
    padding: 8,
    backgroundColor: "#a6b1e1"
  },
  cardItem: {
    padding: '14px 12px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f2f2f2',
    display: 'block',
    position: 'relative',
    transition: 'all .3s ease-in-out',
    '&:nth-child(even)': {
      backgroundColor: 'rgba(245, 245, 245, 0.33)'
    },
    '&:hover': {
      backgroundColor: 'rgba(235, 235, 235, 0.66)',
      cursor: 'pointer'
    },
  },
  invalid: {
    backgroundColor: '#faf2f2'
  },
  cardTitle: {
    paddingBottom: 12,
    fontSize: 16,
  },
  avatarWrapper: {
    position: 'absolute',
    top: 16,
    right: 16
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.35
  },
  infoSection: {
    display: 'flex',
    fontSize: 13,
    color: '#767676',
    justifyContent: 'space-between',
    paddingRight: 8
  },
  money: {
    color: '#333'
  },
  sidePanelWrapper: {
    width: '60vw',
    maxWidth: '80vw'
  }
}));

const convertToCurrency = value => <Currency value={value} />;

const LoansTable = ({ currentUser, all_loans, setAllLoans }) => {
  const classes = useStyles();
  const [showPanel, setShowPanel] = useState({
    status: false,
    data: ""
  });
  const [dealershipData, setDealershipData] = useState();
  const [loansData, setLoansData] = useState();
  // const [dealersData, setDealersData] = useState();
  
  const showDealershipInfo = (id, selectedLoanData, status) => {
    setLoansData(selectedLoanData);
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch(e => null);
    // getDealershipLoansById(id)
    //   .then(data => setLoansData(data))
    //   .catch(e => null)
  
    // getDealersByDealershipId(id)
    //   .then(data => setDealersData(data))
    //   .catch(e => null)

    setShowPanel({ status: true, data: status});
  }
  
  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            // return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
            return <div onClick={() => {
              setShowPanel({ stauts: true})
            }}>{value}</div>;
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

  const options = {
    elevation: 1,
    filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    // isRowSelectable: () => false
  };

  return (
    <div className={classes.root}>
      <UserCan
        role={currentUser.role_name}
        perform={rulesList.loan_approval}
        yes={() => (
          <>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Paper elevation={1} className={classes.tableContainer}>
                  <ApprovalReqestTable title={"Pending for Approval"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                </Paper>
              </Grid>
              <Grid item md={6}>
                <Paper elevation={1} className={classes.tableContainer}>
                  <DisbursementReqestTable title={"Pending for Disbursement Approval"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                </Paper>
              </Grid>
            </Grid>
            <Paper elevation={1} className={classes.tableContainer}>
              <SubmittedTable title={"Submitted Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
            <Paper elevation={1} className={classes.tableContainer}>
              <DisbursementApprovedTable title={"Disbursement Approved Loans"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
          </>
        )}
        no={() => (
          <>
            <Paper elevation={1} className={classes.tableContainer}>
              <SubmittedTable title={"Submitted Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
          </>
        )}
      />
      <Drawer
        anchor="right"
        // elevation={4}
        ModalProps={{
          onBackdropClick: () => { setShowPanel({ status: false }) }
        }}
        open={showPanel.status}
        variant={"temporary"}
      >
        <div className={classes.sidePanelWrapper}>
          <DealershipDetails
            data={dealershipData}
            loanData={loansData}
            status={showPanel.data}
            currentUser={currentUser}
            onClose={() => { setShowPanel({ status: false }) }}
            />
        </div>
      </Drawer>
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  all_loans: selectAllLoans
});

const mapDispatchToProps = dispatch => ({
  setAllLoans: loans => dispatch(setAllLoans(loans))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoansTable);