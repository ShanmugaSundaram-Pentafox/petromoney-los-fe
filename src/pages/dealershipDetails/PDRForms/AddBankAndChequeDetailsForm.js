import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { URL } from '../../../config/serverUrls';
import { addPdcBank } from '../../../services/pdc.service';

const useStyles = makeStyles((theme) => ({
  actionFoot: {
    marginBottom: 12,
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

const AddBankAndChequeDetailsForm = ({ collectionId, callback, data, title }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient()
  const classes = useStyles();
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues, setFieldValue } = useFormik({
    initialValues: {
      id:data?.bank_id,
      applicant_type:data?.applicant_type,
      ifsc_code: data?.ifsc_code,
      account_name: data?.account_name,
      account_number: data?.account_number,
      bank_name: data?.bank_name,
      branch_name: data?.branch_name,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      ifsc_code: Yup.string().required('Enter IFSC code').nullable('Enter IFSC code').matches(/^[A-Za-z]{4}0[A-Z0-9]{6}$/, 'Enter valid IFSC'),
      account_name: Yup.string('Enter valid name').nullable('Enter Account Holder name').required('Enter Account holder name'),
      bank_name: Yup.string('Enter valid name').nullable('Enter bank name').required('Enter name'),
      account_number: Yup.string().nullable('Enter account number').required('Enter account number'),
      branch_name: Yup.string('Enter valid branch name').nullable('Enter branch name').required('Enter branch name'),
    }),
    onSubmit: values => {
      let v = { ...values };
      addPdcBank(v, collectionId, values?.id)
        .then((res) => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          queryClient.invalidateQueries(['pdc-bank-data'])
          callback()
        })
        .catch((err) => {
          enqueueSnackbar(err, {
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

  const onChangeIFSC = e => {
    if (/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(e.target.value)) {
      fetch(`${URL.ifscApiUrl}${e.target.value}`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          if (data.BANK) {
            setValues({
              ...values,
              ifsc_code: data.IFSC,
              bank_name: data.BANK,
              branch_name: data.BRANCH,
              // bank_city: data.CITY
            })
          } else {
            console.log(data)
          }
        })
        .catch(err => {
          console.log('GET IFSC DATA ERR >> ', err)
        })
    }
  }
  return (
    <div>
      <Typography variant='h6' style={{ marginBottom: 12 }}>{title}</Typography>
      <Grid container spacing={2}>
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
            labelText="Account Holder name"
            name="account_name"
            value={values.account_name}
            error={errors.account_name}
            helperText={errors.account_name}
          />
        </Grid>
        <Grid item md={6}>
          <TextInput
            {...inputProps}
            labelText="Account Number"
            name="account_number"
            value={values.account_number}
            error={errors.account_number}
            helperText={errors.account_number}
          />
        </Grid>
        <Grid item md={6}>
          <TextInput
            {...inputProps}
            labelText="IFSC"
            name="ifsc_code"
            value={values.ifsc_code?.toUpperCase()}
            error={errors.ifsc_code}
            helperText={errors.ifsc_code}
            onChange={(e) => { onChangeIFSC(e); handleChange(e) }}
          />
          {
            values?.ifsc_code && (
              <>
                <div style={{ display: 'flex' }}>
                  <p style={{ fontSize: 10 }}><b>Bank name : &nbsp;</b></p>
                  <p style={{ fontSize: 12, color: '#888' }}>{values?.bank_name}</p>
                </div>
                {
                  values?.branch_name && (
                    <div style={{ display: 'flex' }}>
                      <p style={{ fontSize: 10 }}><b>Bank City: </b></p>
                      <p style={{ fontSize: 12, color: '#888' }}>{values?.branch_name}</p>
                    </div>
                  )
                }
              </>
            )
          }
        </Grid>
      </Grid>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          className={classes.btn}
          onClick={callback}
        >
          Cancel
        </Button>
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
    </div >
  )
}

export default AddBankAndChequeDetailsForm;