import { makeStyles } from '@material-ui/styles';
import React from 'react';
import ShowChequeDetailsUnderbank from './ShowCheckDetailsUnderBank';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500,
    padding: 0,
    margin: 0
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: 16,
    fontSize: 14,
    textAlign: 'left',
    maxWidth: 600
  },
}));


const ShowChequeListTable = ({ dealershipId, data, currentUser }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ShowChequeDetailsUnderbank data={data} dealershipId={dealershipId} currentUser={currentUser} />
    </div>
  )
}

export default ShowChequeListTable;