import React, { useState } from 'react';
import { rulesList } from '../../config/userRules';
import { getLoansByStatus } from '../../services/loans.service';
import SignRequestLayout from '../Leegality/SignRequestLayout';
import { permissionCheck } from '../UserCan/UserCan';
import DataTableViewer from '../ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import column from './DashboardColumns';
import classes from './Dashboard.module.css'
import CheckAllowed from '../../pages/rbac/CheckAllowed';
import { action_id, resources_id } from '../../config/accessControl';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import CustomToken from '../CommonComponents/CustomToken';
import DDMSModal from '../Deferal-Devation/DDMSModal';

const DashboardTable = ({ onRowClick, filterQry, currentUser, chartData, status, value, handleChange }) => {
  const [loanId, setloanId] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [docModal, setDocModal] = useState('');
  const [productTypeId, setProductTypeId] = useState('');
  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  const loansData = useQuery({
    queryKey: ['dashboard-data', status, filterQry],
    queryFn: () => getLoansByStatus(status, filterQry)
  })

  const columnData = {
    submitted: [
      ...column.submitted,
      {
        header: 'Documents',
        key: 'action',
        isHeaderDisplay: Boolean(actionable),
        isHeaderDownload: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <CheckAllowed currentUser={currentUser} resource={resources_id?.dashboard} action={action_id?.dashboard?.submitted_documents}>
            <Tooltip label={'eSign Application'} withArrow>
              <ActionIcon size="xs" color="blue" variant="subtle" onClick={() => { setloanId(row?.original?.['id']); setType('application'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); }}>
                <ESignIcon />
              </ActionIcon>
            </Tooltip>
          </CheckAllowed>
        )
      },
    ],
    loan_review: [...column.loan_review],
    loan_approval: [
      ...column.loan_approval,
      {
        key: 'action',
        header: 'Document',
        isHeaderDownload: false,
        isHeaderDisplay: Boolean(actionable),
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Tooltip label="eSign Application" withArrow color='gray'>
            <ActionIcon size="xs" color="blue" variant="subtle" onClick={() => { setloanId(row?.['id']); setType('application'); setDealershipId(row?.dealership_id); setModalVisible(true); }}>
              <ESignIcon />
            </ActionIcon>
          </Tooltip>
        )
      },
    ],
    approved: [
      ...column.approved,
    ],
    disbursement_approval: [
      ...column.disbursement_approval,
      {
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
  }

  // const options = {
  //   selectableRowsHeader: false,
  //   selectableRows: 'none',
  //   isRowSelectable: () => false,
  //   onCellClick: (colData, cellMeta) => {
  //     if (cellMeta.colIndex !== 8) {
  //       onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'submitted')
  //     }
  //   },
  //   customSort: (data, dataIndex, rowIndex) => {
  //     let dateIndex = 5
  //     return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
  //   }
  // };

  return (
    <div className={classes.root}>
      <DataTableViewer
        column={columnData?.submitted}
        rowData={loansData?.data}
        title={'Dashboard'}
        // count={loans?.length}
        statusChange={{ status: value, handleChange }}
        showStatusTab={chartData || []}
        excelDownload
        loading={loansData?.isLoading}
        onRowClick={(i) => onRowClick(i?.dealership_id, i, status)}
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        opened={modalVisible}
        loanId={loanId}
        type={type}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}

        loanAmount={loanAmount}
        productId={productTypeId}
        title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter of Continuity' : 'Sanction Letter'}
        callback={loansData?.refetch}
      />

      <DDMSModal opened={Boolean(docModal?.modal)} onClose={() => setDocModal({})} modalObj={docModal} queryKey='dashboard-data' />
    </div>
  )
}

export default DashboardTable;