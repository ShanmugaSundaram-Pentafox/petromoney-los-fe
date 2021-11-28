import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useQuery } from 'react-query';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import LoanInfo from './LoanInfo';
import { getLoanById } from '../../../services/loans.service';
import SalesInfo from '../components/SalesInfo';


const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '0 24px 10px 24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  contentWrapper: {
    padding: 12,
    flex: 1,
    overflow: 'auto',
    overflowX: 'hidden'
  },
  wrapperTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  title: {
    top: 0,
    left: 0,
    padding: '8px 16px',
    background: theme.palette.grey[300],
    borderBottomRightRadius: 12,
    boxShadow: '0px 0px 4px #8d8d8d',
  },
  closeIcon: {
    marginTop: 8,
  },
  actionButtonsWrapper: {
    // display: 'flex',
    // justifyContent: 'space-between',
    paddingTop: 16,
  },
  btn: {
    marginLeft: 16
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
}))


const SubmittedDrawer = ({ id, selectedLoanData, status, currentUser, editable, data, onClose }) => {
  const loanData = useQuery(['dealership-loans-data', id, status], () => { getLoanById(data.id, selectedLoanData.id) })
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperTitle}>
        <Typography className={classes.title} variant="h4" component="h4">{data?.id}</Typography>
        <CloseIcon className={classes.closeIcon} onClick={onClose} />
      </div>
      <div className={classes.contentWrapper}>
        <DealershipData data={data} readOnly={true} />
        <SalesInfo id={id} currentUser={currentUser} readOnly={true} />
        <LoanInfo status={status} currentUser={currentUser} editable={editable} data={selectedLoanData} />
      </div>
      <div>
        <DrawerFooter data={data} onClose={onClose} id={id} currentUser={currentUser} status={status} />
      </div>
    </div >
  );
}
export default SubmittedDrawer;