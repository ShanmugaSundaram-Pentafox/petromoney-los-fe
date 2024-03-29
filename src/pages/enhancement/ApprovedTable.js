import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import clsx from 'clsx';
import React, { useState, } from 'react';
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
import classes from './Enhancement.module.css'

const ApprovedTable = ({ title, onRowClick, filterQry, currentUser, actionable }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();
  const [type, setType] = useState('');
  const [loanId, setloanId] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [productTypeId, setProductTypeId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [dealershipId, setDealershipId] = useState();

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data-approved', filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus('approved', filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination-approved', filterQry],
    queryFn: () => getPageDetails('approved', filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: 'enhancement-download-approved',
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
  });

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
      header: 'Old Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'New Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'old_loan_amount',
      header: 'Old Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'new_loan_amount',
      header: 'New Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'action',
      header: 'Documents',
      isHeaderDownload: false,
      cell: ({ row }) => (
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
                <div className={classes.listItem} onClick={() => { setloanId(row?.original?.['loan_id']); setType('loc'); setDealershipId(row?.original?.dealership_id); setModalVisible(true); setLoanAmount(row?.original?.['current_loan_amount']); }}>
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
  ]

  return (
    <div className={classes.root}>
      <DataTableViewer
        title={title}
        rowData={getEnhancementDataQuery?.data}
        column={column}
        onRowClick={i => onRowClick(i.dealership_id, i, 'approved')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        totalNoOfPages={getEnhancementPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        columnsFilter={false}
        loading={getEnhancementDataQuery?.isLoading}
        excelDownload
        downloadQuery={{ query: enhancementDownloadQuery?.refetch, isLoading: enhancementDownloadQuery?.isFetching }}
      />
      <SignRequestLayout
        dealershipId={dealershipId}
        opened={modalVisible}
        loanId={loanId}
        loanAmount={loanAmount}
        productId={productTypeId}
        getStatus={true}
        type={type}
        title={type === 'application' ? 'eSign Application Form' : type === 'loc' ? 'Letter of Continuity' : 'Sanction Letter'}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}
      />
    </div>
  )
}

export default ApprovedTable;