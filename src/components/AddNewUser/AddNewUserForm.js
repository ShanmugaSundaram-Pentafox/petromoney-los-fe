import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import { addNewUser, getAllUserRoles } from '../../services/users.service';
import Button from '../CommonComponents/Button/Button';
import TextInput from '../TextInput/TextInput';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
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
}));

const AddNewUserForm = ({ callback, action }) => {
  const [apiStatus, setApiStatus] = useState({});
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('')
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let isDealership = {};
  useMount(() => {
    getAllUserRoles()
      .then((data) => {
        setUserRoles(data);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  if(type.role_id == 13){
    isDealership= {
      dealership_id: Yup.string().nullable('Enter dealership id').required('Enter valid dealership id')
    };
  }
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      role_id: Yup.number().nullable('Choose Proper User Role').required('Choose Proper User Role'),
      first_name: Yup.string().nullable('Enter first name').matches(/^[A-Za-z_ ]+$/, 'Enter valid name').required('Enter first name'),
      last_name: Yup.string().nullable('Enter last name').min(1).matches(/^[A-Za-z_ ]+$/, 'Enter valid name').required('Enter last name'),
      mobile: Yup.string().nullable('Enter mobile number').matches(/^\d{10}$/, 'Enter valid mobile number').required('Enter mobile number'),
      email: Yup.string().nullable('Enter email').email('Enter valid email').required('Enter email'),
      password: Yup.string(),
      ...isDealership,
    }
    ),
    onSubmit: (formData) => {
      setLoading(true);
      const userType = userRoles.find(
        (role) => role.id === Number(formData.role_id)
      );
        
      Object.keys(formData).forEach(k => (formData[k] === '') && delete formData[k]);
      addNewUser(formData, userType.role_name)
        .then((message) => {
          setLoading(false);
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          callback &&
          setTimeout(() => {
            callback();
          }, 1000);
        })
        .catch((e) => {
          setLoading(false);
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          console.log(e);
        });
    },
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  };
    

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Add New User Form</div>
        <CloseIcon onClick={action} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <TextInput
                    {...inputProps}
                    select
                    labelText='User Role'
                    name='role_id'
                    value={values.role_id}
                    
                    error={errors.role_id}
                    helperText={errors.role_id}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value=''  >Choose user role</option>
                    {(values.role_id) && type != values && setType(values)}
                    {userRoles.map((userRole) => (
                      <option key={userRole.role_name} value={userRole.id}  >
                        ({userRole.role_name}) - {userRole.name} 
                      </option>
                    ))}
                  </TextInput>
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    name='first_name'
                    labelText='First Name'
                    value={values.first_name?.toUpperCase()}
                    error={errors.first_name}
                    helperText={errors.first_name}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    name='last_name'
                    labelText='Last Name'
                    value={values.last_name?.toUpperCase()}
                    error={errors.last_name}
                    helperText={errors.last_name}
                  />
                </Grid>
                {
                  (values.role_id == 13) &&
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        type='number'
                        name='dealership_id'
                        labelText='Dealership ID'
                        value={values.dealership_id}
                        error={errors.dealership_id}
                        helperText={errors.dealership_id}
                      />
                    </Grid>
                }
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    type='mobile'
                    name='mobile'
                    labelText='Mobile'
                    value={values.mobile}
                    error={errors.mobile}
                    helperText={errors.mobile}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    type='email'
                    name='email'
                    labelText='Email'
                    value={values.email}
                    error={errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    type='password'
                    name='password'
                    labelText='Password (Optional)'
                    value={values.password}
                    error={errors.password}
                    helperText={
                      errors.password || 'Default password is Petromall@2020'
                    }
                  />
                </Grid>
                {/* <Grid item xs={12} justify="flex-end" alignItems="flex-end">
            <Button
              size="large"
              type="submit"
              color="primary"
              variant="contained"
            >
              Create New User
            </Button>
          </Grid> */}
              </Grid>
            </form>
            {apiStatus.type && (
              <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
            )}
          </Box>
        </div>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button variant='outlined' onClick={action}>
              Back
            </Button>
          </div>
          <div>
            {!loading ? (
              <Button
                variant='contained'
                type='submit'
                onClick={handleSubmit}
                className={clsx(classes.btn, classes.editButton)}
              >
                Create New User
              </Button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '90%',
                  margin: '0 auto',
                }}
              >
                <CircularProgress size={30} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewUserForm;
