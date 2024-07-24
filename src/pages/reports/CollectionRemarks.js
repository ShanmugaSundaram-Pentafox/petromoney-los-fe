import { Drawer } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { CollectionRemarksDrawer } from './CollectionRemarksDrawer';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemarkData } from '../../services/users.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Group } from '@mantine/core';
import DateFilter from '../../components/CommonComponents/DateFilter/DateFilter';
import { useDebouncedState } from '@mantine/hooks';
import { getSignedUrl } from '../../services/common.service';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';

const CollectionRemarks = () => {
  usePageTitle('Collection Remarks');
  const [rowData, setRowData] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [search, setSearch] = useDebouncedState('', 500);
  const [dateObj, setDateObj] = useState({ from: new Date(), to: new Date() });
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [page, setPage] = useState(1)
  const { data: testData = [], isFetching } = useQuery(['remark-Data', search, dateObj, page], () => getCollectionRemarkData({ search, dateObj, page }), {
    refetchOnWindowFocus: false
  });
  useEffect(() => {
    page != 1 && setPage(1)
  }, [search])

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
    }, {
      key: 'tranche_amount',
      header: 'Tranche Amount',
    }, {
      key: 'outstanding',
      header: 'Outstanding',
    }, {
      key: 'receipt_date',
      header: 'Receipt Date',
    },    
  ]

  return (
    <div>
      <DataTableViewer
        rowData={testData?.data}
        title={'Remarks'}
        downloadQuery={{ query: downloadReport, isLoading: downloadLoading }}
        excelDownload
        column={column}
        loading={isFetching}
        page={page}
        setPage={setPage}
        totalNoOfPages={testData?.total_pages}
        filter={false}
        onRowClick={i => { setRowData(i); setOpenModal(true) }}
        apiSearch={setSearch}
        useAPIPagination
        action={
          <Group justify='flex-end'>
            <DateFilter filterObj={setDateObj} />
          </Group>}
      />
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <CollectionRemarksDrawer callback={() => setOpenModal(false)} rowData={rowData} />
      </Drawer>
    </div>
  )
}

export default CollectionRemarks
