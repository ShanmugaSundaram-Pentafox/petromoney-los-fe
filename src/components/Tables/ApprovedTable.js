import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { permissionCheck } from '../UserCan/UserCan';
import { rulesList } from '../../config/userRules';

const useStyles = makeStyles(theme => ({
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
  itemLists: {
    // padding: '10px',
    display: 'flex',
    gap: '6px',
    flexDirection: 'column',
  },
  listItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: '#f7f7f7',
    },
    height: '22px',
  },
  listIcon: {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
  }
}));

const ApprovedTable = ({ title, loans, setLoansData, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [loanAmount, setLoanAmount] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [productTypeId, setProductTypeId] = useState();
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  useEffect(() => {
    setLoading(true);
    getLoansByStatus('approved', filterQry)
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }, [filterQry])

  const getLoansTable = () => {
    setLoading(true);
    getLoansByStatus('approved')
      .then(data => {
        setLoansData('approved', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  }

  const column = [];

  return (
    <div>
      <DataTableViewer
        column={column}
        rowData={loans}
        excelDownload={true}
        title={title}
        count={loans?.length}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'approved')}
        loading={loading}
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        loanId={loanId}
        loanAmount={loanAmount}
        opened={modalVisible}
        productId={productTypeId}
        type={type}
        title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter of Continuity' : 'Sanction Letter'}
        onClose={() => setModalVisible(false)}
        callback={getLoansTable}
        currentUser={currentUser}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.approved
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ApprovedTable);