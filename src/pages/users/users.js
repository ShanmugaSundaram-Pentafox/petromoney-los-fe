import { InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Search } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
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

export const ChartWrapper = styled.div`
  background-color: #fff;
  border-radius: 6px;
  padding: 12px 0;
  height: 268px;
  margin-top: 8px;
  overflow: hidden;

  .MuiInputLabel-shrink {
    transform: translate(0, 5.5px) scale(0.75);
  }
`;

const currencies = [
  {
    value: 'Field Officiers', label: 'Field Officiers',
  },
  {
    value: 'Dealers', label: 'Dealers',
  },
  {
    value: 'Sales Head (Regional)', label: 'Sales Head (Regional)',
  },
  {
    value: 'Transporters', label: 'Transporters',
  },
  {
    value: 'Other Users', label: 'Other Users',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
      '& .MuiFormLabel-root': {
        transform: 'translate(14px, 10px) scale(1)',
      }
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const Users = ({ currentUser, allUsers, setAllUsersData }) => {
  usePageTitle('All Users');
  useMount(() => {
    // allow only if current user has permission to access users module
    if (isAllowed(currentUser?.permissions, resources_id?.navigation, 'users')) {
      getAllUsers()
        .then(data => {
          setAllUsersData(data);
        })
        .catch(e => {
          console.log(e);
        })
    }
  })
  const fo = getUsersByRole(allUsers, 'FIELD_OFFICER');
  const trans = getUsersByRole(allUsers, 'TRANSPORTER');
  const dealers = getUsersByRole(allUsers, 'DEALER');
  const others = allUsers.filter(user => !(['FIELD_OFFICER', 'TRANSPORTER', 'DEALER'].includes(user.role_name)));
  const classes = useStyles();
  const [currency, setCurrency] = React.useState();
  const [pincode, setPincode] = React.useState('');

  const getPincodeDetails = useQuery({
    queryKey: ['getPincodeDetails', pincode],
    queryFn: () => getUsersByPincode({ pincode }),
    enabled: Boolean(pincode?.length === 6),
  })

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  const getUserById = id => {
    return allUsers.find(item => item.id === id) || {};
  }
  let button;
  currencies.map((value) => {
    if (currency === 'Field Officiers') {
      button = <UsersTable currentUser={currentUser} title="Field Officiers" data={fo} />;
    } else if (currency === 'Dealers') {
      button = <UsersTable currentUser={currentUser} title="Dealers" data={dealers} />;
    } else if (currency === 'Sales Head (State)') {
      button = <UsersTable currentUser={currentUser} title="Sales Head (State)" data={getUsersByRole(allUsers, 'SALES_HEAD_STATE')} />;
    } else if (currency === 'Sales Head (Regional)') {
      button = <UsersTable currentUser={currentUser} title="Sales Head (Regional)" data={getUsersByRole(allUsers, 'SALES_HEAD_REGIONAL')} />;
    } else if (currency === 'Transporters') {
      button = <UsersTable currentUser={currentUser} title="Transporters" data={trans} />;
    } else if (currency === 'Other Users') {
      button = <UsersTable currentUser={currentUser} withRole title="Other Users" data={others} />;
    }
    else
      button = <UsersTable currentUser={currentUser} title="Users" data={allUsers} />
  })
  return (
    <div>
      {
        !allUsers.length ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton variant="rect" width="100%" height={160} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rect" width="100%" height={400} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rect" width="100%" height={400} />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ChartCard
                labels={[
                  { label: 'Field Officiers', value: fo.length },
                  { label: 'Dealers', value: dealers.length },
                  { label: 'Transporters', value: trans.length },
                  { label: 'Other Users', value: others.length },
                ]}
              >
                <VictoryPie
                  innerRadius={75}
                  colorScale={CHART_COLORS}
                  labels={[]}
                  data={[
                    { y: fo.length },
                    { y: dealers.length },
                    { y: trans.length },
                    { y: others.length },
                  ]}
                />
              </ChartCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ChartWrapper>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px 10px', alignItems: 'center' }}>
                  <div style={{ color: 'gray', fontSize: '14px' }}>Users By Pincode</div>
                  <TextField
                    label={'Pincode'}
                    InputProps={{
                      classes,
                      endAdornment: <InputAdornment position="end"><Search style={{ color: 'gray' }} /></InputAdornment>,
                    }}
                    value={pincode}
                    style={{ marginTop: -8 }}
                    onChange={e => setPincode(e.target.value)}
                  />
                </div>
                <div>
                  {(getPincodeDetails?.isFetching || getPincodeDetails?.data?.length)
                    ? (
                      <TableContainer style={{ maxHeight: 200 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell>User Id</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Mobile</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {getPincodeDetails?.isFetching ? (
                              [1, 2, 3, 4, 5]?.map((item) => (
                                <TableRow key={item}>
                                  <TableCell><Skeleton variant="text" /></TableCell>
                                  <TableCell><Skeleton variant="text" /></TableCell>
                                  <TableCell><Skeleton variant="text" /></TableCell>
                                </TableRow>
                              ))
                            ) : getPincodeDetails?.data?.map(user => (
                              <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.mobile}</TableCell>
                              </TableRow>
                            ))
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <div style={{ marginTop: '50px', color: '#ccc' }}>
                        {pincode?.length < 6 ? <center>Enter Pincode to get users</center> : <center>No User found for this pincode</center>}
                      </div>
                    )
                  }
                </div>
              </ChartWrapper>
            </Grid>
            <Grid item xs={12} sm={12}>
              {button}
            </Grid>
          </Grid>
        )
      }
    </div>
  )
}

const mapStateToProps = ({ dashboard }) => ({
  allUsers: dashboard.allUsers
})

const mapDispatchToProps = dispatch => ({
  setAllUsersData: (data) => dispatch(setAllUsers(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Users);