import { Box, Group, Loader, MultiSelect, Select, Table, Tooltip } from '@mantine/core';
import React from 'react'
import { useQuery } from 'react-query';
import { getDeferralMappingById } from '../../services/ddms.service';

const DDMSTable = ({
  deferral,
  deferralStatus,
  index,
  value,
  innerIndex,
  dealershipId,
  headerValue,
  handleDeferralMapping,
  handleDataChange,
}) => {

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

  return (
    <>
      <Table.Td>
        <Group gap={4} ml={4}>
          <p>{(index + 1) + '.' + (innerIndex + 1) + '). '}</p>
          <p style={{ maxWidth: '400px' }}>{value?.name}</p>
        </Group>
      </Table.Td>
      <Table.Td>
        <Box style={{ width: 200 }}>
          <Select
            data={[
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Deferral/Deviation', value: 'deferral/deviation' },
              { label: 'Not Required', value: 'not-required' },
            ]}
            defaultValue={'rejected'}
            size='xs'
            styles={{
              dropdown: {
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
              }
            }}
            value={deferral?.status}
            onChange={(e) => handleDataChange(value, e)}
          />
        </Box>
      </Table.Td>
      <Table.Td style={{ width: 250 }}>
        {deferralStatus === 'deferral/deviation'
          ? (
            <MultiSelect
              data={getDeferralMappingQuery?.data || []}
              value={getDeferralMappingQuery?.isLoading ? [] : deferral?.deferral_deviation_mapping || []}
              size='xs'
              clearable
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
    </>
  )
}

export default DDMSTable