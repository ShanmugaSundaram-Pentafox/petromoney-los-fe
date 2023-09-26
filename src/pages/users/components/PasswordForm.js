import { CircularProgress, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import { updatePassword } from '../../../services/common.service';


const useStyles = makeStyles(theme => ({

  passwordWrapper: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'flex-start'
  },
  textFieldStyle: {
    marginBottom: '12px',
    display: 'block',

    '& .MuiInputLabel-formControl': {
      fontSize: '13px',
      lineHeight: '140%',
      color: '#909191',
      top: '-6px',
    },
    '& .MuiInputBase-formControl': {
      minWidth: '40%',
    },
    '& .MuiInputBase-input': {
      fontWeight: '500',
      fontSize: '13px',
      lineHeight: '140%',
      width: '100%',
    }
  },
}));

const PasswordForm = ({ data, callback, loading, setLoading }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { values, errors, handleChange, handleSubmit, setValues, isSubmitting, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      password: Yup.string().nullable('Enter password').required('Enter the Password').min(8, 'Password should have minimum of 8 characters'),
      confirm_password: Yup.string().nullable('Enter password').required('Enter the Password'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const d = { ...values };
      d.password = (d.password + '').trim();
      d.confirm_password = (d.confirm_password + '').trim();

      if (d.password && d.confirm_password && d.password === d.confirm_password) {
        setLoading(true)
        updatePassword(d, data.id)
          .then(res => {
            setLoading(false)
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
            setTimeout(() => {
              window.location.reload(false);
            }, 2000)
          })
          .catch(err => {
            setLoading(false);
            console.log(err)
            setSubmitting(false)
          })

      } else {
        if (!(d.password === d.confirm_password) && d.password && d.confirm_password) {
          enqueueSnackbar('Password does not match', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'warning',
          }
          )
          setSubmitting(false)
        }
        else {
          enqueueSnackbar('Please enter valid password', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'warning',
          }
          )
          setSubmitting(false)
        }
      }
    }
  });

  return (
    <Box mb={2} p={2} bgcolor={'#fafafa'}>
      <TextField
        margin="dense"
        name="password"
        label="Enter New Password"
        type="password"
        disabled={isSubmitting}
        value={values.password}
        className={classes.textFieldStyle}
        error={errors.password}
        helperText={errors.password}
        onChange={handleChange}
      />
      <TextField
        margin="dense"
        label="Confirm New Password"
        type="password"
        name="confirm_password"
        disabled={isSubmitting}
        value={values.confirm_password}
        className={classes.textFieldStyle}
        error={errors.confirm_password}
        helperText={errors.confirm_password}
        onChange={handleChange}
      />
      <div className={classes.passwordWrapper}>
        {
          !loading ? (
            <>
              <Button variant='outlined' onClick={callback} style={{ marginRight: 4 }}>Cancel</Button>
              <Button variant='contained' color="primary" onClick={() => { handleSubmit() }}>Save</Button>
            </>
          ) : <CircularProgress />
        }
      </div>
    </Box>
  )

}
export default PasswordForm;