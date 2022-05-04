import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { URL } from '../../../config/serverUrls';
import { compareObject } from '../../../utils/compareObject.util';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  date: {
    backgroundColor: 'white',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw'
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
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  }

}))

const AddOmcDetailsForm = ({ data: init_data, dealer_id, isEdit, currentUser, callback, editable }) => {
  const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
  const [loading, setLoading] = useState(false)
  const [executedDate, setExecutedDate] = useState(init_data?.agreement_executed_on ? parse(init_data?.agreement_executed_on, 'dd-MM-yyyy', new Date()) : new Date())
  const [validDate, setValidDate] = useState(init_data?.agreement_valid_till ? parse(init_data?.agreement_valid_till, 'dd-MM-yyyy', new Date()) : new Date())

  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  };
  const handleExecutedDateChange = (date) => {
    setExecutedDate(date)
  }
  const handleValidDateChange = (date) => {
    setValidDate(date)
  }
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: { ...init_data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      sales_officer_name: Yup.string().nullable('Enter sales officer name').required('Enter sales officer name'),
      sales_officer_mobile: Yup.string()
        .nullable('Enter sales officer name')
        .matches(/^\d{10}$/, 'Invalid mobile number')
        .required('Enter valid mobile number'),
      communication_mode: Yup.string().nullable('Enter communication mode').required('Enter communication mode')
    }),
    onSubmit: values => {
      let obj = {};
      if (!isEdit) {
        obj = compareObject(init_data, values)
      }
      else {
        obj = { ...values }
      } 
      const executed_date = executedDate ? format(new Date(executedDate), 'dd-MM-yyyy') : values.agreement_executed_on;
      const valid_date = validDate ? format(new Date(validDate), 'dd-MM-yyyy') : values.agreement_valid_till;
      const date = { ...obj, agreement_executed_on: executed_date, agreement_valid_till: valid_date };
      const data = new FormData();
      Object.keys(date).forEach((key) => {
        data.append(key, date[key]);
      });
      fetch(`${URL.base}dealership/${dealer_id}`, {
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
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            {
              readOnly ? 
                <Grid container spacing={2} style={{marginTop: 8}}>
                  <Grid item md={6}>
                    <ViewData title='Sales officer name' value={values?.sales_officer_name} style={{marginBottom: 6}} />  
                  </Grid> 
                  <Grid item md={6}>
                    <ViewData title='Sales officer mobile' value={values?.sales_officer_mobile} style={{marginBottom: 6}} />  
                  </Grid> 
                  <Grid item md={6}>
                    <ViewData title='Mode Call/Mail' value={values?.communication_mode} style={{marginBottom: 6}} />  
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Dealership agreement executed on' value={values?.agreement_executed_on} style={{marginBottom: 6}} />  
                  </Grid> 
                  <Grid item md={6}>
                    <ViewData title='Dealership agreement valid till' value={values?.agreement_valid_till} style={{marginBottom: 6}} />  
                  </Grid> 
                </Grid> :
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Sales officer name"
                        name="sales_officer_name"
                        value={values.sales_officer_name}
                        disabled={readOnly || editable}
                        readOnly={readOnly}
                        error={errors.sales_officer_name}
                        helperText={errors.sales_officer_name}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        className={classes.number}
                        inputProps={{ className: classes.input }}
                        labelText="Sales officer mobile"
                        name="sales_officer_mobile"
                        value={values.sales_officer_mobile}
                        disabled={readOnly || editable}
                        readOnly={readOnly}
                        type='number'
                        error={errors.sales_officer_mobile}
                        helperText={errors.sales_officer_mobile}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Mode Call/Mail"
                        name="communication_mode"
                        disabled={readOnly || editable}
                        readOnly={readOnly}
                        value={values.communication_mode}
                        error={errors.communication_mode}
                        helperText={errors.communication_mode}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <label>Dealership agreement executed on</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className={classes.date}
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
                          className={classes.date}
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
                </form>
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
          {
            !editable &&
              <div>
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
              </div>
          }
        </div>
      </div>
    </div >
  )
}

export default AddOmcDetailsForm;