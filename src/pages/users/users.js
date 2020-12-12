import React from 'react';
import { useMount } from 'react-use';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import usePageTitle from '../../hooks/usePageTitle';
import { getAllUsers, getUsersByRole } from '../../services/users.service';
import UsersTable from './components/UsersTable';
import DashCard from '../../components/CommonComponents/Cards/DashCard';
import Skeleton from '@material-ui/lab/Skeleton';
import { setAllUsers } from '../../store/dashboard/dashboard.actions';

const Users = ({ currentUser, allUsers, setAllUsersData }) => {
  usePageTitle('All Users');
  
  useMount(() => {
    // allow only if current user is admin
    if(currentUser.role_id === 1 && !allUsers.length) {
      getAllUsers()
        .then(data => {
          setAllUsersData(data);
        })
        .catch(e => {
          console.log(e);
        })
    }
  })

  const fo = getUsersByRole(allUsers, "FIELD_OFFICER");
  const trans = getUsersByRole(allUsers, "TRANSPORTER");
  const dealers = getUsersByRole(allUsers, "DEALER");
  const others = allUsers.filter(user => !(["FIELD_OFFICER", "TRANSPORTER", "DEALER", "SALES_HEAD_STATE", "SALES_HEAD_REGIONAL"].includes(user.role_name)));

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
            <Grid item xs={12}>
              <Box p={2} borderRadius={4} bgcolor="background.paper">
                {/* <Typography variant="h5">Credit Book</Typography> */}
                <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="wrap">
                  <DashCard text="Field Officers" value={fo.length} />
                  <DashCard text="Dealers" value={dealers.length} />
                  <DashCard text="Transporters" value={trans.length} />
                  <DashCard noBorder text="Other Users" value={others.length} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <UsersTable title="Field Officiers" data={fo} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UsersTable title="Dealers" data={dealers} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UsersTable title="Sales Head (State)" data={getUsersByRole(allUsers, "SALES_HEAD_STATE")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UsersTable title="Sales Head (Regional)" data={getUsersByRole(allUsers, "SALES_HEAD_REGIONAL")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UsersTable title="Transporters" data={trans} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <UsersTable
                withRole
                title="Other Users"
                data={others}
                />
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