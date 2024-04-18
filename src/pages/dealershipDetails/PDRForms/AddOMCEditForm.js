import { Divider, Grid, Typography, IconButton, CircularProgress, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import { format, parse } from 'date-fns';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { URL } from '../../../config/serverUrls';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '55vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    overflow: 'auto'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },

}))

const AddOMCEditForm = ({ data: init_data, dealer_id, isEdit, callback, currentUser, editable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
  const [loading, setLoading] = useState(false)
  const [executedDate, setExecutedDate] = useState(init_data?.agreement_executed_on ? parse(init_data?.agreement_executed_on, 'dd-MM-yyyy', new Date()) : new Date())
  const [validDate, setValidDate] = useState(init_data?.agreement_valid_till ? parse(init_data?.agreement_valid_till, 'dd-MM-yyyy', new Date()) : new Date())

  const handleExecutedDateChange = (date) => {
    setExecutedDate(date)
  }
  const handleValidDateChange = (date) => {
    setValidDate(date)
  }
  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  };


  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {
      ...init_data,
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      let obj = {};
      if (!isEdit) {
        obj = compareObject(init_data, values)
      }
      else {
        obj = values
      }
      const executed_date = executedDate ? format(new Date(executedDate), 'dd-MM-yyyy') : values.agreement_executed_on;
      const valid_date = validDate ? format(new Date(validDate), 'dd-MM-yyyy') : values.agreement_valid_till;
      const date = { ...obj, agreement_executed_on: executed_date, agreement_valid_till: valid_date };
      const data = new FormData();
      Object.keys(date).forEach((key) => {
        data.append(key, date[key]);
      });
      fetch(`${URL.base}dealership/${dealer_id}/omc`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then(res => {
          callback();
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setTimeout(() => {
            window.location.reload()
          }, 1500);
        })
        .catch(e => {
          enqueueSnackbar(e.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add OMC Details</div>
        <IconButton onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            {
              readOnly ?
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <ViewData title='Sales officer name' value={values.sales_officer_name} style={{ marginBottom: 6 }} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Sales officer mobile' value={values.sales_officer_mobile} style={{ marginBottom: 6 }} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Mode Call/Mail' value={values.communication_mode} style={{ marginBottom: 6 }} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Dealership agreement executed on' value={values.agreement_executed_on} style={{ marginBottom: 6 }} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Dealership agreement valid till' value={values.agreement_valid_till} style={{ marginBottom: 6 }} />
                  </Grid>
                </Grid> :
                <Grid style={{ marginTop: 20 }} container spacing={2}>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Sales officer name"
                      name="sales_officer_name"
                      value={values.sales_officer_name}
                      disabled={readOnly || editable}
                      readOnly={readOnly}
                      error={errors.sales_officer_name}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Sales officer mobile"
                      name="sales_officer_mobile"
                      value={values.sales_officer_mobile}
                      disabled={readOnly || editable}
                      readOnly={readOnly}
                      type='number'
                      error={errors.sales_officer_mobile}
                    />
                  </Grid>
                  <Grid item md={6} style={{ marginTop: 8 }}>
                    <TextInput
                      {...inputProps}
                      labelText="Mode Call/Mail"
                      name="communication_mode"
                      disabled={readOnly || editable}
                      readOnly={readOnly}
                      value={values.communication_mode}
                      error={errors.communication_mode}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <label>Dealership agreement executed on</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        variant='inline'
                        inputVariant='outlined'
                        format='dd-MM-yyyy'
                        animateYearScrolling={true}
                        invalidDateMessage='Invalid Date Format'
                        error={errors.agreement_executed_on}
                        helperText={errors.agreement_executed_on}
                        margin='normal'
                        id='date-picker'
                        autoOk={true}
                        value={executedDate}
                        readOnly={readOnly}
                        disabled={readOnly || editable}
                        onChange={handleExecutedDateChange}
                        keyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                        PopoverProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                          }
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6}>
                    <label>Dealership agreement valid till</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        hideTabs={true}
                        variant='inline'
                        inputVariant='outlined'
                        format='dd-MM-yyyy'
                        maxDate={new Date('2050-01-01')}
                        readOnly={readOnly}
                        disabled={readOnly || editable}
                        error={errors.agreement_valid_till}
                        helperText={errors.agreement_valid_till}
                        animateYearScrolling={true}
                        // invalidDateMessage='Invalid Date Format'
                        margin='normal'
                        id='date-picker'
                        autoOk={true}
                        value={validDate}
                        onChange={handleValidDateChange}
                        keyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                        PopoverProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center',
                          }
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
            }
          </Box >
        </div>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.outletEdit}>
            <Button
              variant="contained"
              type="submit"
              className={clsx(classes.btn, classes.editButton)}
              startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
              onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
            >
              {loading ? <CircularProgress size={20} /> : readOnly ? 'Edit' :
                'Save'}
            </Button>
          </CheckAllowed>
        </div>
      </div>
    </div>


  )
}
export default AddOMCEditForm;