import { ActionIcon, Button, Group, Loader, Popover, ScrollArea, Skeleton, Table, Text, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getDDMSChecklist, updateDeferralDetails } from '../../../services/ddms.service';
import { IconPlus } from '@tabler/icons-react';
import classes from '../../../components/Deferal-Devation/DDMS.module.css'
import DDMSTable from '../../../components/Deferal-Devation/DDMSTable';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { getDocumentChecklistMaster } from '../../../services/deferralDeviation.service';

const PDCChecklistMaster = ({
  opened = true,
  onClose = () => { },
  modalObj = {},
  queryKey = ''
}) => {
  const [othersText, setOthersText] = useState();
  const [othersObj, setOthersObj] = useState();
  const [deferral, setDeferral] = useState([]);
  const [remarksModalObj, setRemarksModalObj] = useState({});
  // const [checklistCategory, setCheckListCategory] = useState([]);
  const queryClient = useQueryClient()

  const deferralDetailsQuery = useQuery({
    queryKey: ['deferral-details'],
    queryFn: () => getDocumentChecklistMaster({ id: modalObj?.id }),
    enabled: Boolean(opened),
    cacheTime: 0,
    select: (data) => {
      return { data: JSON.parse(data?.[0]?.checklist_mapping || '[]') || [], submitted: true }
    }
  })

  const ddmsChecklistQuery = useQuery({
    queryKey: ['deferral-test', modalObj?.id],
    queryFn: () => getDDMSChecklist(),
    cacheTime: 0,
    enabled: Boolean(opened && deferralDetailsQuery?.data?.submitted),
    select: (data) => {
      let result = []
      let othersObj = []
      data?.map((i) => {
        JSON.parse(i?.checklist)?.map((item) => {
          const checklist = deferralDetailsQuery?.data?.data?.find(i => i?.checklist_id === item?.id) || {};
          if (i?.category?.toLowerCase() === 'others docs') {
            if (deferralDetailsQuery?.data?.data?.filter(i => i?.category?.toLowerCase() === 'others docs')?.length) {
              deferralDetailsQuery?.data?.data?.filter(i => i?.category?.toLowerCase() === 'others docs')?.map((otherItem) => {
                othersObj.push({
                  ...item,
                  name: otherItem?.checklist_name,
                  remarks: otherItem?.remarks,
                  category: otherItem?.category,
                  status: otherItem?.status || 'not-required',
                  deferral_deviation_mapping: checklist?.deferral_deviation_mapping || [],
                })
              })
            } else {
              othersObj.push({
                ...item,
                category: i?.category,
                status: item?.status || 'not-required',
                deferral_deviation_mapping: item?.deferral_deviation_mapping || [],
              })
            }
          } else {
            result.push({
              ...item,
              category: i?.category,
              remarks: checklist?.remarks,
              status: checklist?.status || 'not-required',
              deferral_deviation_mapping: checklist?.deferral_deviation_mapping || [],
            });
          }
        })
      });
      let otherData = data?.filter((i) => i?.category?.toLowerCase() === 'others docs');
      let normalData = data?.filter((i) => i?.category?.toLowerCase() !== 'others docs');
      return { data: [...normalData, { ...otherData?.[0], checklist: '[]' }], result, othersObj }
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
    if (ddmsChecklistQuery?.data?.result) {
      setDeferral(ddmsChecklistQuery?.data?.result)
      setOthersObj(ddmsChecklistQuery?.data?.othersObj)
    }
  }, [ddmsChecklistQuery?.data])

  const handleDocChecklistUpdate = () => {
    const result = deferral?.map((i) => ({
      checklist_id: i?.id,
      category: i?.category,
      checklist_name: i?.name,
      remarks: i?.remarks || null,
      deferral_deviation_mapping: i?.status === 'deferral/deviation' ? i?.deferral_deviation_mapping : [],
      status: i?.status,
    }));
    const resultOthers = othersObj?.map((i) => ({
      checklist_id: i?.id,
      category: i?.category,
      remarks: i?.remarks || null,
      checklist_name: i?.name,
      deferral_deviation_mapping: i?.status === 'deferral/deviation' ? i?.deferral_deviation_mapping : [],
      status: i?.status,
    }))
    if ([...result, ...resultOthers]?.filter((i) => (i?.status === 'deferral/deviation' && !i?.deferral_deviation_mapping?.length))?.length) {
      displayNotification({
        message: 'Please select any deferral/deviation mapping, It cant be null',
        variant: 'warning',
      });
      return;
    }
    const body = {
      data: {
        checklist_mapping: [...result, ...resultOthers],
        dealership_id: modalObj?.id
      },
      id: modalObj?.id
    }
    updateDeferralDetailsQuery?.mutate(body)
  }

  const handleDataChange = (arr, val, type, remarks = null) => {
    if (type === 'others') {
      let result = [...othersObj];
      result?.splice(othersObj?.indexOf(othersObj?.find(i => i?.name === arr?.name)), 1, {
        ...arr,
        'status': val,
        remarks: remarks,
        'deferral_deviation_mapping': val === 'deferral/deviation' ? arr?.deferral_deviation_mapping : []
      })
      setOthersObj(result)
    } else {
      let result = [...deferral];
      result?.splice(deferral?.indexOf(deferral?.find(i => i?.id === arr?.id)), 1, {
        ...arr,
        'status': val,
        remarks: remarks,
        'deferral_deviation_mapping': val === 'deferral/deviation' ? arr?.deferral_deviation_mapping : []
      })
      setDeferral(result)
    }
  };
  const handleDeferralMapping = (arr, val, type) => {
    if (type === 'others') {
      let result = [...othersObj];
      result?.splice(
        othersObj?.indexOf(othersObj?.find(i => i?.id === arr?.id)),
        1,
        { ...othersObj?.find(i => i?.id === arr?.id), 'deferral_deviation_mapping': val })
      setOthersObj(result)
    } else {
      let result = [...deferral];
      result?.splice(
        deferral?.indexOf(deferral?.find(i => i?.id === arr?.id)),
        1,
        { ...deferral?.find(i => i?.id === arr?.id), 'deferral_deviation_mapping': val })
      setDeferral(result)
    }
    // setCheckListCategory(old => ({ ...old, [arr?.category]: [...val, ...old?.[arr?.category]] }))
  }

  const handleOthersChanges = () => {
    if (!othersText?.text?.length) {
      displayNotification({
        message: 'Please enter the value',
        variant: 'warning',
      })
      return
    }
    setOthersObj([
      ...othersObj,
      {
        category: 'OTHERS DOCS',
        name: othersText?.text,
        status: 'not-required',
        deferral_deviation_mapping: [],
      }
    ]);
    setOthersText({});
  }

  const handleDelete = (i) => {
    const result = [...othersObj]
    result?.splice(i, 1)
    setOthersObj(result)
  }

  return (
    <>
      
      <ScrollArea h={'70vh'} scrollbars='y' p={12}>
        <div>
          {(ddmsChecklistQuery?.isLoading || deferralDetailsQuery?.isLoading) ? (
            <Skeleton height={15} width={250} />
          ) : (
              ddmsChecklistQuery?.data?.data?.length ? (
                <p id="modal-description">List of documents that need to collect</p>
              ) : null
          )}
        </div>
        <div style={{ marginTop: '10px' }}>
          <Table>
            <Table.Tbody>
              {ddmsChecklistQuery?.data?.data?.length
                ? <>
                  {ddmsChecklistQuery?.data?.data?.map((item, index) => (
                    <>
                      <Table.Thead key={index} style={{ fontWeight: '700', fontSize: '14px' }}>
                        <Table.Th colSpan={3}>
                          <Group mt={4} gap={4} style={{ alignItems: 'center' }}>
                            <p>{(index + 1) + '). '}</p>
                            <div>{item?.category}</div>
                            {item?.category_id == 13 ?
                              <Popover withArrow position='top-start' shadow='xl' opened={Boolean(othersText?.modal)} onClose={() => setOthersText({})}>
                                <Popover.Target>
                                  <ActionIcon variant='subtle' onClick={() => setOthersText({ modal: true })}>
                                    <IconPlus size={16} />
                                  </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown>
                                  <Text>Enter name to add new particulars</Text>
                                  <Group style={{ alignItems: 'flex-end' }} gap={4}>
                                    <TextInput size='xs' label={'Name'} onChange={(e) => setOthersText({ modal: true, text: e?.target?.value })} value={othersText?.text} />
                                    <Button size='xs' onClick={handleOthersChanges}>Create</Button>
                                  </Group>
                                </Popover.Dropdown>
                              </Popover>
                              : null}
                          </Group>
                        </Table.Th>
                      </Table.Thead>
                      {JSON?.parse(item?.checklist)?.map((value, i) => (
                        <Table.Tr key={`${item}-${i}`}>
                          <DDMSTable
                            value={value}
                            index={index}
                            innerIndex={i}
                            headerValue={item}
                            deferral={deferral?.find(i => i?.id === value?.id)}
                            deferralStatus={deferral?.find(i => i?.id === value?.id)?.status}
                            dealershipId={modalObj?.id}
                            handleDataChange={handleDataChange}
                            handleDeferralMapping={handleDeferralMapping}
                          />
                        </Table.Tr>
                      ))}
                    </>
                  ))}
                  {othersObj?.map((value, i) => (
                    <Table.Tr key={`${value?.name}-${i}`} className={classes?.boxMain}>
                      <DDMSTable
                        value={value}
                        index={13}
                        innerIndex={i}
                        headerValue={ddmsChecklistQuery?.data?.data?.find((i) => i?.category?.toLowerCase() === 'others docs')}
                        deferral={othersObj?.find(i => i?.name === value?.name)}
                        deferralStatus={othersObj?.find(i => i?.name === value?.name)?.status}
                        handleDelete={handleDelete}
                        dealershipId={modalObj?.id}
                        handleDataChange={(arr, val) => handleDataChange(arr, val, 'others')}
                        handleDeferralMapping={(arr, val) => handleDeferralMapping(arr, val, 'others')}
                      />
                    </Table.Tr>
                  ))}
                </>
                : (ddmsChecklistQuery?.isLoading || deferralDetailsQuery?.isLoading) ? <center><Loader /></center> : <center>No Data to display</center>}
            </Table.Tbody>
          </Table>
        </div>
      </ScrollArea>
      {ddmsChecklistQuery?.data?.data?.length ? (
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
      ) : null
      }
     
    </>
  )
}

export default PDCChecklistMaster;