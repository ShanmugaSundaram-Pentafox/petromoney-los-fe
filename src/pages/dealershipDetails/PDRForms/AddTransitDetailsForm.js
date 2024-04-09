import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import { URL } from '../../../config/serverUrls';

const useStyles = makeStyles((theme) => ({
  actionFoot: {
    marginTop: 12,
  },
  btn: {
    margin: 8
  },
  grid: {
    marginLeft: 4,
    marginRight: 4,
  },
  inputFile: {
    width: '120px',
    height: '75px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
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
  typography: {
    marginTop: 12,
    textAlign: 'center'
  },
}))

const AddTransitDetailsForm = ({ dealershipId, data, callback, currentUser }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const queryClient = useQueryClient()


  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: { pdc_cheque_ids: data?.join(',') },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      pdc_cheque_ids: Yup.string('Select cheque to upload details').nullable('Select cheque to upload details').required('Select cheque to upload details'),
      event_type: Yup.string('Select Event type').nullable('select event type').required('select event type'),
      // added the validation for file
      file: Yup.string().when('event_type', (event_type, schema) => {
        if (['return_to_dealer', 'deposited']?.includes(event_type)) {
          return schema.required('Please Upload the file');
        }
        return schema;
      })
    }),
    onSubmit: values => {
      let obj = { ...values };
      const formData = new FormData();
      Object.keys(obj).forEach(key => {
        formData.append(key, obj[key]);
      })
      fetch(`${URL.base}pdc-collection-events/${dealershipId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then(res => {
          if (res?.status == 'SUCCESS') {
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            });
            queryClient.invalidateQueries(['pdc-transit-details'])
            window.location.reload();
            callback();
          }
          else {
            enqueueSnackbar(res.message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            });
          }
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
  const onChangeHandler = (e) => {
    setFieldValue('file', e.target.files[0])
  }
  return (
    <div>
      <Typography variant='h6' style={{ marginBottom: 12 }}>Add Details</Typography>
      <Grid container style={{ margin: 0 }} spacing={2}>
        <Grid item md={12}>
          <div>
            <Typography variant='h6' style={{ marginBottom: 12 }}>Add File</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                defaultValue="yes"
                value={values?.event_type}
                onChange={(event) => setFieldValue('event_type', event?.target?.value)}
              >
                <FormControlLabel
                  value="collected"
                  control={<Radio size="small" />}
                  label="Collected"
                />
                <FormControlLabel
                  value="intransit"
                  control={<Radio size="small" />}
                  label="In Transit"
                />
                <FormControlLabel
                  value="received"
                  control={<Radio size="small" />}
                  label="Received"
                />
                <FormControlLabel
                  value="deposited"
                  control={<Radio size="small" />}
                  label="Deposited"
                />
                <FormControlLabel
                  value="return_to_dealer"
                  control={<Radio size="small" />}
                  label="Return to Dealer"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </Grid>
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <Typography variant='h6' style={{ marginBottom: 12 }}>Add File</Typography>
              <div className={classes.grid}>
                <input
                  type='file'
                  name='file'
                  id='file'
                  className={classes.inputFile}
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => { onChangeHandler(e) }}
                />
                <label htmlFor='file'>
                  <div style={{
                    border: '1px dashed grey', height: 75, borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: errors.file ? 'red' : 'grey'
                  }}>
                    {
                      values?.file ? (
                        <>
                          <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
                        </>
                      ) : (
                        <label htmlFor='file' style={{ fontSize: 32, color: 'grey' }}>+</label>
                      )
                    }
                  </div>
                  {errors.file ? <div style={{ fontSize: 10, color: 'red' }}>{errors.file}</div> : null}
                </label>
                {
                  values?.proof_1_file && (
                    <h5 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden' }}>{values.file}</h5>
                  )
                }
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
        <div>
          <Button
            variant="outlined"
            className={classes.btn}
            onClick={callback}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            type="submit"
            className={clsx(classes.btn, classes.editButton)}
            startIcon={<CheckOutlinedIcon />}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddTransitDetailsForm;