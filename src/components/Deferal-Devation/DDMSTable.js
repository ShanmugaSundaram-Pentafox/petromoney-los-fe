import { Box, Button, Group, Loader, Modal, MultiSelect, Select, Table, Tooltip } from '@mantine/core';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { getDeferralMappingById } from '../../services/ddms.service';
import classes from './DDMS.module.css'
import { IconInfoCircle, IconTrash } from '@tabler/icons-react';
import RichTextEditorBox from '../RichTexEditor/RichTextEditorBox';
import { displayNotification } from '../CommonComponents/Notification/displayNotification';

const DDMSTable = ({
  deferral,
  deferralStatus,
  index,
  value,
  innerIndex,
  dealershipId,
  headerValue,
  handleDeferralMapping,
  handleDelete,
  handleDataChange,
}) => {

  const [modalObj, setModalObj] = useState({ modal: false })
  const [remarksModal, setRemarksModal] = useState({})
  const getDeferralMappingQuery = useQuery({
    queryKey: ['deferral-mapping', index, innerIndex, deferralStatus],
    queryFn: () => getDeferralMappingById({ dealershipId, id: headerValue?.category_id }),
    enabled: Boolean(dealershipId && deferralStatus === 'deferral/deviation'),
    select: (data) => {
      return data?.map(item => ({
        label: `${item?.code} (${item?.due_date})`,
        value: item?.id?.toString(),
        ...item,
      }))
    }
  })

  const handleDataChangeModal = (val) => {
    if (val === 'rejected') {
      setModalObj({ modal: true, value, title: 'Rejected Remarks', data: val, })
      return;
    }
    handleDataChange(value, val)
  }
  return (
    <>
      <Table.Td>
        <Group gap={4} ml={12}>
          <p style={{ maxWidth: '400px', whiteSpace: 'wrap' }}>{(index + 1) + '.' + (innerIndex + 1) + ' ' + value?.name}</p>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={4} style={{ flexWrap: 'nowrap' }}>
          <Box style={{ width: 200 }}>
            <Select
              data={[
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Deferral/Deviation', value: 'deferral/deviation' },
                { label: 'Not Required', value: 'not-required' },
              ]}
              defaultValue={'not-required'}
              allowDeselect={false}
              size='xs'
              styles={{
                dropdown: {
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
                }
              }}
              value={deferral?.status}
              onChange={(e) => handleDataChangeModal(e)}
            />
          </Box>
          {deferral?.remarks ? (
            <Tooltip label={'click to view remarks'} withArrow color='gray'>
              <IconInfoCircle color='#ccc' size={16} onClick={() => setRemarksModal({ modal: true, remarks: deferral?.remarks })} />
            </Tooltip>
          ) : null}
        </Group>
      </Table.Td>
      <Table.Td style={{ width: 250 }}>
        {deferralStatus === 'deferral/deviation'
          ? (
            <MultiSelect
              data={getDeferralMappingQuery?.data || []}
              value={getDeferralMappingQuery?.isLoading ? [] : deferral?.deferral_deviation_mapping || []}
              size='xs'
              clearable
              // disabled={getDeferralMappingQuery?.isFetching}
              rightSection={getDeferralMappingQuery?.isFetching && <Loader size={14} type='dots' />}
              onChange={(e) => {
                handleDeferralMapping(value, e)
              }}
              styles={{
                dropdown: {
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
                },
                pillsList: {
                  width: '100%',
                  whiteSpace: 'nowrap',
                  height: '19px',
                  overflow: 'hidden'
                }
              }}
            />
          )
          : <center>-</center>
        }
      </Table.Td>
      <Table.Td>
        {index === 13 ?
          (
            <Tooltip label={'Click to delete'} withArrow color='gray'>
              <IconTrash size={16} color='red' className={classes?.trash} onClick={() => handleDelete(innerIndex)} />
            </Tooltip>
          ) : null
        }
      </Table.Td>
      <Modal
        opened={Boolean(modalObj?.modal)}
        onClose={() => setModalObj({})}
        size={'lg'}
        title={modalObj?.title}
      >
        <RichTextEditorBox onChange={(e) => setModalObj(old => ({ ...old, remarks: e }))} />
        <Group mt={'md'} justify='flex-end'>
          <Button size='xs' variant='outline' onClick={() => setModalObj({})}>Cancel</Button>
          <Button size='xs' color='green' onClick={() => {
            if (modalObj?.remarks?.length) {
              handleDataChange(value, modalObj?.data, '', modalObj?.remarks);
              setModalObj({})
              return;
            }
            displayNotification({
              message: 'Please enter remarks',
              variant: 'warning',
            })
          }}>Save</Button>
        </Group>
      </Modal>
      <Modal opened={remarksModal?.modal} onClose={() => setRemarksModal({})} title={'Remarks Modal'}>
        <div dangerouslySetInnerHTML={{ __html: remarksModal?.remarks }} />
      </Modal>
    </>
  )
}

export default DDMSTable