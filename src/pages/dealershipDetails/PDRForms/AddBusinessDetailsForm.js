import { FormControl, RadioGroup, FormControlLabel, Radio, FormGroup } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core'
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import Currency from '../../../components/Number/Currency';
import TextInput from '../../../components/TextInput/TextInput';
import { updateBusinessDetailsByID } from '../../../services/PDReport.services';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
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
  table: {
    padding: 8,
    marginTop: 8
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  subTitle: {
    marginTop: 8,
    marginBottom: 8

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

const AddBusinessDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser, editable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
  const [loading, setLoading] = useState(false)
  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {
      ...data
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      business_age: Yup.number().nullable('Enter valid experience').required('Enter valid experience'),
      hsd_count: Yup.number().nullable('Enter HSD count').required('Enter count'),
      ms_count: Yup.number().nullable('Enter MSD count').required('Enter count'),
      electricity_units_month: Yup.number().nullable('Enter Electricity details').required('Enter Electricity details'),
      credit_sales_month: Yup.number().nullable('Enter sales details').required('Enter sales details'),
    }),
    onSubmit: values => {
      let data = { ...values, has_atm: values.has_atm === 'Yes' ? 1 : 0, is_pep: values.is_pep === 'Yes' ? 1 : 0 }
      updateBusinessDetailsByID(data, dealer_id)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1500);
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
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
        <div>Add Business Details</div>
        <IconButton onClick={handleClose}  size='small'>
          <CloseIcon fontSize='size' />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            {
              readOnly ? 
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <ViewData title='No. of years in fuel business' value={values.business_age} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No. of HSD Dispensers' value={values.hsd_count} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='No. of MS Dispensers' value={values.ms_count} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Area of fuel station (in Sq. ft)' value={values.fuel_station_area} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Electricity units (per month)' value={values.electricity_units_month} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Electricity bill per month' value={<Currency value={values.electricity_bill_month}/>} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Insurance premium for pump' value={<Currency value={values.insurance_pump}/>} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Total Insurance premium' value={<Currency value={values.insurance_all} />} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Monthly average HSD sale(in KL)' value={values.monthly_avg_sale_hsd} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Monthly average MS sale(in KL)' value={values.monthly_avg_sale_ms} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Monthly average LPG sale(in KL)' value={values.monthly_avg_sale_lpg} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='LPG count' value={values.lpg_count} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Credit sales per day' value={<Currency value={values.credit_sales_day} />} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Credit sales per month' value={<Currency value={values.credit_sales_month} />} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Average realization period' value={values.avg_realization_period} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Outstanding any given time' value={<Currency value={values.credit_outstanding} />} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Is ATM available in outlet' value={values.has_atm} style={{marginBottom:6}}/>
                </Grid>
                <Grid item md={6}>
                  <ViewData title='Is the customer a PEP (Politically Exposed Person) or closely associated to PEP' value={values.is_pep} style={{marginBottom:6}}/>
                </Grid>
              </Grid> :
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="No. of years in fuel business"
                    name="business_age"
                    value={values.business_age}
                    readOnly={readOnly}
                    error={errors.business_age}
                    helperText={errors.business_age}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    number
                    {...inputProps}
                    labelText="No. of HSD Dispensers"
                    name="hsd_count"
                    value={values.hsd_count}
                    readOnly={readOnly}
                    error={errors.hsd_count}
                    helperText={errors.hsd_count}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    number
                    {...inputProps}
                    labelText="No. of MS Dispensers"
                    name="ms_count"
                    value={values.ms_count}
                    readOnly={readOnly}
                    error={errors.ms_count}
                    helperText={errors.ms_count}
                  />
                </Grid>

                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="Area of fuel station (in Sq. ft)"
                    name="fuel_station_area"
                    value={values.fuel_station_area}
                    readOnly={readOnly}
                    error={errors.fuel_station_area}
                    helperText={errors.fuel_station_area}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="Electricity units (per month)"
                    name="electricity_units_month"
                    value={values.electricity_units_month}
                    readOnly={readOnly}
                    error={errors.electricity_units_month}
                    helperText={errors.electricity_units_month}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="Electricity bill per month"
                    name="electricity_bill_month"
                    value={values.electricity_bill_month}
                    readOnly={readOnly}
                    error={errors.electricity_bill_month}
                    helperText={errors.electricity_bill_month}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="Insurance premium for pump"
                    name="insurance_pump"
                    value={values.insurance_pump}
                    readOnly={readOnly}
                    error={errors.insurance_pump}
                    helperText={errors.insurance_pump}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="Total Insurance premium"
                    name="insurance_all"
                    value={values.insurance_all}
                    readOnly={readOnly}
                    error={errors.insurance_all}
                    helperText={errors.insurance_all}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    labelText="Monthly average HSD sale(in KL)"
                    name="monthly_avg_sale_hsd"
                    value={values.monthly_avg_sale_hsd}
                    readOnly={readOnly}
                    error={errors.monthly_avg_sale_hsd}
                    helperText={errors.monthly_avg_sale_hsd}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="Monthly average MS sale(in KL)"
                    name="monthly_avg_sale_ms"
                    value={values.monthly_avg_sale_ms}
                    readOnly={readOnly}
                    error={errors.monthly_avg_sale_ms}
                    helperText={errors.monthly_avg_sale_ms}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="Monthly average LPG sale(in KL)"
                    name="monthly_avg_sale_lpg"
                    value={values.monthly_avg_sale_lpg}
                    readOnly={readOnly}
                    error={errors.monthly_avg_sale_lpg}
                    helperText={errors.monthly_avg_sale_lpg}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="LPG count"
                    name="lpg_count"
                    value={values.lpg_count}
                    readOnly={readOnly}
                    error={errors.lpg_count}
                    helperText={errors.lpg_count}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="Credit sales per day"
                    name="credit_sales_day"
                    value={values.credit_sales_day}
                    readOnly={readOnly}
                    error={errors.credit_sales_day}
                    helperText={errors.credit_sales_day}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="Credit sales per month"
                    name="credit_sales_month"
                    value={values.credit_sales_month}
                    readOnly={readOnly}
                    error={errors.credit_sales_month}
                    helperText={errors.credit_sales_month}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    className={classes.number}
                    labelText="Average realization period"
                    name="avg_realization_period"
                    value={values.avg_realization_period}
                    readOnly={readOnly}
                    error={errors.avg_realization_period}
                    helperText={errors.avg_realization_period}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    money
                    labelText="Outstanding any given time"
                    name="credit_outstanding"
                    value={values.credit_outstanding}
                    readOnly={readOnly}
                    error={errors.credit_outstanding}
                    helperText={errors.credit_outstanding}
                  />
                </Grid>
                <Grid item md={7}>
                  <div style={{ paddingTop: 12 }}>
                    <label>Is ATM available in outlet</label>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <FormControl>
                    <RadioGroup name="has_atm" value={values.has_atm} onChange={handleChange}>
                      <FormGroup row>
                        <FormControlLabel value="Yes" control={<Radio color="secondary" />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio color="secondary" />} label="No" />
                      </FormGroup>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item md={7}>
                  <div style={{ paddingTop: 12 }}>
                    <label>Is the customer a PEP (Politically Exposed Person) or closely associated to PEP</label>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <FormControl>
                    <RadioGroup name="is_pep" value={values.is_pep} onChange={handleChange}>
                      <FormGroup row>
                        <FormControlLabel value="Yes" control={<Radio color="secondary" />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio color="secondary" />} label="No" />
                      </FormGroup>
                    </RadioGroup>
                  </FormControl>
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

export default AddBusinessDetailsForm;