import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  labelStyle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "block"
  }
}))

const GridTextField = ({
  onChange,
  field,
  value,
  label,
}) => {
  const classes = useStyles();
  return (
    <>
      <Grid item md={6} xs={12}>
        <label className={classes.labelStyle}>{label}</label>
      </Grid>
      <Grid item md={6} xs={12}>
        <TextField
          // label={label}
          size="small"
          variant="outlined"
          defaultValue={ value || ''}
          onChange={e => onChange(field, e.target.value)}
        />
      </Grid>
    </>
  )
}

export default GridTextField;