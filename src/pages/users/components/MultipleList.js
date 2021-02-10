import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useMount } from 'react-use';
import { regionDel, regionMapAdd, regionMapUser, regionUserMap } from '../../../services/users.service';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    minWidth: '40vw',
  },
  paper: {
    width: 'auto',
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function nots(a, b) {
    return a.filter((value) => b.includes(value['region']) );
}

function notsf(a, b) {
    return a.filter((value) => !b.includes(value['region']) );
}

export default function TransferList(props) {
  const classes = useStyles();

  const [mapped, setMapped] = React.useState( [ ]);
  
  const [checked, setChecked] = React.useState([]);

  const [left, setLeft] = React.useState( [] );
  
  const [right, setRight] = React.useState([ ]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  useMount(() => { 
    regionMapUser(props.userId)
        .then(data => {
            setMapped(data)
        })
        .catch(e => {
            console.log(e);
        })
})
  useEffect(() => { 
    var vv=[];
    for( var i in mapped){
        vv.push(mapped[i].region)
    }
    
    setLeft (notsf(props.region,vv) )
    setRight(nots(props.region,vv))
  },[mapped])

  const handleCheckedRight = () => { 
    checked.filter((value) =>{
        regionMapAdd(props.userId,value.region)
        console.log(value.region,props.userId) 
    })
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => { 
    checked.filter((value) => {
        console.log(value.region,props.userId)
        regionDel(props.userId,value.region)
    }) 
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
 

  const customList = (items) => (
    <Paper  className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value['name'] }`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Box my={2} p={2} borderRadius={4} bgcolor={"#fafafa"}>
      <Typography variant="h5" component="h5">Map User Regions</Typography>
      {/* <p>Select regions from left side panel and move right to map and vice versa.</p> */}
      <Grid container spacing={2} className={classes.root}>
        <Grid item>{customList(left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button> 
          </Grid>
        </Grid>
        <Grid item>{customList(right)}</Grid>
      </Grid>
    </Box>
  );
}
