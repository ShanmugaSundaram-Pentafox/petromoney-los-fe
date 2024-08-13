import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
// import { createStructuredSelector } from 'reselect';
import { getLoansByStatus } from '../../services/loans.service';
import DataTableViewer from '../ReactTable/DataTableViewer';
import DDMSModal from '../Deferal-Devation/DDMSModal';
import { useQuery } from 'react-query';
import clsx from 'clsx';
import Currency from '../Number/Currency';
import { NavLink as RouterLink } from 'react-router-dom';
import moment from 'moment';
import CustomToken from '../CommonComponents/CustomToken';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconLink, IconReload } from '@tabler/icons-react';
import { action_id, resources_id } from '../../config/accessControl';
import { isAllowed } from '../../utils/cerbos';

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

const DisbursementReqestTable = ({ title, onRowClick, filterQry, currentUser }) => {
  const classes = useStyles();
  const [docModal, setDocModal] = useState({ modal: false });

  const disbursementApprovalDataQuery = useQuery({
    queryKey: ['loan-details-disb-approval'],
    queryFn: () => getLoansByStatus('disbursement_approval', filterQry),
  })

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>,
      sorting: true,
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>,
      sorting: true,
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'loan_submitted_by',
      header: 'Login By',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'modified_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>,
      sorting: true,
    }, {
      key: 'action',
      header: 'Action',
      enableColumnFilter: false,
      cell: (value) => {
        if (isAllowed(currentUser.permissions, resources_id?.dashboard, action_id?.dashboard?.pdcChecklist)) {
          if (value?.row?.original?.is_pdc_completed) {
            return (
              <Group>
                <CustomToken label={'PDC Completed'} variant="success" icon="tick" />
                {isAllowed(currentUser?.permissions, resources_id?.dashboard, action_id?.dashboard?.pdc_re_initiate) ?
                  <Tooltip label={'Click to re-initiate PDC'} withArrow>
                    <ActionIcon size={'xs'} variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id, is_pdc_completed: value?.row?.original?.is_pdc_completed, type: 're-initiate' })}>
                      <IconReload size={16} />
                    </ActionIcon>
                  </Tooltip>
                  : null}
              </Group>
            )
          } else {
            return (
              <Tooltip label={'Click to view checklist'} color='gray' withArrow>
                <ActionIcon size="xs" variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id, is_pdc_completed: value?.row?.original?.is_pdc_completed })}><IconLink /></ActionIcon>
              </Tooltip>
            )
          }

        }
      }
    },
  ]

  return (
    <>
      <div className={classes.root}>
        <DataTableViewer
          allowSorting={true}
          rowData={disbursementApprovalDataQuery?.data}
          column={column}
          title={title}
          count={disbursementApprovalDataQuery?.data?.length}
          excelDownload
          onRowClick={(i) => onRowClick(i.dealership_id, i, 'disbursement_approval')}
          loading={disbursementApprovalDataQuery?.isLoading}
        />
      </div>

      <DDMSModal opened={Boolean(docModal?.modal)} currentUser={currentUser} onClose={() => setDocModal({})} modalObj={docModal} queryKey='loan-details-disb-approval' />
    </>
  )
}

export default DisbursementReqestTable;