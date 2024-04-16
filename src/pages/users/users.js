import React, { useState } from 'react';
import { useQuery } from 'react-query';
import UsersTable from './components/UsersTable';
import { getAllUsers, getUsersByPincode, getUsersByRole } from '../../services/users.service';
import { Box, Grid, Paper, Skeleton, Table, Text, TextInput } from '@mantine/core';
import PieChartUsers from './components/PieChartUsers';

const Users = ({ currentUser }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [tableData, setTableData] = useState();
  const allUsersDataQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(),
  })

  const fo = getUsersByRole(allUsersDataQuery?.data, 'FIELD_OFFICER');
  const trans = getUsersByRole(allUsersDataQuery?.data, 'TRANSPORTER');
  const dealers = getUsersByRole(allUsersDataQuery?.data, 'DEALER');
  const others = allUsersDataQuery?.data?.filter(user => !(['FIELD_OFFICER', 'TRANSPORTER', 'DEALER'].includes(user.role_name)));
  const [pincode, setPincode] = React.useState('');

  const getPincodeDetails = useQuery({
    queryKey: ['getPincodeDetails', pincode],
    queryFn: () => getUsersByPincode({ pincode }),
    enabled: Boolean(pincode?.length === 6),
  })
  const getUserById = id => {
    return allUsersDataQuery?.data?.find(item => item.id === id) || {};
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role) {
      if (role === 'Field Officer') setTableData(fo)
      if (role === 'Dealer') setTableData(dealers)
      if (role === 'Transporter') setTableData(trans)
      if (role === 'Others') setTableData(others)
    } else {
      setTableData(allUsersDataQuery?.data);
    }
  }

  return (
    <Box>
      <Grid gutter={'md'}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PieChartUsers
            selectedRole={selectedRole}
            setSelectedRole={handleRoleSelect}
            loading={allUsersDataQuery?.isLoading}
            data={{
              field_officer: fo?.length,
              dealer: dealers?.length,
              transporter: trans?.length,
              others: others?.length,
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper h={344}>
            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px 10px', alignItems: 'center' }}>
              <Text style={{ color: 'gray', fontSize: '14px' }} mt={'md'}>Field Officer's by Pincode</Text>
              <TextInput
                placeholder={'Pincode'}
                value={pincode}
                size='xs'
                mt={'md'}
                type='number'
                onChange={e => setPincode(e.target.value)}
              />
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
          <UsersTable loading={allUsersDataQuery?.isLoading} refetchQuery={allUsersDataQuery?.refetch} currentUser={currentUser} title="Users" data={tableData || allUsersDataQuery?.data} />
        </Grid.Col>
      </Grid>
    </Box>
  )
}



export default Users;