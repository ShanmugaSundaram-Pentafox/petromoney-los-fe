import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { VictoryPie } from 'victory';
import UsersTable from './components/UsersTable';
import ChartCard from '../../components/CommonComponents/ChartCard/ChartCard';
import { resources_id } from '../../config/accessControl';
import { CHART_COLORS } from '../../config/constants';
import usePageTitle from '../../hooks/usePageTitle';
import { getAllUsers, getUsersByPincode, getUsersByRole } from '../../services/users.service';
import { setAllUsers } from '../../store/dashboard/dashboard.actions';
import { isAllowed } from '../../utils/cerbos';
import { Box, Grid, Paper, ScrollArea, Skeleton, Table, Text, TextInput } from '@mantine/core';
import PieChartUsers from './components/PieChartUsers';

const Users = ({ currentUser, allUsers, setAllUsersData }) => {
  usePageTitle('All Users');
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null);
  const [tableData, setTableData] = React.useState([]);
  useMount(() => {
    // allow only if current user has permission to access users module
    if (isAllowed(currentUser?.permissions, resources_id?.navigation, 'users')) {
      setLoading(true);
      getAllUsers()
        .then(data => {
          setAllUsersData(data);
          setTableData(data)
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false)
        })
    }
  })
  const fo = getUsersByRole(allUsers, 'FIELD_OFFICER');
  const trans = getUsersByRole(allUsers, 'TRANSPORTER');
  const dealers = getUsersByRole(allUsers, 'DEALER');
  const others = allUsers.filter(user => !(['FIELD_OFFICER', 'TRANSPORTER', 'DEALER'].includes(user.role_name)));
  const [currency, setCurrency] = React.useState();
  const [pincode, setPincode] = React.useState('');

  const getPincodeDetails = useQuery({
    queryKey: ['getPincodeDetails', pincode],
    queryFn: () => getUsersByPincode({ pincode }),
    enabled: Boolean(pincode?.length === 6),
  })
  const getUserById = id => {
    return allUsers.find(item => item.id === id) || {};
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role) {
      if (role === 'Field Officer') setTableData(fo)
      if (role === 'Dealer') setTableData(dealers)
      if (role === 'Transporter') setTableData(trans)
      if (role === 'Others') setTableData(others)
    } else {
      setTableData(allUsers);
    }
  }

  return (
    <Box>
      <Grid gutter={'md'}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PieChartUsers
            selectedRole={selectedRole}
            setSelectedRole={handleRoleSelect}
            loading={loading}
            data={{
              field_officer: fo.length,
              dealer: dealers.length,
              transporter: trans.length,
              others: others.length,
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
          <UsersTable loading={loading} currentUser={currentUser} title="Users" data={tableData} />
        </Grid.Col>
      </Grid>
    </Box>
  )
}

const mapStateToProps = ({ dashboard }) => ({
  allUsers: dashboard.allUsers
})

const mapDispatchToProps = dispatch => ({
  setAllUsersData: (data) => dispatch(setAllUsers(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Users);