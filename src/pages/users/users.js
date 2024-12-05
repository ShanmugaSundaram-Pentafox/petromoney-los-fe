import React, { useState } from 'react';
import { useQuery } from 'react-query';
import UsersTable from './components/UsersTable';
import { downloadUserData, getActiveUsersCountData, getUsersByPincode } from '../../services/users.service';
import { ActionIcon, Box, Grid, Paper, Skeleton, Table, Text, TextInput, Tooltip } from '@mantine/core';
import PieChartUsers from './components/PieChartUsers';
import { IconDownload } from '@tabler/icons-react';
import { getSignedUrl } from '../../services/common.service';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';

const Users = ({ currentUser }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [tableData, setTableData] = useState();
  const [apiFilter, setApiFilter] = useState({})
  const activeUsersCount = useQuery({
    queryKey: ['active-users-count'],
    queryFn: () => getActiveUsersCountData(),
  })

  const fo = activeUsersCount?.data && activeUsersCount?.data.find(item => item.role_name === 'FIELD_OFFICER')?.total_users || 0;
  const trans = activeUsersCount?.data && activeUsersCount?.data.find(item => item.role_name === 'TRANSPORTER')?.total_users || 0;
  const dealers = activeUsersCount?.data && activeUsersCount?.data.find(item => item.role_name === 'DEALER')?.total_users || 0;
  const others = activeUsersCount?.data?.filter(item => !['FIELD_OFFICER', 'TRANSPORTER', 'DEALER'].includes(item.role_name)).reduce((sum, item) => sum + item.total_users, 0);
  const [pincode, setPincode] = React.useState('');

  const getPincodeDetails = useQuery({
    queryKey: ['getPincodeDetails', pincode],
    queryFn: () => getUsersByPincode({ pincode }),
    enabled: Boolean(pincode?.length === 6),
  })

  const usersDownloadQuery = useQuery({
    queryKey: 'user-download',
    queryFn: () => downloadUserData(),
    onSuccess: (res) => {
      getSignedUrl(res?.data)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          displayNotification({ message: e, variant: 'error' });
        })
    },
    onError: (e) => {
      displayNotification({ message: e, variant: 'error' })
    },
    enabled: Boolean(false),
    retry: Boolean(false),
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role) {
      if (role === 'Field Officer') setApiFilter({role_id : '12', status : '1'})
      if (role === 'Dealer') setApiFilter({role_id : '13', status : '1'})
      if (role === 'Transporter') setApiFilter({role_id : '14', status : '1'})
      if (role === 'Others') setApiFilter({role_id: '1,2,3,4,5,6,7,8,9,10,11,15,16,17,18', status : '1'})
    } else {
      setApiFilter({})
    }
  }

  return (
    <Box>
      <Grid gutter={'md'}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PieChartUsers
            selectedRole={selectedRole}
            setSelectedRole={handleRoleSelect}
            loading={activeUsersCount?.isLoading}
            data={{
              field_officer: fo,
              dealer: dealers,
              transporter: trans,
              others: others,
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper h={344}>
            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px 10px', alignItems: 'center' }}>
              <Text style={{ color: 'gray', fontSize: '14px' }} mt={'md'}>Field Officer's by Pincode</Text>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Tooltip
                  label={<Text size={'xs'}>Download</Text>}
                  color={'dark'}
                  transitionProps={{ transition: 'pop', duration: 300 }}
                  withArrow
                  position='bottom'
                >
                  <ActionIcon
                    mt={'md'}
                    mr={'xs'}
                    size={'md'}
                    variant='outline'
                    color='gray.4'
                    loading={usersDownloadQuery?.isFetching}
                    onClick={() => {
                    usersDownloadQuery?.refetch()
                    }}
                  >
                    <IconDownload size={20} color='#4196f0' />
                  </ActionIcon>
                </Tooltip>
                <TextInput
                  placeholder={'Pincode'}
                  value={pincode}
                  size='xs'
                  mt={'md'}
                  type='number'
                  onChange={e => setPincode(e.target.value)}
                />
              </div>
            </Box>

            <Box style={{ overflow: 'hidden' }}>
              {(getPincodeDetails?.isFetching || getPincodeDetails?.data?.length)
                ? (
                  <Table.ScrollContainer mah={280} type='native'>
                    <Table stickyHeader style={{ fontSize: '12px' }} mb={'md'}>
                      <Table.Thead style={{ background: 'rgba(228, 237, 253, 1)' }}>
                        <Table.Tr>
                          <Table.Th>User Id</Table.Th>
                          <Table.Th>Name</Table.Th>
                          <Table.Th>Mobile</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {getPincodeDetails?.isFetching ? (
                          [1, 2, 3, 4, 5]?.map((item) => (
                            <Table.Tr key={item}>
                              <Table.Td><Skeleton height={16} variant="text" /></Table.Td>
                              <Table.Td><Skeleton height={16} variant="text" /></Table.Td>
                              <Table.Td><Skeleton height={16} variant="text" /></Table.Td>
                            </Table.Tr>
                          ))
                        ) : getPincodeDetails?.data?.map(user => (
                          <Table.Tr key={user.id}>
                            <Table.Td>{user.id}</Table.Td>
                            <Table.Td>{user.name}</Table.Td>
                            <Table.Td>{user.mobile}</Table.Td>
                          </Table.Tr>
                        ))
                        }
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                ) : (
                  <Text c={'#ccc'} ta={'center'} fz={'sm'} mt={100}>
                    {pincode?.length < 6 ? 'Enter Pincode to get field officers' : 'No User found for this pincode'}
                  </Text>
                )
              }
            </Box>
          </Paper>
        </Grid.Col>
        <Grid.Col>
          <UsersTable currentUser={currentUser} title="Users" apiFilter={apiFilter} setApiFilter={setApiFilter} userCountRefetch={activeUsersCount?.refetch}/>
        </Grid.Col>
      </Grid>
    </Box>
  )
}



export default Users;