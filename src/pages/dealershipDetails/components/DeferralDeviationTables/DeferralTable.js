import { useQuery } from 'react-query';
import React, { useState, useEffect } from 'react';
import DataTableViewer from '../../../../components/ReactTable/DataTableViewer';
import { getDeferralDataList, getStatsData } from '../../../../services/deferralDeviation.service';
import { Badge, Box, Button, Flex, Group, Modal, Skeleton, Tabs, Text, Title, Tooltip } from '@mantine/core';
import { IconDownload, IconFileTypePdf, IconPhoto, IconPlus } from '@tabler/icons-react';
import DeferralForm from './DeferralForm';
import { AttachmentOutlined } from '@material-ui/icons';
import { useDisclosure } from '@mantine/hooks';
import FilePreview from '../../../../components/CommonComponents/FilePreview';
import { getSignedUrl } from '../../../../services/common.service';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';


export const FileListPreview = ({ onOpen, docUrl }) => {
  return (
    docUrl[0]?.map((file, index) => {
      return (
        <Tooltip key={index} label={'Click to Preview'}>
          <Box
            style={{
              position: 'relative',
              width: 70,
              height: 70,
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              border: '1px dashed gray',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={() => typeof (file) == 'string' ? onOpen(file) : null}
          >
            <Flex direction={'column'} align={'center'} justifyContent={'center'}>
              {file?.endsWith('.pdf') ? (
                <IconFileTypePdf size={28} color='gray' />
              ) : (
                <IconPhoto size={28} stroke={0.5} color='gray' />
              )}
              <Text c='gray.6'>{index + 1}</Text>
            </Flex>
          </Box>
        </Tooltip>
      )
    })
  )
}
  ;

const DeferralTable = ({ id, dealershipName, currentUser }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [openModal, setOpenModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [docUrl, setDocUrl] = useState([]);
  const [activeDoc, setActiveDoc] = useState();
  const [page, setPage] = useState(1);

  const { data: statusList = [], isLoading: statusListLoading, refetch: statusListRefetch } = useQuery({
    queryKey: ['get-deferral-stats', page, activeTab],
    queryFn: () => getStatsData(id, 'deferral'),
  });

  const { data: deferralData = [], isLoading: deferralDataIsLoading, refetch: deferralDataRefetch } = useQuery({
    queryKey: ['get-deferral', activeTab, page],
    queryFn: () => getDeferralDataList(id, 'deferral', activeTab, page),
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const getFileURL = () => {
    getSignedUrl(activeDoc)
      .then((res) => {
        window.open(res?.url)
      })
      .catch((e) => {
        displayNotification({
          message: e?.message || e,
          variant: 'error'
        })
      })
  }

  useEffect(() => {
    if (statusList && statusList.length > 0 && !statusList?.find((i) => i.current_status === activeTab)) {
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
      cell: (value) => <span>{value?.getValue() || dealershipName}</span>
    }, {
      key: 'checklist_name',
      header: 'Document type',
    }, {
      key: 'due_date',
      header: 'Due Date',
      enableColumnFilter: false,
    }, {
      key: 'maker_name',
      header: 'Raised By',
      isHeaderDownload: false,
      enableColumnFilter: false,
    },
    {
      key: 'document_urls',
      header: 'Attachments',
      isHeaderDownload: false,
      enableColumnFilter: false,
      cell: (value) => value?.getValue()?.length ? (
        <Box onClick={() => { open(); setDocUrl(value?.getValue()); setActiveDoc(value?.getValue()?.[0]?.[0]) }}>
          <AttachmentOutlined color='gray' size={16} />
        </Box>
      ) : null
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
        useAPIPagination
        page={page}
        setPage={setPage}
        styles={{
          overflowX: 'scroll',
          whiteSpace: 'wrap',
        }}
        totalNoOfPages={Math.ceil(parseInt(statusList?.find(i => i?.current_status)?.number_of_records) / 5)}
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
      <Modal
        size={'40%'}
        opened={opened}
        onClose={() => { close(); setActiveDoc('') }}
        title={
          <Group>
            <Title order={3}>Preview Attachment</Title>
            {activeDoc ? (
              <IconDownload
                style={{ cursor: 'pointer' }}
                size={20}
                color='green'
                onClick={getFileURL}
              />
            ) : null}
          </Group>
        }
      >
        <Flex gap={20}>
          <Flex direction={'column'} gap={2} rowGap={12}>
            {Array.isArray(docUrl) ? <FileListPreview docUrl={docUrl} onOpen={(f) => setActiveDoc(f)} /> : null}
          </Flex>
          {
            activeDoc ? <FilePreview data={{ image: activeDoc, type: activeDoc?.endsWith('.pdf') ? 'pdf' : null }} /> : <Text align='center' c={'gray'}>Click the documents to view</Text>
          }
        </Flex>
      </Modal>
      <Modal size={'lg'} opened={openModal} onClose={() => { setOpenModal(false) }} title="Create Deferral Data" centered>
        <DeferralForm refetch={() => { statusListRefetch(); deferralDataRefetch(); }} dealershipName={dealershipName} dealershipId={id} close={() => setOpenModal(false)} currentUser={currentUser} />
      </Modal>
    </>
  );
};

export default DeferralTable;