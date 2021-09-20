import React, { useState, useEffect } from 'react';
import { useMount } from 'react-use';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Box, Button, Divider, Grid, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import { getAllWithheldRemarks } from '../../services/withheld.services';
import { useFormik } from 'formik';

const useStyles = makeStyles((theme) => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },

  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },

  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  dropdown: {
    boxShadow: '1px 1px 4px -3px #333',
  },
  option: {
    padding: 6,
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },

  declineButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: '#FF5C58',
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: '#DF2E2E',
    },
  },
}));

const CreditReloadRemarks = ({ callback }) => {
  const classes = useStyles();
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState();


  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
        comment: Yup.string().required('Enter a comment!'),
      }),
    onSubmit: (data) => {
        console.log(data, status);
    }
  });

  const declineSubmit = () => {
      setStatus('decline')
      handleSubmit()
  }
  const disperseSubmit = () => {
      setStatus('disperse')
      handleSubmit()
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Credit Reload Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <Grid container spacing={2}>
              <Grid item md={8} style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{ marginBottom: 8 }}>Comment</label>
                <TextField
                name='comment'
                value={values.comment}
                error={errors.comment}
                helperText={errors.comment}
                onChange={handleChange}
                multiline
                variant='outlined'
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button variant='outlined' onClick={callback}>
              Back
            </Button>
          </div>
          <div>
            <Button
              variant='contained'
              type='submit'
                onClick={declineSubmit}
              className={clsx(classes.btn, classes.declineButton)}
            >
              Decline
            </Button>
            <Button
              variant='contained'
              type='submit'
              color='primary'
                onClick={disperseSubmit}
              className={clsx(classes.btn, classes.editButton)}
            >
              Disperse
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditReloadRemarks;
