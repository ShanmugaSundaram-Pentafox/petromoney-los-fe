import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import { getLoanById } from '../../../services/loans.service';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import DispApprovedDataTable from '../components/DispApprovedDataTable';
import classes from './SideDrawer.module.css';

const DisbursedDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))

  return (
    <>
      <div className={classes.wrap}>
        <DealershipData data={data} loanData={loanData} readOnly={true} />
        <WorkingSheetDrawer id={id} />
        <LoanInfo viewable={true} status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} />
        <>
          <DrawerRemarks label={'Recommendation'} loanData={loanData?.review_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Reviewer recommendation'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Approver recommendation'} loanData={loanData?.remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Disbursement recommendation'} loanData={loanData?.disbursement_recommendation_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Disbursement approved recommendation'} loanData={loanData?.disbursement_approval_remarks} readOnly={readOnly} />
          {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}
        </>
        {
          loanData?.isLoading ? <Skeleton variant="rect" width="100%" height={400} /> : <DispApprovedDataTable id={id} editable={editable} loanData={loanData?.disbursement_loans} currentUser={currentUser} />
        }
      </div>
      <DrawerFooter selectedLoanData={selectedLoanData} loanData={loanData} onClose={onClose} id={id} editable={editable} currentUser={currentUser} status={status} />
    </>
  );
}
export default DisbursedDrawer;