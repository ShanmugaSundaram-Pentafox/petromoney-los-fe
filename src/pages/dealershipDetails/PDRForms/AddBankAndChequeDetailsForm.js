import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
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

const AddBankAndChequeDetailsForm = ({ dealer_id, isEdit, callback, currentUser, editable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      ifsc_code: Yup.string().required('Enter IFSC code').nullable('Enter IFSC code').matches(/^[A-Za-z]{4}0[A-Z0-9]{6}$/, 'Enter valid IFSC'),
      account_name: Yup.string('Enter valid name').nullable('Enter Account Holder name').required('Enter Account holder name'),
      bank_name: Yup.string('Enter valid name').nullable('Enter bank name').required('Enter name'),
      account_number: Yup.string().nullable('Enter account number').required('Enter account number'),
      branch_name: Yup.string('Enter valid branch name').nullable('Enter branch name').required('Enter branch name'),
    }),
    onSubmit: finalValues => {
      let v = { ...finalValues };
      addPdcBank(v, dealer_id)
        .then((res) => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
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
              bank_city: data.CITY
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
      <Typography variant='h6' style={{marginBottom:12}}>Add Bank Details</Typography>
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