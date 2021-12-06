import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '40px'
  },
  link: {
    display: 'flex',
    color: '#3E3E3E',
    fontSize: '14px',
    lineHeight: '140%'
  },
  icon: {
    marginRight: theme.spacing(1),
    width: 16,
    height: 16,
    color: '#4770C1'
  },
}));

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BreadCrumbs() {
  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb" className={classes.root}>
      <Link href="/" onClick={handleClick} className={classes.link}>
        <HomeIcon className={classes.icon} />
        Home
      </Link>

      <Link
        href="/lorem-ipsum"
        onClick={handleClick}
        className={classes.link}
      >
        HPCL
      </Link>

      <Link
        href="/lorem-ipsum"
        onClick={handleClick}
        className={classes.link}
      >
        List of data
      </Link>

      <Typography className={classes.link}>
        Sasikumar
      </Typography>
    </Breadcrumbs>
  );
}