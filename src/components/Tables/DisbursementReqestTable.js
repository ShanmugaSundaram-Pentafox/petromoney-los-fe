import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import Currency from '../Number/Currency';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import DDMSModal from '../Deferal-Devation/DDMSModal';
import CustomToken from '../CommonComponents/CustomToken';
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

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'modified_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      key: 'action',
      header: 'Action',
      enableColumnFilter: false,
      cell: (value) => {
        if (value?.row?.original?.is_pdc_completed) {
          return (
            <CustomToken label={'PDC Completed'} variant="success" icon="tick" />
          )
        } else {
          return (
            <Tooltip label={'Click to view checklist'} color='gray' withArrow>
              <ActionIcon size="xs" variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id, is_pdc_completed: value?.row?.original?.is_pdc_completed })}><IconLink /></ActionIcon>
            </Tooltip>
          )
        }
      }
    },
  ]

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