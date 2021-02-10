import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { useMount } from 'react-use';
import { getRegionMap, passReset } from '../../../services/users.service';
import MultipleList from './MultipleList'
import { DialogContentText, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: '50%',
  },
  fullList: {
    width: '100%',
  },
  textFieldStyle: {
    marginBottom: '12px',
    display: 'block',
    
    '& .MuiInputLabel-formControl': {
      fontSize: '16px',
      lineHeight: '140%',
      color: '#909191',
      top: '-6px',
    },
    '& .MuiInputBase-formControl': {
      minWidth: '40%',
    },
    '& .MuiInputBase-input': {
      fontWeight: '500',
      fontSize: '16px',
      lineHeight: '140%',
      width: '100%',
    }
    
  },
});

export default function TemporaryDrawer({userId, data}) {
  const classes = useStyles();
  const [showUserEditDrawer, setShowUserEditDrawer] = useState(false);
  const [region , setRegion] = React.useState([])
  
  const [password , setPassword] = React.useState("")
 
    useMount(() => { 
        getRegionMap()
            .then(data => {
                setRegion(data)
            })
            .catch(e => {
                console.log(e);
            })
    })
    
  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setShowUserEditDrawer(st => !st);
  };

  return (
    <>
      <Button onClick={toggleDrawer()}>EDIT</Button>
      <Drawer anchor={"right"} open={showUserEditDrawer} onClose={toggleDrawer()}>
        <Box p={2} px={3} bgcolor={"#f1f1f1"} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" component="h2">User Info</Typography>
          <IconButton size="small" onClick={toggleDrawer()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box p={2} pl={3}>
          <Box mb={2}>
            <Box mb={1}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Name</label>
              <p style={{ fontSize: 16 }}>{data.name}</p>
            </Box>
            <Box mb={1}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Mobile</label>
              <p style={{ fontSize: 16 }}>{data.mobile}</p>
            </Box>
          </Box>
          <Divider />
          <MultipleList userId={userId} region={region}/>   
          
          <Box p={2} bgcolor={"#fafafa"} borderRadius={4}>
            <Typography variant="h5" component="h5">Update Passowrd</Typography>

            <TextField 
              margin="dense"
              id="password"
              label="New Password"
              type="password"
              value={password}
              className={classes.textFieldStyle}
              onChange={e=>setPassword(e.target.value)}
            />
            <TextField 
              margin="dense"
              id="password"
              label="Confirm New Password"
              type="password"
              value={password}
              className={classes.textFieldStyle}
              onChange={e=>setPassword(e.target.value)}
            />

            <Button variant={"contained"} color="primary" onClick={ e=> passReset(password,userId) }>
              Update Password
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
