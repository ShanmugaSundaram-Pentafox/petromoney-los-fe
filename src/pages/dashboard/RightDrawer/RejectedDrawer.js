import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import DrawerRemarks from './DrawerRemarks';
import LoanInfo from './LoanInfo';
import { getLoanById } from '../../../services/loans.service';
import WorkingSheetDrawer from '../../dealershipDetails/ScoreCardTables/WorkingsheetDrawer';
import classes from './SideDrawer.module.css';
import { Box } from '@mantine/core';

const RejectedDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose, readOnly }) => {
  const { data: loanData = {} } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.contentWrapper}>
        <DealershipData data={data} readOnly={true} />
        <WorkingSheetDrawer id={id} />
        <LoanInfo viewable={true} status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} />
        <>
          <DrawerRemarks label={'Recommendation'} loanData={loanData?.review_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Reviewer recommendation'} loanData={loanData?.approval_remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Approver recommendation'} loanData={loanData?.remarks} readOnly={readOnly} />
          <DrawerRemarks label={'Pending disbursement recommendation'} loanData={loanData?.disbursement_approval_remarks} readOnly={readOnly} />
          {/* {loanData?.pushback_remarks && <DrawerRemarks label={'Push back Remarks'} loanData={loanData?.pushback_remarks} readOnly={readOnly} />} */}
        </>
      </Box>
      <Box>
        <DrawerFooter selectedLoanData={selectedLoanData} editable={editable} onClose={onClose} id={id} currentUser={currentUser} status={status} />
      </Box>
    </Box >
  );
}
export default RejectedDrawer;