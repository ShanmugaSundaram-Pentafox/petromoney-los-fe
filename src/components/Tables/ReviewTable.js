
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import { dateCustomSort } from '../../utils/commonFunctions.util';
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

const ReviewerTable = ({ title, loans, setLoansData, onRowClick, filterQry }) => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    // if (!loans || !loans?.length) {
    setLoading(true);
    getLoansByStatus('loan_review', filterQry)
      .then(data => {
        setLoansData('loan_review', data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
    // }
  }, [filterQry]);

  const column = [
  ];

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(loans[dataIndex].dealership_id, loans[dataIndex], 'loan_review')
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={loans}
        column={column}
        title={title}
        count={loans?.length}
        excelDownload
        loading={loading}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'loan_review')}
      />
    </div>
  )
}

const mapStateToProps = ({ loans }) => ({
  loans: loans.loan_review
});

const mapDispatchToProps = dispatch => ({
  setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewerTable);