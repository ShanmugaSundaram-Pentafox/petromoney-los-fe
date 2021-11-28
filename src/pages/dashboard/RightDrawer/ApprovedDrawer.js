import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import DealershipData from './DealershipData';
import DrawerFooter from './DrawerFooter';
import LoanInfo from './LoanInfo';
import TextInput from '../../../components/TextInput/TextInput';
import { getLoanById } from '../../../services/loans.service';
import SalesInfo from '../components/SalesInfo';

const ViewMoreBtn = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  padding: 5px;
  padding-top: 15px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(176,176,176,0.75) 100%);
  transition: all .35s ease-in-out;

  &:hover {
    background: linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(176,176,176,0.90) 100%);
  }
`;


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


const ApprovedDrawer = ({ id, selectedLoanData, status, currentUser, readOnly, editable, data, onClose }) => {
  const loanData = useQuery(['dealership-loans-data', id, status], () => { getLoanById(data.id, selectedLoanData.id) })
  const classes = useStyles();

  const fieldProps = {
    direction: 'column',
    alignTop: true,
    readOnly,
    className: classes.fieldItemStyle
  }

  const gridProps = {
    item: true,
    xs: 12,
    className: classes.gridItemStyle
  }

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
        {
          selectedLoanData?.remarks && (
            <>
              <Grid {...gridProps} style={{ position: 'relative' }}>
                <TextInput
                  multiline
                  rows={4}
                  rowsMax={8}
                  labelText="Remarks*"
                  alignTop
                  value={selectedLoanData?.review_remarks}
                  disabled
                  {...fieldProps}
                />
                {
                  selectedLoanData?.approval_remarks?.length >= 300 ? (
                    <ViewMoreBtn
                    // onClick={() => setShowRemarksModal(loanInfo.approval_remarks)}
                    >
                      View more
                    </ViewMoreBtn>
                  ) : null
                }
              </Grid>
            </>
          )
        }
      </div>
      <div>
        <DrawerFooter onClose={onClose} id={id} editable={editable} currentUser={currentUser} status={status} />
      </div>
    </div >
  );
}
export default ApprovedDrawer;