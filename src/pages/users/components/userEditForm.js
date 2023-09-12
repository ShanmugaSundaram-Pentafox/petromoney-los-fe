import { CircularProgress, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import ToggleButton from '@material-ui/lab/ToggleButton';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack'
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { updateUserDetails } from '../../../services/common.service';

const useStyles = makeStyles(theme => ({
  passwordWrapper: {
    marginTop: 20,
    marginBottom: 10,
    display: 'flex',
    // justifyContent: 'flex-end'
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
  activeBtn: {
    color: '#128C7E'
  }
}));


const UserEditForm = ({ data, roleList, callback }) => {

  const classes = useStyles();
  const [submitType, setSubmitType] = useState();
  const [selected, setSelected] = useState(data?.is_whatsapp);
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, handleChange, handleSubmit, setValues, isSubmitting, setSubmitting, setFieldValue } = useFormik({
    initialValues: {
      ...data,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      role_id: Yup.number().required('Choose Proper User Role').nullable('Choose user role'),
      first_name: Yup.string().required('Enter first name').nullable('Enter first name'),
      last_name: Yup.string().required('Enter last name').nullable('Enter last name'),
      mobile: Yup.string().matches(/^\d{10}$/, 'Enter valid mobile number').required('Enter mobile number').nullable('Enter mobile number'),
      email: Yup.string().email('Enter valid email').nullable('Enter mail ID').required('Enter mail ID'),
    }),
    onSubmit: values => {
      const { status, ...d } = values;
      d.first_name = d.first_name.toUpperCase()
      d.last_name = d.last_name.toUpperCase()
      d.is_whatsapp = selected ? 1 : 0

      if (submitType === 'Profile') {
        setLoading(true);
        updateUserDetails(d, data.id)
          .then(res => {
            setLoading(false);
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
              // setReadOnly(true)
            }, 1500)

          })
          .catch(err => {
            setLoading(false);
            enqueueSnackbar(err, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            })
          })
      }
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }
  return (
    <div>
      <>
        <Box mb={2}>
          <form>
            <Grid container spacing={3}>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  name="first_name"
                  labelText="First Name"
                  value={values.first_name?.toUpperCase()}
                  error={errors.first_name}
                  helperText={errors.first_name}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  name="last_name"
                  labelText="Last Name"
                  value={values.last_name?.toUpperCase()}
                  error={errors.last_name}
                  helperText={errors.last_name}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  type="mobile"
                  name="mobile"
                  labelText="Mobile"
                  value={values.mobile}
                  error={errors.mobile}
                  helperText={errors.mobile ? errors.mobile : '*please enable to recieve whatsapp notifications.'}
                  InputProps={{ endAdornment: <Tooltip title={selected ? 'Notification Enabled' : 'Notification Disabled'}><ToggleButton value="check" size='small' selected={selected} onChange={() => setSelected(!selected)}><WhatsAppIcon fontSize='small' className={selected && classes.activeBtn} /></ToggleButton></Tooltip> }}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  type="email"
                  name="email"
                  labelText="Email"
                  value={values.email}
                  error={errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item md={12}>
                <TextInput
                  {...inputProps}
                  select
                  labelText="User Role"
                  name="role_id"
                  value={values.role_id}
                  error={errors.role_id}
                  helperText={errors.role_id}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Choose user role</option>
                  {
                    roleList.map(userRole => <option key={userRole.role_name} value={userRole.id}>({userRole.role_name}) - {userRole.name}</option>)
                  }
                </TextInput>
              </Grid>
            </Grid>
          </form>
          <Divider />
          <div className={classes.passwordWrapper}>
            {
              !loading ? (
                <>
                  <Button variant='outlined' onClick={() => { setEditProfile(false); callback(); }} style={{ marginRight: 4 }}>Cancel</Button>
                  <Button variant='contained' startIcon={<NavigateNextRoundedIcon />} className={clsx(classes.btn, classes.editButton)} onClick={() => { handleSubmit(); setSubmitType('Profile') }}>Save</Button>
                </>
              ) : <CircularProgress />
            }
          </div>
        </Box>
      </>
    </div>
  )
}

export default UserEditForm;