import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getDealersByDealershipId } from '../../services/dealers.service';
import { getDealershipById } from '../../services/dealerships.service';
import { getLoanStats } from '../../services/loans.service';
import ApprovedDrawer from '../dashboard/RightDrawer/ApprovedDrawer';
import DisbApprovedDrawer from '../dashboard/RightDrawer/DisbApprovedDrawer';
import DisbursedDrawer from '../dashboard/RightDrawer/DisbursedDrawer';
import PendingApprovalDrawer from '../dashboard/RightDrawer/PendingApprovalDrawer';
import PendingDisbApprovedDrawer from '../dashboard/RightDrawer/PendingDisbApprovalDrawer';
import PendingReviewDrawer from '../dashboard/RightDrawer/PendingReviewDrawer';
import RejectedDrawer from '../dashboard/RightDrawer/RejectedDrawer';
import SubmittedDrawer from '../dashboard/RightDrawer/SubmittedDrawer';
import LoansTable from '../dashboard/components/LoansTable';


const FuelLoans = ({ currentUser }) => {
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
    getLoanStats()
      .then(data => {
        let cdata = [
          { name: 'Submitted', count: data?.submitted_count },
          { name: 'Pending Review', count: data?.loan_review_count, amount: data?.amount_requested_review },
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
      <Grid>
        <LoansTable
          currentUser={currentUser}
          value={selectedStatsCard}
          handleClick={handleClick}
          chartData={chartData}
          filterQry={filterQry}
        />
      </Grid>
      <Drawer
        anchor="right"
        ModalProps={{ onBackdropClick: () => setShowPanel({ status: false }) }}
        open={showPanel?.status}
        variant={'temporary'}
      >
        <div>
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

export default FuelLoans;