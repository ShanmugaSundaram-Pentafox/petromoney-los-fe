import { FormControl, RadioGroup, FormControlLabel, Radio, FormGroup,IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { Fragment, useState } from 'react';
import * as Yup from 'yup';
import AddTankerDetails from './AddTankerDetails';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { addInfrastructureDetails } from '../../../services/PDReport.services';
import { compareObject } from '../../../utils/compareObject.util';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
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
    width: '60vw'
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
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
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
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  actionFoot: {
    marginBottom: 16,
    marginTop: 12,
  },
  btn: {
    margin: 8
  }
}))

const AddInfrastructureDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser, editable }) => {

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
  const [loading, setLoading] = useState(false)
  const [tankerAdd, setTankerAdd] = useState(false)


  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  };
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      no_of_employee: Yup.number().nullable('Enter count').required('Enter valid count'),
      no_of_hoarding: Yup.number().nullable('Enter count').required('Enter valid count'),
      no_of_tank: Yup.number().nullable('Enter count').required('Enter valid count'),
      tank_capacity: Yup.number().nullable('Enter tank capacity').required('Enter tank capacity'),
    }),
    onSubmit: values => {
      let obj = {};
      if (!isEdit) {
        obj = compareObject(data, values)
      }
      else {
        obj = { ...values }
      } 
      delete values.created_date
      delete values.modified_date
      let val = { ...obj, is_solar: values?.is_solar == 'Yes' ? 1 : 0 }
      addInfrastructureDetails(val, dealer_id)
        .then(res => {
          enqueueSnackbar(res, {
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
          enqueueSnackbar(e, {
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
        <div>Add Infrastructure Details</div>
        <IconButton onClick={handleClose}  size='small'>
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
                    <ViewData title="No of Employees" value={values.no_of_employee} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title="No of Storage Tank" value={values.no_of_tank} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title="No of Hoarding (Advertisement banners)" value={values.no_of_hoarding} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title="Tank Capacity (in liters)" value={values.tank_capacity} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title="Using Solar" value={values.is_solar} style={{marginBottom:6}} />
                  </Grid>
                </Grid> :
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="No of Employees"
                      name="no_of_employee"
                      type="number"
                      value={values.no_of_employee}
                      readOnly={readOnly}
                      error={errors.no_of_employee}
                      helperText={errors.no_of_employee}
                      className={classes.number}
                      inputProps={{ className: classes.input }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="No of Storage Tank"
                      name="no_of_tank"
                      type="number"
                      value={values.no_of_tank}
                      readOnly={readOnly}
                      error={errors.no_of_tank}
                      helperText={errors.no_of_tank}
                      className={classes.number}
                      inputProps={{ className: classes.input }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="No of Hoarding (Advertisement banners)"
                      name="no_of_hoarding"
                      type="number"
                      value={values.no_of_hoarding}
                      readOnly={readOnly}
                      error={errors.no_of_hoarding}
                      helperText={errors.no_of_hoarding}
                      className={classes.number}
                      inputProps={{ className: classes.input }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Tank Capacity (in liters)"
                      name="tank_capacity"
                      value={values.tank_capacity}
                      readOnly={readOnly}
                      error={errors.tank_capacity}
                      helperText={errors.tank_capacity}
                      className={classes.number}
                      inputProps={{ className: classes.input }}
                      type='number'
                    />
                  </Grid>
                  <Grid item md={2} style={{ marginTop: 22 }}>
                    <div>
                      <label>Using Solar</label>
                    </div>
                  </Grid>
                  <Grid item md={3} style={{ marginTop: 12 }} >
                    <FormControl>
                      <RadioGroup name="is_solar" value={values.is_solar} onChange={handleChange}>
                        <FormGroup row>
                          <FormControlLabel value="Yes" control={<Radio color="secondary" />} label="Yes" />
                          <FormControlLabel value="No" control={<Radio color="secondary" />} label="No" />
                        </FormGroup>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
            }
            {
              !editable &&
                <div className={classes.actionFoot}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button
                        variant="outlined"
                        className={classes.btn}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        type="submit"
                        className={clsx(classes.btn, classes.editButton)}
                        startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                        onClick={readOnly ? handleEdit : handleSubmit}
                      >
                        {loading ? <CircularProgress size={20} /> : readOnly ? 'Edit' :
                          'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
            }
            <Grid item md={12}>
              <Fragment className={classes.table}>
                <Typography className={classes.subTitle} variant="h4">Tanker Details</Typography>
                <AddTankerDetails dealer_id={dealer_id} length={values.no_of_tanker} tankerAdd={tankerAdd} setTankerAdd={setTankerAdd} editable={editable} />
              </Fragment>
            </Grid>
            {/* </form> */}
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
              // disabled={loading}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          {
            !editable &&
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon  />}
                onClick={() => setTankerAdd(true)}
                style={{ marginRight: 10 }}
              >
                Add Tanker
              </Button>
          }
        </div>
      </div>
    </div>


  )
}

export default AddInfrastructureDetailsForm;