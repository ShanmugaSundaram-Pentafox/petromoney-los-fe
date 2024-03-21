import { useQuery } from 'react-query';
import React, { useState, useEffect } from 'react';
import DataTableViewer from '../../../../components/ReactTable/DataTableViewer';
import { getDeferralDataList, getStatsData } from '../../../../services/deferralDeviation.service';
import { Badge, Button, Modal, Skeleton, Tabs, Text } from '@mantine/core';
import DeviationForm from './DeviationForm';
import { IconPlus } from '@tabler/icons-react';

const DeviationTable = ({ id, dealershipName }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [openModal, setOpenModal] = useState(false);

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
      key: 'party_id',
      header: 'Customer ID',
      enableColumnFilter: false,
    }, {
      key: 'code',
      header: 'Code',
      enableColumnFilter: false,
    }, {
    }, {
      key: 'party_name',
      header: 'Customer Name',
      enableColumnFilter: false,
    }, {
      key: 'applicant_type',
      header: 'Applicant Type',
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
        showStatusTab={statusListView}
        excelDownload
        filter={false}
      />
      <Modal size={'lg'} opened={openModal} onClose={() => { setOpenModal(false) }} title="Create Deviation Data" centered>
        <DeviationForm dealershipId={id} refetch={() => { deviationDataRefetch(); statusListRefetch(); }} dealershipName={dealershipName} close={() => setOpenModal(false)} />
      </Modal>
    </>
  );
};

export default DeviationTable;