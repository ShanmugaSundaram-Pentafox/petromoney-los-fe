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
import ChartCard from '../../components/CommonComponents/ChartCard/ChartCard';
import { CHART_COLORS } from '../../config/constants';
import { VictoryPie } from 'victory';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Paper } from '@material-ui/core';

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
    },
  },
}));

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
  const classes = useStyles();
  const [currency, setCurrency] = React.useState('Field Officiers');

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const getUserById = id => {
    return allUsers.find(item => item.id === id) || {};
  }

  let button;
  if (currency==="Field Officiers") {
    button = <UsersTable title="Field Officiers" data={fo} />;
  } else if (currency==="Dealers") {
    button = <UsersTable title="Dealers" data={dealers} />;
  } else if (currency==="Sales Head (State)") {
    button = <UsersTable title="Sales Head (State)" data={getUsersByRole(allUsers, "SALES_HEAD_STATE")} />;
  } else if (currency==="Sales Head (Regional)") {
    button = <UsersTable title="Sales Head (Regional)" data={getUsersByRole(allUsers, "SALES_HEAD_REGIONAL")} />;
  } else if (currency==="Transporters") {
    button = <UsersTable title="Transporters" data={trans} />;
  } else if (currency==="Other Users") {
    button = <UsersTable withRole title="Other Users" data={others} />;
  }


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
            {/* <Grid item xs={6}>
              <Box p={2} borderRadius={4} bgcolor="background.paper">
                 <Typography variant="h5">Credit Book</Typography> 
                <Box borderRadius={4} bgcolor="background.paper" display="flex" flexDirection="row" flexWrap="wrap">
                  <DashCard text="Field Officers" value={fo.length} />
                  <DashCard text="Dealers" value={dealers.length} /> 
                  <DashCard text="Transporters" value={trans.length} />
                  <DashCard noBorder text="Other Users" value={others.length} />
                </Box>
              </Box>
            </Grid> */}
            
            {/* <Grid item xs={12} sm={12}>
              <Paper>
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Select"
                    value={currency}
                    onChange={handleChange}
                    helperText="Please select your currency"
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </form>
            
              </Paper>
            </Grid>       */}

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