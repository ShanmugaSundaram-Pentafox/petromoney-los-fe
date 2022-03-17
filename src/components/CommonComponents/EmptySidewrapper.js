import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

const useStyles = makeStyles(() => ({
    sidePanelFormWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '35vw'
      },
      sidePanelTitle: {
        padding: '10px 16px',
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
      stepperRoot: {
        padding: 16,
        paddingTop: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      sidePanelWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
}))

const EmptySidewrapper = ({title, callback}) => {
    const classes = useStyles()
  return (
    <div className={classes.sidePanelFormWrapper}>
        <Typography className={classes.sidePanelTitle} variant="h4">
            <div>{title}</div>
            <IconButton onClick={callback} size='small'>
                <CloseIcon fontSize='size' />
            </IconButton>
        </Typography>
        <div className={classes.sidePanelWrapper}>
            <CancelOutlinedIcon style={{ color: 'rgb(0,0,0,0.1)', fontSize: 100 }} />
            <div style={{textAlign: 'center', marginTop: 8, width: '50%'}}>
                <Typography variant='h3'>No Data</Typography>
                <Typography variant='body1' style={{color: 'rgb(0,0,0,0.3)'}}>No data found for this dealership, Please try again later</Typography>
            </div>
        </div>
    </div>
  )
}

export default EmptySidewrapper