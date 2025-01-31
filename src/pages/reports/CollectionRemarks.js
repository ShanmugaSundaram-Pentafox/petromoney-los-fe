import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemarkData } from '../../services/users.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Group } from '@mantine/core';
import DateFilter from '../../components/CommonComponents/DateFilter/DateFilter';
import { useDebouncedState } from '@mantine/hooks';
import { getSignedUrl } from '../../services/common.service';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import Currency from '../../components/Number/Currency';

const CollectionRemarks = () => {
  usePageTitle('Collection Remarks');
  const [search, setSearch] = useDebouncedState('', 500);
  const [dateObj, setDateObj] = useState({ from: new Date(), to: new Date() });
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [page, setPage] = useState(1)
  const { data: testData = [], isFetching } = useQuery(['remark-Data', search, dateObj, page], () => getCollectionRemarkData({ search, dateObj, page }), {
    refetchOnWindowFocus: false
  });
  useEffect(() => {
    page != 1 && setPage(1)
  }, [search,dateObj])

  const downloadReport = () => {
    setDownloadLoading(true)
    getCollectionRemarkData({ search, dateObj, download: true })
      .then((res) => {
        getSignedUrl(res?.data)
          .then((res) => {
            window.open(res?.url, '_blank');
          })
          .catch(e => {
            displayNotification({
              message: e?.message || e,
              variant: 'error',
            })
          })
          .finally(() => {
            setDownloadLoading(false);
          })
      })
  }

  const column = [
    {
      key: 'cust_code',
      header: 'Dealership Id',
      enableColumnFilter: false,
    }, {
      key: 'applicant_name',
      header: 'Applicant Name',
      enableColumnFilter: false,
    }, {
      key: 'cust_region',
      header: 'Region',
    }, {
      key: 'prospect_code',
      header: 'Prospect Code'
    }, {
      key: 'loan_status',
      header: 'Loan Status',
    }, {
      key: 'dpd',
      header: 'DPD',
      cell: (value) => <div style={{ textAlign: 'right' }}>{value?.getValue()}</div>
    }, {
      key: 'last_modified_by_value',
      header: 'Created By',
    }, {
      key: 'created_date',
      header: 'Created Date',
    }, {
      key: 'remarks_value',
      header: 'Remarks',
    }, {
      key: 'ptp_date',
      header: 'PTP Date',
      cell: (value) => <span>{value?.getValue() ? value?.getValue() : '-'}</span>
    }, {
      key: 'tranche_amount',
      header: 'Tranche Amount',
      cell: (value) => <span><Currency value={value?.getValue()} /></span>
    }, {
      key: 'outstanding',
      header: 'Outstanding',
      cell: (value) => <span><Currency value={value?.getValue()} /></span>
    }, {
      key: 'receipt_date',
      header: 'Receipt Date',
      cell: (value) => <span>{value?.getValue() ? value?.getValue() : '-'}</span>

    },
  ]

  return (
    <div>
      <DataTableViewer
        rowData={testData?.data}
        title={'Collection Remarks'}
        downloadQuery={{ query: downloadReport, isLoading: downloadLoading }}
        excelDownload
        column={column}
        loading={isFetching}
        page={page}
        setPage={setPage}
        totalNoOfPages={testData?.total_pages}
        filter={false}
        apiSearch={setSearch}
        useAPIPagination
        action={
          <Group justify='flex-end'>
            <DateFilter filterObj={setDateObj} />
          </Group>}
      />
    </div>
  )
}

export default CollectionRemarks
