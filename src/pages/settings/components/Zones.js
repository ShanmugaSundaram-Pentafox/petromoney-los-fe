import { makeStyles, IconButton, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowDOwnIcon from '@material-ui/icons/KeyboardArrowDown';
import React, { useState } from 'react'
import { useMount } from 'react-use';
import { getStates } from '../../../services/common.service';

const useStyles = makeStyles(() => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '30vw'
  },
  sidePanelTitle: {
    padding: '15px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 9,
    margin: '0px 10px',
    borderBottom: '1px solid hsl(0,0%,75%)',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'hsl(0,0%,96%)',
      '& $btn': {
        visibility: 'visible',
      },
    },
  },
}))

const ZoneGroup = ({data}) => {
  const classes = useStyles()

  return(
    <div className={classes.label}>
      <Typography variant="body1" style={{ paddingLeft: 10 }}>{data.zone_name}</Typography>
      <KeyboardArrowDOwnIcon />
    </div>
  )
}

const Zones = ({ callback, title }) => {
  const classes = useStyles()
  const [zones, setZones] = useState([])
  const [states, setStates] = useState([])
  console.log(zones, states);

  useMount(() => {
    fetch('http://localhost:3334/data')
      .then(res => res.json())
      .then(setZones)
      .catch(e => console.log(e))
        
    getStates()
      .then(setStates)
      .catch(e => console.log(e))
  })

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{title}</div>
        <IconButton onClick={() => callback(false)} size='small'>
          <CloseIcon fontSize='size' />
        </IconButton>
      </Typography>
      <div className={classes.content}>
        {
          zones.map((item, i) => {
            return(
              <ZoneGroup data={item} key={i} />
            )
          })
        }
      </div>
    </div>
  )
}

export default Zones
