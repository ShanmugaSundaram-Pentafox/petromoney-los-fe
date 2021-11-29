import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import GridTextField from './GridTextField';

const useStyles = makeStyles(theme => ({
  root: {
    width: '60%',
    padding: theme.spacing(3)
  }
}));

const fields = [
  { key: 'foir', label: 'FOIR Considered' },
  { key: 'total_income', label: 'Total income considered' },
  { key: 'total_obligation', label: 'Total Obligation' }
];

const ScoreCardInfo = ({
  data,
  onChange
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          {
            fields.map(row => (
              <GridTextField
                key={row.key}
                field={row.key}
                label={row.label}
                value={data[row.key]}
                onChange={onChange}
              />
            ))
          }
        </Grid>
      </form>
    </Paper>
  )
}

export default ScoreCardInfo;