import { Box, Button, Group, Loader, Modal, Table } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getDDMSChecklist, getDeferralDetails, updateDeferralDetails } from '../../services/ddms.service';
import DDMSTable from './DDMSTable';
import { displayNotification } from '../CommonComponents/Notification/displayNotification';

const DDMSModal = ({
  opened = false,
  onClose = () => { },
  modalObj = {},
  queryKey = ''
}) => {
  const [deferral, setDeferral] = useState([]);
  const queryClient = useQueryClient()

  const deferralDetailsQuery = useQuery({
    queryKey: ['deferral-details', modalObj?.id],
    queryFn: () => getDeferralDetails({ id: modalObj?.id }),
    enabled: Boolean(opened),
    cacheTime: 0,
    select: (data) => {
      return { data: JSON.parse(data?.[0]?.checklist_mapping || "[]") || [], submitted: true }
      // return { data: [], submitted: true }
    }
  })

  const ddmsChecklistQuery = useQuery({
    queryKey: ['deferral-test', modalObj?.id],
    queryFn: () => getDDMSChecklist(),
    cacheTime: 0,
    enabled: Boolean(opened && deferralDetailsQuery?.data?.submitted),
    select: (data) => {
      let result = []
      data?.map((i) => {
        JSON.parse(i?.checklist)?.map((item) => {
          const checklist = deferralDetailsQuery?.data?.data?.find(i => i?.checklist_id === item?.id) || {};
          result.push({
            ...item,
            status: checklist?.status || 'rejected',
            deferral_deviation_mapping: checklist?.deferral_deviation_mapping || [],
          });
        })
      });
      return { data, result }
    }
  });

  const updateDeferralDetailsQuery = useMutation({
    mutationFn: (body) => updateDeferralDetails({ body }),
    onSuccess: () => {
      displayNotification({
        message: 'Deferral/Deviation updated successfully',
        variant: 'success',
      });
      queryKey && queryClient.invalidateQueries([queryKey]);
      onClose();
    },
    onError: e => {
      displayNotification({
        message: e?.message || e,
        variant: 'error',
      })
    }
  })

  useEffect(() => {
    setDeferral([])
  }, [opened])

  useEffect(() => {
    if (ddmsChecklistQuery?.data?.result) {
      setDeferral(ddmsChecklistQuery?.data?.result)
    }
  }, [ddmsChecklistQuery?.data])

  const handleDocChecklistUpdate = () => {
    const result = deferral?.map((i) => ({
      checklist_id: i?.id,
      deferral_deviation_mapping: i?.status === 'deferral/deviation' ? i?.deferral_deviation_mapping : [],
      status: i?.status,
    }))
    const body = {
      data: {
        checklist_mapping: result,
        dealership_id: modalObj?.id
      },
      id: modalObj?.id
    }
    updateDeferralDetailsQuery?.mutate(body)
  }

  const handleDataChange = (arr, val) => {
    let result = [...deferral];
    result?.splice(deferral?.indexOf(deferral?.find(i => i?.id === arr?.id)), 1, {
      ...arr,
      "status": val,
    })
    setDeferral(result)
  };

  const handleDeferralMapping = (arr, val) => {
    let result = [...deferral];
    result?.splice(
      deferral?.indexOf(deferral?.find(i => i?.id === arr?.id)),
      1,
      { ...deferral?.find(i => i?.id === arr?.id), "deferral_deviation_mapping": val })
    setDeferral(result)
  }

  return (
    <Modal
      opened={opened}
      onClose={() => { onClose(); setDeferral([]); }}
      title={'Document Checklist'}
      size={'70%'}
    >
      <div>
        <p id="modal-description">List of documents that need to collect</p>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Table>
          <Table.Tbody>
            {ddmsChecklistQuery?.data?.data?.length
              ? ddmsChecklistQuery?.data?.data?.map((item, index) => (
                <>
                  <Table.Thead key={index} style={{ fontWeight: '700', fontSize: '14px' }}>
                    <Table.Th colSpan={3}>
                      <Group gap={4}>
                        <p>{(index + 1) + '). '}</p>
                        <div>{item?.category}</div>
                      </Group>
                    </Table.Th>
                  </Table.Thead>
                  {JSON.parse(item?.checklist)?.map((value, i) => (
                    <Table.Tr key={`${item}-${i}`}>
                      <DDMSTable
                        value={value}
                        index={index}
                        innerIndex={i}
                        deferral={deferral?.find(i => i?.id === value?.id)}
                        deferralStatus={deferral?.find(i => i?.id === value?.id)?.status}
                        dealershipId={modalObj?.id}
                        handleDataChange={handleDataChange}
                        handleDeferralMapping={handleDeferralMapping}
                      />
                    </Table.Tr>
                  ))}
                </>
              )) : ddmsChecklistQuery?.isLoading ? <center><Loader /></center> : <center>No Data to display</center>}
          </Table.Tbody>
        </Table>
      </div>
      <Group justify='flex-end' mt={'md'}>
        <Button
          size='xs'
          variant='outline'
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          size='xs'
          color='green'
          loading={updateDeferralDetailsQuery?.isLoading}
          onClick={() => handleDocChecklistUpdate()}
        >
          Save
        </Button>
      </Group>
    </Modal>
  )
}

export default DDMSModal