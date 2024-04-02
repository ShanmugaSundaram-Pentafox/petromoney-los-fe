import { useQuery } from 'react-query';
import React, { useState, useEffect } from 'react';
import DataTableViewer from '../../../../components/ReactTable/DataTableViewer';
import { getDeferralDataList, getStatsData } from '../../../../services/deferralDeviation.service';
import { Badge, Box, Button, Modal, Skeleton, Tabs, Text } from '@mantine/core';
import DeviationForm from './DeviationForm';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { AttachmentOutlined } from '@material-ui/icons';

const DeviationTable = ({ id, dealershipName }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [openModal, setOpenModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [docUrl, setDocUrl] = useState([]);


  const { data: statusList, isLoading: statusListIsLoading, refetch: statusListRefetch } = useQuery({
    queryKey: ['get-deviation-stats'],
    queryFn: () => getStatsData(id, 'deviation'),
    refetchOnWindowFocus: false
  });

  const { data: deviationData = [], isLoading: deviationDataIsLoading, refetch: deviationDataRefetch } = useQuery({
    queryKey: ['get-deviation', activeTab],
    queryFn: () => getDeferralDataList(id, 'deviation', activeTab),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (statusList && statusList.length > 0) {
      setActiveTab(statusList[0].current_status);
    }
  }, [statusList]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const column = [
    {
      key: 'code',
      header: 'Code',
      enableColumnFilter: false,
    }, {
      key: 'applicant_type',
      header: 'Type',
      cell: (value) => <span>{value?.getValue()?.toUpperCase() || 'Dealership'}</span>
    }, {
      key: 'applicant_name',
      header: 'Applicant Name',
      enableColumnFilter: false,
    }, {
      key: 'checklist_name',
      header: 'Document type',
    }, {
      key: 'maker_name',
      header: 'Raised by',
      isHeaderDownload: false,
      enableColumnFilter: false,
    },
    {
      key: 'document_urls',
      header: 'Attachment',
      isHeaderDownload: false,
      enableColumnFilter: false,
      cell: (value) => <Box onClick={() => { open(); setDocUrl(value?.getValue()) }}>
        <AttachmentOutlined color='gray' size={16} />
      </Box>
    },
  ]

  const statusListView = (
    statusListIsLoading ? (
      <Tabs
        value={'tab1'}
      >
        <Tabs.List>
          {[1, 2, 3, 4, 5]?.map((item, index) => (
            <Tabs.Tab
              key={index}
              color={'gray'}
              value={'tab' + item}
            >
              <Skeleton height={18} width={80} />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    ) : (
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
      >
        <Tabs.List>
          {
            statusList?.map((item) => {
              let st = (item?.current_status).charAt(0).toUpperCase() + (item?.current_status).slice(1);
              return (
                <Tabs.Tab
                  key={item?.current_status}
                  rightSection={
                    <Badge variant='light'>
                      {item?.number_of_records}
                    </Badge>
                  }
                  value={item?.current_status}
                >
                  <Text style={{ fontWeight: 400, color: 'rgb(155, 155, 155)' }}>{st}</Text>
                </Tabs.Tab>
              );
            })
          }
        </Tabs.List>
      </Tabs>
    )
  );

  return (
    <>
      <DataTableViewer
        column={column}
        rowData={deviationData}
        title={'Deviations'}
        onRowClick={false}
        styles={null}
        loading={deviationDataIsLoading}
        showAction={
          <Button
            onClick={() => setOpenModal(true)}
            leftSection={<IconPlus size={18} />}
            size='xs'
          >
            Add Deviation
          </Button>
        }
        statusTab={{ show: true, custom: statusListView }}
        excelDownload
        filter={false}
      />
      <Modal size={'xl'} opened={opened} onClose={close} title="Preview Attachment">
        {/* <Text>{docUrl[0]}</Text>
<Text>{docUrl[1]}</Text> */}
      </Modal>
      <Modal size={'lg'} opened={openModal} onClose={() => { setOpenModal(false) }} title="Create Deviation Data" centered>
        <DeviationForm dealershipId={id} refetch={() => { deviationDataRefetch(); statusListRefetch(); }} dealershipName={dealershipName} close={() => setOpenModal(false)} />
      </Modal>
    </>
  );
};

export default DeviationTable;