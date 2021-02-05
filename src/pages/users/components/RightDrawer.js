import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useMount } from 'react-use';
import { getRegionMap, passReset } from '../../../services/users.service';
import MultipleList from './MultipleList'
import { DialogContentText, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: '50%',
  },
  fullList: {
    width: '100%',
  },
});

export default function TemporaryDrawer({userId}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
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
    
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <>

          <DialogContentText>
            RegionMap
          </DialogContentText>
      <MultipleList userId={userId} region={region}/>   
      <Divider />
       
          <DialogContentText>
            Form to Update Password
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
          <Button color="primary"
          
            onClick={ e=> passReset(password,userId) }  
            >
            Update Password
          </Button>
      <Button 
        onClick={ 
            toggleDrawer(anchor, false)
        }
        onKeyDown={ 
            toggleDrawer(anchor, false)
        }
      >Close</Button>
    </>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>OPEN</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
