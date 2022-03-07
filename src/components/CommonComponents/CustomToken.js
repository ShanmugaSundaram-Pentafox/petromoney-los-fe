import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React from 'react';
import { ReactComponent as CloseIcon } from '../../icons/crossIcon.svg';
import { ReactComponent as CircleIcon } from '../../icons/ellipseIcon.svg';
import { ReactComponent as DoneIcon } from '../../icons/tickIcon.svg';

const useStyles = makeStyles(() => ({
  pillContainer : {
    height:21, display: 'flex', alignItems: 'center',justifyContent: 'center', padding: 7, borderRadius: 30, marginLeft: 8, marginRight: 8, cursor: 'default', whiteSpace: 'nowrap'
  },
  pillSuccess: {
    backgroundColor: '#2cae66e6'
  },
  pillError: {
    backgroundColor: '#f05454e6'
  },
  pillWarn: {
    backgroundColor: '#C68F25e6'
  },
  pillText: {
    color: 'white', fontSize: '0.53rem', marginLeft: 4, marginTop: 1
  }
}))

export const CustomToken = ({variant='success', label, icon='default'}) => {
  const classes = useStyles()
  return(
    <div className={classNames(classes.pillContainer, variant === 'success' && classes.pillSuccess || variant === 'warn' && classes.pillWarn || variant === 'error' && classes.pillError)}>
      {
        icon === 'default' && <CircleIcon style={{width:8, height:8}} /> || icon === 'tick' && <DoneIcon /> || icon === 'cross' && <CloseIcon />
      }
      <p className={classes.pillText}><strong>{label?.toUpperCase()}</strong></p>
    </div>
  )
}

export default CustomToken;
