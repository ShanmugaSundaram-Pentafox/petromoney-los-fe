import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import DataTableViewer from '../ReactTable/DataTableViewer';
import DDMSModal from '../Deferal-Devation/DDMSModal';
import { useQuery } from 'react-query';

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

const DisbursementReqestTable = ({ title, loans = [], setLoansData, onRowClick, filterQry }) => {
  const classes = useStyles();
  const [docModal, setDocModal] = useState({ modal: false });

  const disbursementApprovalDataQuery = useQuery({
    queryKey: ['disbursement-approval-query'],
    queryFn: () => getLoansByStatus('disbursement_approval', filterQry),
  })

  useEffect(() => {
    if (disbursementApprovalDataQuery?.data?.length) {
      setLoansData(disbursementApprovalDataQuery?.data)
    }
  }, [disbursementApprovalDataQuery?.data])

  const column = []

  return (
    <>
      <div className={classes.root}>
        <DataTableViewer
          rowData={disbursementApprovalDataQuery?.data}
          column={column}
          title={title}
          count={loans?.length}
          excelDownload
          onRowClick={(i) => onRowClick(i.dealership_id, i, 'disbursement_approval')}
          loading={disbursementApprovalDataQuery?.isLoading}
        />
      </div>

      <DDMSModal opened={Boolean(docModal?.modal)} onClose={() => setDocModal({})} modalObj={docModal} queryKey='disbursement-approval-query' />
    </>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.disbursement_approval
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DisbursementReqestTable);