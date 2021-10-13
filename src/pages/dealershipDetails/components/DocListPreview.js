import { Button, Paper, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 10,
        padding: 10,
        // border: '2px solid red',
        borderRadius: 5,
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
    },
    titleRow: {
        // border: '2px solid red',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleBtns: {

    }
}))

const DocListPreview = ({DocName}) => {
  const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.titleRow}>
                <Typography variant='h7'>{DocName}</Typography>
                <div className={classes.titleBtns}>
                    <Button size='small' variant='outlined'>Upload</Button>
                    <Button size='small' variant='outlined' style={{marginLeft: 10}}>Delete</Button>
                </div>
            </div>
        </div>
    )
}

export default DocListPreview
