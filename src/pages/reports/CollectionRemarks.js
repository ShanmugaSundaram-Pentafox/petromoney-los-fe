import { Drawer } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { CollectionRemarksDrawer } from './CollectionRemarksDrawer';
import usePageTitle from '../../hooks/usePageTitle';
import { getCollectionRemarkData } from '../../services/users.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Grid, Group, Modal, Table, Text } from '@mantine/core';
import moment from 'moment';
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
  const [selectedCollectionRemarks, setSelectedCollectionRemarks] = useState({ modal: false, data: [] })
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
      key: 'action',
      header: 'Loan Details',
      cell: ({ row }) => {
        if (row?.original?.loan_data)
          return (
            row?.original?.loan_data?.map((remark, i) => {
              return (
                <div style={{
                  marginTop: 4
                }} key={i}>
                  <div style={{
                    whiteSpace: 'nowrap',
                    color: '#228be6',
                    cursor: 'pointer',
                  }} onClick={() => setSelectedCollectionRemarks({ modal: true, data: remark, totalData: row?.original })}>{remark.prospectcode + '-' + remark.loan_status + '-' + remark.dpd}</div>
                </div>
              )
            })
          )
      },
    }
  ]
  console.log(selectedCollectionRemarks);
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
      <Modal size={'lg'} opened={selectedCollectionRemarks?.modal} title='Collection Remarks' onClose={() => setSelectedCollectionRemarks({ modal: false, data: [] })}>
        <>
          <Grid>
            <Grid.Col span={6}>
              <Group>
                <Text>Customer Name:</Text>
                <Text fw={600}>{selectedCollectionRemarks?.totalData?.applicant_name}</Text>
              </Group>
              <Group mt={'sm'}>
                <Text>DPD Days</Text>
                <Text fw={600}>{selectedCollectionRemarks?.data?.dpd}</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group>
                <Text>Prospect Code:</Text>
                <Text fw={600}>{selectedCollectionRemarks?.data?.prospectcode}</Text>
              </Group>
            </Grid.Col>
          </Grid>
          <Table mt={'md'} striped highlightOnHover style={{ fontSize: 12 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Created By</Table.Th>
                <Table.Th>Created Date</Table.Th>
                <Table.Th>Remarks</Table.Th>
                <Table.Th>PTP Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {selectedCollectionRemarks?.data?.collection_remarks?.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{item?.last_modified_by_value}</Table.Td>
                  <Table.Td>{item?.created_date}</Table.Td>
                  <Table.Td>{item?.remarks_value}</Table.Td>
                  <Table.Td>{item?.ptp_date ? moment(item?.ptp_date, 'DD-MM-YYYY').format('DD MMM YYYY') : '-'}</Table.Td>
                </Table.Tr>
              ))
              }
            </Table.Tbody>
          </Table>
        </>
      </Modal>
    </div>
  )
}

export default CollectionRemarks
