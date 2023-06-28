import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import toInteger  from 'lodash-es/toInteger';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { URL } from '../../../config/serverUrls';
import { getPdcBank } from '../../../services/pdc.service';

const useStyles = makeStyles((theme) => ({
  actionFoot: {
    // marginBottom: 16,
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
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
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

const AddChequeDetailsForm = ({ dealer_id, isEdit, callback, currentUser, editable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient()
  const classes = useStyles();
  const [isBlankCheque, setIsBlankCheque] = useState(false);
  const { data: bankData = [] } = useQuery('pdc-bank-data', () => getPdcBank(2), {
    refetchOnWindowFocus: false,
  })

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      applicant_type: Yup.string('Enter valid applicant type').nullable('Enter valid applicant type').required('Enter valid applicant type'),
      pdc_bank_details_id: Yup.number('select valid bank details').nullable('select valid bank details').required('select valid bank details'),
      cheque_type: Yup.string('Enter cheque type').nullable('Enter cheque type').required('Enter cheque type'),
      amount_filled: Yup.string().nullable('Enter filled amount in cheque').required('Enter filled amount in cheque'),
      cheque_number: Yup.number('Enter valid cheque number').nullable('Enter valid cheque number').required('Enter valid cheque number'),
    }),
    onSubmit: values => {
      let obj = { ...values, cheque_type: isBlankCheque ? 'blank' : 'filled', pdc_bank_details_id: toInteger(values.pdc_bank_details_id) };
      const formData = new FormData();
      Object.keys(obj).forEach(key => {
        formData.append(key, obj[key]);
      })
      fetch(`${URL.base}pdc-cheque-details/${dealer_id}`, {
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
      <Grid container style={{ margin: 0 }} spacing={2}>
        <Grid item md={6}>
          <TextInput
            {...inputProps}
            select
            number
            labelText="Select bank to add cheque"
            name="pdc_bank_details_id"
            value={values.pdc_bank_details_id}
            error={errors.pdc_bank_details_id}
            helperText={errors.pdc_bank_details_id}
          >
            {
              bankData?.map((item, index) => <option key={index} value={item?.id}>{item.account_name} ({item.account_number})</option>)
            }
          </TextInput>
        </Grid>
        <Grid item md={6}>
          <TextInput
            select
            {...inputProps}
            name='applicant_type'
            labelText="Applicant Type"
            onChange={handleChange}
            value={values.applicant_type}
            error={errors.applicant_type}
            helperText={errors?.applicant_type}
          >
            <option value=''>Choose applicant type</option>
            <option value='applicant'>Applicant</option>
            <option value='coapplicant'>Co-Applicant</option>
          </TextInput>
        </Grid>
        <Grid item md={6}>
          <TextInput
            {...inputProps}
            number
            labelText="Cheque Number"
            name="cheque_number"
            value={values.cheque_number}
            error={errors.cheque_number}
            helperText={errors.cheque_number}
          />
        </Grid>
        <Grid item md={4}>
          <TextInput
            {...inputProps}
            money
            number
            labelText="Cheque Amount"
            name="amount_filled"
            value={values.amount_filled}
            error={errors.amount_filled}
            helperText={errors.amount_filled}
          />
        </Grid>
        <Grid item style={{ marginTop: 16 }} md={2}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={isBlankCheque} color="primary" onChange={() => { setIsBlankCheque(!isBlankCheque); }} />}
              label='Blank'
            />
          </FormGroup>
        </Grid>
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={3}>
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

export default AddChequeDetailsForm;