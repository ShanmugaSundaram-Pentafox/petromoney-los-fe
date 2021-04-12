import React, { useMemo, useState } from 'react';
import { createStructuredSelector } from 'reselect';
// import { Link as RouterLink } from 'react-router-dom';
// import moment from 'moment';
// import clsx from 'clsx';
import usePageTitle from '../../hooks/usePageTitle';
import { connect } from 'react-redux';
// import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
// import MUIDataTable from "mui-datatables";
import Grid from '@material-ui/core/Grid';
import { selectAllLoans } from '../../store/loans/loans.selector';
import { setAllLoans } from '../../store/loans/loans.actions';
import { getAllLoans, getLoanStats } from '../../services/loans.service';
import Currency from '../../components/Number/Currency';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
// import Avatar from '@material-ui/core/Avatar';
// import AvatarGroup from '@material-ui/lab/AvatarGroup';
// import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { getDealershipById, getDealershipLoansById } from '../../services/dealerships.service';
import { getDealersByDealershipId } from '../../services/dealers.service';
import DealershipDetails from '../dashboard/components/DealershipDetails';
import SubmittedTable from '../../components/Tables/SubmittedTable';
import ApprovedTable from '../../components/Tables/ApprovedTable';
import DisbursedTable from '../../components/Tables/DisbursedTable';
import RejectedTable from '../../components/Tables/RejectedTable';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import UserCan from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { useMount } from 'react-use';
import ApprovalReqestTable from '../../components/Tables/ApprovalReqestTable';
import DisbursementReqestTable from '../../components/Tables/DisbursementReqestTable';
import DisbursementApprovedTable from '../../components/Tables/DisbursementApprovedTable';


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

const LoansTable = ({ currentUser, all_loans, setAllLoans }) => {
    usePageTitle('Loans List');
    const classes = useStyles();
    const [chartData, setChartData] = useState([{}, {}, {}, {}, {}, {}]);
    const [showPanel, setShowPanel] = useState({
        status: false,
        data: ""
    });
    const [dealershipData, setDealershipData] = useState();
    const [loansData, setLoansData] = useState();
    const [dealersData, setDealersData] = useState();
    const [selectedStatsCard, setSelectedStatsCard] = useState("Approved");

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
        // getDealershipLoansById(id)
        //   .then(data => setLoansData(data))
        //   .catch(e => null)

        getDealersByDealershipId(id)
            .then(data => setDealersData(data))
            .catch(e => null)

        setShowPanel({ status: true, data: status });
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
                // const data = _countBy(res, item => {
                //   return item.status?.toLowerCase()
                // });
                let cdata = [
                    { name: 'Submitted', count: data.submitted_count },
                    { name: 'Pending Approval', count: data.loan_approval_count || 0 },
                    { name: 'Approved', count: data.approved_count },
                    { name: 'Pending Disbursement Approval', count: data.disbursement_approval_count || 0 },
                    { name: 'Disbursement Approved', count: data.disbursement_approved_count || 0 },
                    { name: 'Disbursed', count: data.disbursed_count },
                    { name: 'Rejected', count: data.rejected_count },
                ];
                setChartData(cdata);
            })
            .catch(err => {
                console.log(err);
            })
    })

    return (
        <div>
            {/* <UserCan
        role={currentUser.role_name}
        perform={rulesList.loan_approval}
        yes={() => (
          <>
           <Paper elevation={1} className={classes.tableContainer}>
              <ApprovedTable title={"Approved Loans"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
            <Paper elevation={1} className={classes.tableContainer}>
              <DisbursedTable title={"Disbursed Loans"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
          </>
        )}
        no={() => null}
      /> */}
            {
                Array.isArray(chartData) && (
                    <Box p={2} mb={2} borderRadius={4} bgcolor="background.paper">
                        <Typography variant="h5">Loans' Statistics</Typography>
                        <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="nowrap"   >
                            {
                                chartData.map((item, i) => (
                                    <DashCard key={i} noBorder={i === chartData.length - 1} value={item.count} text={item.name} selected={item.name === selectedStatsCard} action={() => handleClick(item.name)} />
                                ))
                            }
                        </Box>
                    </Box>
                )
            }
            <Grid container spacing={2}>
                {
                    selectedStatsCard === "Pending Approval" ? (
                        <Grid item md={12}>
                            <Paper className={classes.tableContainer}>
                                <ApprovalReqestTable title={"Pending for Initial Approval"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>
                    ) : null
                }
                {
                    selectedStatsCard === "Pending Disbursement Approval" ? (
                        <Grid item md={12}>
                            <Paper className={classes.tableContainer}>
                                <DisbursementReqestTable title={"Pending for Disbursement Approval"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>
                    ) : null
                }
                {
                    selectedStatsCard === "Submitted" ? (
                        <Grid item xs={12}>
                            <Paper className={classes.tableContainer}>
                                <SubmittedTable title={"Submitted Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>
                    ) : null
                }
                {
                    selectedStatsCard === "Approved" ? (
                        <Grid item xs={12}>
                            <Paper className={classes.tableContainer}>
                                <ApprovedTable title={"Disbursement Approved Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>

                    ) : null
                }
                {
                    selectedStatsCard === "Rejected" ? (
                        <Grid item xs={12}>
                            <Paper className={classes.tableContainer}>
                                <RejectedTable title={"Rejected Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>
                    ) : null
                }
                {
                    selectedStatsCard === "Disbursed" ? (
                        <Grid item xs={12}>
                            <Paper className={classes.tableContainer}>
                                <DisbursedTable title={"Disbursed Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>
                    ) : null
                }
                {
                    selectedStatsCard === "Disbursement Approved" ? (
                        <Grid item xs={12}>
                            <Paper className={classes.tableContainer}>
                                <DisbursementApprovedTable title={"Disbursement Approved Applications"} currentUser={currentUser} onRowClick={showDealershipInfo} />
                            </Paper>
                        </Grid>
                    ) : null
                }
            </Grid>

            {/* <Paper elevation={1} className={classes.tableContainer}>
                <ApprovedTable title={"Approved Loans"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
            <Paper elevation={1} className={classes.tableContainer}>
                <DisbursedTable title={"Disbursed Loans"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper>
            <Paper elevation={1} className={classes.tableContainer}>
                <RejectedTable title={"Rejected Loans"} currentUser={currentUser} onRowClick={showDealershipInfo} />
            </Paper> */}
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