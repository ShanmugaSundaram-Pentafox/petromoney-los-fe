import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { rulesList } from '../../config/userRules';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import { permissionCheck } from '../UserCan/UserCan';
import DataTableViewer from '../ReactTable/DataTableViewer';

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
    fontSize: '12px',
    fontWeight: '500',
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
  }
}));

const ApprovalReqestTable = ({ title, loans, setLoansData, onRowClick, filterQry, currentUser, chartData }) => {
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  const classes = useStyles();
  useEffect(() => {
    setLoading(true);
    getLoansByStatus('loan_approval', filterQry)
      .then(data => {
        setLoansData('loan_approval', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])

  const column = [
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        column={column}
        rowData={loans}
        title={title}
        count={loans?.length}
        showStatusTab={chartData}
        onRowClick={(e) => onRowClick(e.dealership_id, e, 'loan_approval')}
        loading={loading}
        excelDownload
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        opened={modalVisible}
        loanId={loanId}
        type={type}
        title={'eSign Application Form'}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.loan_approval
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalReqestTable);