import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-around',
  },
  content: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
  text: {
    border: '2px solid blue',
    width: '100%'
  }
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="h1">
          404: The page you are looking for isn’t here
        </Typography>
        <Typography variant="subtitle2" style={{marginTop: 7}}>
          You either tried some shady route or you came here by mistake.
          Whichever it is, try going back to dashboard!
        </Typography>
        <div style={{marginTop: '30px'}}>
        <Link to={'/'}>
          <Button variant='contained' color='secondary'>Go Back!</Button>
        </Link>
        </div>
      </div>
      <div className={classes.illustration}>
        <img
          alt="Under devel"
          className={classes.image}
          src="\images\error.png"
        />
      </div>
    </div>
  );
};

export default NotFound;
