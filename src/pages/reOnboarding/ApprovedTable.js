import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import clsx from 'clsx';
import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import CustomToken from '../../components/CommonComponents/CustomToken';
import SignRequestLayout from '../../components/Leegality/SignRequestLayout';
import Currency from '../../components/Number/Currency';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import { ActionIcon, Popover, Text, Tooltip } from '@mantine/core';
import { IconList } from '@tabler/icons-react';
import classes from './ReOnboarding.module.css';

const ApprovedTable = ({ title, onRowClick, filterQry, currentUser, actionable }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [type, setType] = useState('');
  const [loanId, setloanId] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [dealershipId, setDealershipId] = useState();

  const getReOnboardingDataQuery = useQuery({
    queryKey: ['re-onboarding-data-approved', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('approved', filterQry, page, search),
  })

  const getReOnboardingPaginationQuery = useQuery({
    queryKey: ['re-onboarding-pagination-approved', filterQry],
    queryFn: () => getPageDetails('approved', filterQry),
  })

  const reOnboardingDownloadQuery = useQuery({
    queryKey: 'reOnboarding-download-approved',
    queryFn: () => downloadEnhancementData('approved', filterQry),
    onSuccess: (data) => {
      getSignedUrl(data[0]?.url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          displayNotification({ message: e, variant: 'error' });
        })
    },
    onError: (e) => {
      displayNotification({ message: e, variant: 'error' })
    },
    enabled: Boolean(false),
    retry: Boolean(false),
  })

  const column = [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'old_product_name',
      header: 'Old Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Product Scheme',
      cell: value => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: value => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'old_loan_amount',
      header: 'Old Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }, {
      key: 'new_loan_amount',
      header: 'New Loan Amount',
      cell: value => <Currency value={value?.getValue()} />
    }, {
      key: 'action',
      header: 'Documents',
      isHeaderDownload: false,
      cell: ({ row }) => {
        return (
          row?.original?.['is_document_signed'] ? (
            <CustomToken label={'Signed'} variant="success" icon="tick" />
          ) : (
            <Popover
              withArrow
              position='left-start'
              shadow="lg"
            >
              <Popover.Target>
                <Tooltip label={'Click to view documents'} withArrow color='gray' offset={10}>
                  <span>
                    <ActionIcon size="xs" variant='subtle' color={'blue'} mt={4}><IconList /></ActionIcon>
                  </span>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <div className={classes.itemLists}>
                  <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['loan_id']); setDealershipId(row?.original?.dealership_id); setType('sanction'); setModalVisible(true); }}>
                    <div className={classes.listIcon}>
                      <DescriptionIcon style={{ width: 19, color: 'blue' }} />
                    </div>
                    <Text>Sanction Letter</Text>
                  </div>
                  <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['loan_id']); setDealershipId(row?.original?.dealership_id); setType('agreement'); setModalVisible(true); setLoanAmount(row?.original?.['current_loan_amount']); setProductTypeId(row?.original?.['new_product_id']) }}>
                    <div className={classes.listIcon} >
                      <LoanAgreementIcon width={12} style={{ color: 'blue' }} />
                    </div>
                    <Text>Loan Agreement</Text>
                  </div>
                  <div className={classes.listItem} style={{ padding: '3px 0' }} onClick={() => { setloanId(row?.original?.['loan_id']); setType('application'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); }}>
                    <div className={classes.listIcon} style={{ marginLeft: '2px', width: '18px' }}>
                      <ESignIcon width={17} style={{ color: 'blue' }} />
                    </div>
                    <Text>eSign Application</Text>
                  </div>
                  <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['loan_id']); setType('loc'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); setLoanAmount(row?.original?.['current_loan_amount']); setProductTypeId(row?.original?.['new_product_id']) }}>
                    <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                      <AssignmentIcon style={{ width: 19, color: 'blue' }} />
                    </div>
                    <Text>Letter Of Continuity</Text>
                  </div>
                </div>
              </Popover.Dropdown>
            </Popover>
          )
        )
      },
    },
  ];

  return (
    <div className={classes.root}>
      <DataTableViewer
        title={title}
        count={getReOnboardingDataQuery?.data?.length}
        rowData={getReOnboardingDataQuery?.data}
        column={column}
        onRowClick={i => onRowClick(i?.dealership_id, i, 'approved')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        isLoading={getReOnboardingDataQuery?.isLoading}
        totalNoOfPages={getReOnboardingPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        downloadQuery={{ query: reOnboardingDownloadQuery?.refetch, isLoading: reOnboardingDownloadQuery?.isFetching }}
        excelDownload
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        loanId={loanId}
        opened={modalVisible}
        loanAmount={loanAmount}
        productId={productTypeId}
        type={type}
        title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter Of Continuity' : 'Sanction Letter'}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}
      />
    </div>
  )
}

export default ApprovedTable;