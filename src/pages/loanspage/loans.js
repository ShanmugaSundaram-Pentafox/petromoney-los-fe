import { Paper, Title } from '@mantine/core';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import { createStructuredSelector } from 'reselect';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import ApprovalReqestTable from '../../components/Tables/ApprovalReqestTable';
import ApprovedTable from '../../components/Tables/ApprovedTable';
import DisbursedTable from '../../components/Tables/DisbursedTable';
import DisbursementApprovedTable from '../../components/Tables/DisbursementApprovedTable';
import DisbursementReqestTable from '../../components/Tables/DisbursementReqestTable';
import RejectedTable from '../../components/Tables/RejectedTable';
import ReviewerTable from '../../components/Tables/ReviewTable';
import SubmittedTable from '../../components/Tables/SubmittedTable';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import usePageTitle from '../../hooks/usePageTitle';
import { getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById } from '../../services/dealerships.service';
import { getAllLoans, getLoanStats } from '../../services/loans.service';
import { setAllLoans } from '../../store/loans/loans.actions';
import { selectAllLoans } from '../../store/loans/loans.selector';
import ApprovedDrawer from '../dashboard/RightDrawer/ApprovedDrawer';
import DisbApprovedDrawer from '../dashboard/RightDrawer/DisbApprovedDrawer';
import DisbursedDrawer from '../dashboard/RightDrawer/DisbursedDrawer';
import PendingApprovalDrawer from '../dashboard/RightDrawer/PendingApprovalDrawer';
import PendingDisbApprovedDrawer from '../dashboard/RightDrawer/PendingDisbApprovalDrawer';
import PendingReviewDrawer from '../dashboard/RightDrawer/PendingReviewDrawer';
import RejectedDrawer from '../dashboard/RightDrawer/RejectedDrawer';
import SubmittedDrawer from '../dashboard/RightDrawer/SubmittedDrawer';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 6,
    // boxShadow: '0 8px 6px -6px rgba(0,0,0,0.12)',
    marginBottom: theme.spacing(2)
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
    backgroundColor: '#a6b1e1'
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

const LoansTable = ({ currentUser, all_loans, setAllLoans }) => {
  usePageTitle('Loans List');
  const classes = useStyles();
  const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
  const [showPanel, setShowPanel] = useState({
    status: false,
    data: ''
  });
  const [dealershipData, setDealershipData] = useState();
  const [loansData, setLoansData] = useState();
  const [dealersData, setDealersData] = useState();
  const [selectedStatsCard, setSelectedStatsCard] = useState('Approved');
  const [filterQry, setFilterQry] = useState({ region: 0 })

  const handleClick = (name) => {
    setSelectedStatsCard(name)
  }
  const showDealershipInfo = (id, selectedLoanData, status) => {
    setLoansData(selectedLoanData);
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch(e => null);

    getDealersByDealershipId(id)
      .then(data => setDealersData(data))
      .catch(e => null)

    setShowPanel({ id: id, status: true, data: status, editable: permissionCheck(currentUser.role_name, rulesList.loan_approval) });
  }
  useMount(() => {
    if (!all_loans.length) {
      getAllLoans()
        .then(data => {
          setAllLoans(data);
        })
        .catch(e => null)
    }
    getLoanStats()
      .then(data => {
        let cdata = [
          { name: 'Submitted', count: data?.submitted_count },
          { name: 'Pending Review', count: data?.loan_review_count,amount: data?.amount_requested_review },
          { name: 'Pending Approval', count: data?.loan_approval_count || 0, amount: data?.amount_requested },
          { name: 'Approved', count: data?.approved_count, amount: data?.amount_approved },
          { name: 'Disb. Approval', count: data?.disbursement_approval_count || 0, amount: data?.amount_disbursement_approval },
          { name: 'Disb. Approved', count: data?.disbursement_approved_count || 0, amount: data?.amount_disbursement_approved },
          { name: 'Disbursed', count: data?.disbursed_count, amount: data?.actual_amount_disbursed },
          { name: 'Rejected', count: data?.rejected_count },
        ];
        setChartData(cdata);
      })
      .catch(err => {
        console.log(err);
      })
  })

  const compProps = {
    id: showPanel?.id,
    status: showPanel?.data,
    editable: showPanel?.editable,
    currentUser: currentUser,
    data: dealershipData,
    onClose: () => { setShowPanel({ status: false }) },
    selectedLoanData: loansData,
  }

  return (
    <>
      <Paper shadow="xs" p="lg" radius="lg" mb="lg">
        <Title order={3} mb="sm" className="text-gray-700">Loans&apos; Statistics</Title>

        {Array.isArray(chartData) && (
          <dl className="grid grid-cols-3 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-4 lg:grid-cols-8">
            {chartData?.map((item, i) => {
              return (
                <>
                  {item.name || item.count ? (
                    <DashCard 
                      key={item.name + i} 
                      selected={item.name === selectedStatsCard} 
                      text={item.name} 
                      value={item.count} 
                      amount={item.amount} 
                      action={() => handleClick(item.name)} 
                    />
                  ) : null}
                </>
              )
            })}
          </dl>
        )}
      </Paper>

      <Grid container spacing={2}>
        {selectedStatsCard === 'Pending Approval' ? (
          <Grid item md={12}>
            <Paper className={classes.tableContainer}>
              <ApprovalReqestTable title={'Pending for Initial Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}
        
        {selectedStatsCard === 'Pending Review' ? (
          <Grid item md={12}>
            <Paper className={classes.tableContainer}>
              <ReviewerTable title={'Pending for Review'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}

        {selectedStatsCard === 'Disb. Approval' ? (
          <Grid item md={12}>
            <Paper className={classes.tableContainer}>
              <DisbursementReqestTable title={'Pending for Disbursement Approval'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}
        
        {selectedStatsCard === 'Submitted' ? (
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <SubmittedTable title={'Submitted Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}
        
        {selectedStatsCard === 'Approved' ? (
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <ApprovedTable title={'Disbursement Approved Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}
        
        {selectedStatsCard === 'Rejected' ? (
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <RejectedTable title={'Rejected Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}

        {selectedStatsCard === 'Disbursed' ? (
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <DisbursedTable title={'Disbursed Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}

        {selectedStatsCard === 'Disb. Approved' ? (
          <Grid item xs={12}>
            <Paper className={classes.tableContainer}>
              <DisbursementApprovedTable title={'Disbursement Approved Applications'} currentUser={currentUser} onRowClick={showDealershipInfo} filterQry={filterQry} />
            </Paper>
          </Grid>
        ) : null}
      </Grid>

      <Drawer
        anchor="right"
        ModalProps={{ onBackdropClick: () => setShowPanel({ status: false })}}
        open={showPanel?.status}
        variant={'temporary'}
      >
        <div className={classes.sidePanelWrapper}>
          {showPanel.data === 'submitted' ? <SubmittedDrawer {...compProps} />
            : showPanel.data === 'loan_review' ? <PendingReviewDrawer {...compProps} />
              : showPanel.data === 'loan_approval' ? <PendingApprovalDrawer {...compProps} />
                : showPanel.data === 'approved' ? <ApprovedDrawer {...compProps} />
                  : showPanel?.data === 'disbursement_approval' ? <PendingDisbApprovedDrawer {...compProps} />
                    : showPanel?.data === 'disbursement_approved' ? <DisbApprovedDrawer {...compProps} />
                      : showPanel?.data === 'disbursed' ? <DisbursedDrawer {...compProps} />
                        : showPanel?.data === 'rejected' ? <RejectedDrawer {...compProps} /> : null}
        </div>
      </Drawer>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  all_loans: selectAllLoans
});

const mapDispatchToProps = dispatch => ({
  setAllLoans: loans => dispatch(setAllLoans(loans))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoansTable);