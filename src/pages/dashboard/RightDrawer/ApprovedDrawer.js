import React from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import { getLoanById } from '../../../services/loans.service';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import classes from './SideDrawer.module.css';

const ApprovedDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))

  return (
    <>
      <div className={classes.wrap} >
        <DealershipData data={data} readOnly={true} />
        <WorkingSheetDrawer id={id} />
        <LoanInfo viewable={true} status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} />
        <>
          <DrawerRemarks label={'Recommendation'} loanData={loanData?.review_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Reviewer recommendation'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Approver recommendation'} loanData={loanData?.remarks} readOnly={readOnly} />
          {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}

        </>
      </div>
      <DrawerFooter selectedLoanData={selectedLoanData} onClose={onClose} id={id} editable={editable} currentUser={currentUser} status={status} />
    </>

  );
}
export default ApprovedDrawer;