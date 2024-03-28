import { useQuery } from 'react-query';
import React, { useState, useEffect } from 'react';
import DataTableViewer from '../../../../components/ReactTable/DataTableViewer';
import { getDeferralDataList, getStatsData } from '../../../../services/deferralDeviation.service';
import { Badge, Box, Button, Modal, Skeleton, Tabs, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import DeferralForm from './DeferralForm';
import { AttachmentOutlined } from '@material-ui/icons';
import { useDisclosure } from '@mantine/hooks';
import FilePreview from '../../../../components/CommonComponents/FilePreview';

const DeferralTable = ({ id, dealershipName, currentUser }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [openModal, setOpenModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [docUrl, setDocUrl] = useState([]);

  const { data: statusList = [], isLoading: statusListLoading, refetch: statusListRefetch } = useQuery({
    queryKey: ['get-deferral-stats'],
    queryFn: () => getStatsData(id, 'deferral'),
    // select: (data) => {
    //   console.log(data);
    //   data?.length > 0 && setActiveTab(data[0]?.current_status);
    //   return data;
    // }
  });

  const { data: deferralData = [], isLoading: deferralDataIsLoading, refetch: deferralDataRefetch } = useQuery({
    queryKey: ['get-deferral', activeTab],
    queryFn: () => getDeferralDataList(id, 'deferral', activeTab),
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (statusList && statusList.length > 0) {
      setActiveTab(statusList[0].current_status);
    }
  }, [statusList]);

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
      key: 'due_date',
      header: 'Due Date',
      enableColumnFilter: false,
    }, {
      key: 'maker_name',
      header: 'Maker',
      isHeaderDownload: false,
      enableColumnFilter: false,
    },
    {
      key: 'document_urls',
      header: 'Maker',
      isHeaderDownload: false,
      enableColumnFilter: false,
      cell: (value) => <Box onClick={() => { open(); setDocUrl(value?.getValue()[0]) }}>
        <AttachmentOutlined color='gray' size={16} />
      </Box>
    },
  ]

  const statusListView = (
    statusListLoading ? (
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
      // styles={tabStyle({ color: STATUS_COLORS[activeTab] })}
      >
        <Tabs.List>
          {
            statusList?.map((item) => {
              let st = (item?.current_status).charAt(0).toUpperCase() + (item?.current_status).slice(1);
              return (
                <Tabs.Tab
                  key={item?.current_status}
                  // color={STATUS_COLORS[item?.current_status]}
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
  )
  return (
    <>
      <DataTableViewer
        column={column}
        rowData={deferralData}
        title={'Deferral'}
        styles={null}
        showAction={<Button
          onClick={() => setOpenModal(true)}
          leftSection={<IconPlus size={18} />}
          size='xs'
        >
          Add Deferral
        </Button>
        }
        onRowClick={false}
        loading={deferralDataIsLoading}
        statusTab={{ show: true, custom: statusListView }}
        excelDownload
        filter={false}
      />
      <Modal size={'lg'} opened={opened} onClose={close} title="Preview Attachment">
        <FilePreview data={{image: docUrl[0]}} />
      </Modal>
      <Modal size={'lg'} opened={openModal} onClose={() => { setOpenModal(false) }} title="Create Deferral Data" centered>
        <DeferralForm refetch={() => { statusListRefetch(); deferralDataRefetch(); }} dealershipName={dealershipName} dealershipId={id} close={() => setOpenModal(false)} currentUser={currentUser} />
      </Modal>
    </>
  );
};

export default DeferralTable;