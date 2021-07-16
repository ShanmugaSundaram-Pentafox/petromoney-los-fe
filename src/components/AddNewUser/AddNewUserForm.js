import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '../TextInput/TextInput';
import Button from '../CommonComponents/Button/Button';
import { addNewUser, getAllUserRoles } from '../../services/users.service';
import { useMount } from 'react-use';
import Typography from "@material-ui/core/Typography"
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    color: '#9e9e9e'
  },
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
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
    overflow: 'auto'
  },
  tableRow: {
    cursor: 'pointer'
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
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  }
}))


const AddNewUserForm = ({ callback,action }) => {
  const [apiStatus, setApiStatus] = useState({});
  const [userRoles, setUserRoles] = useState([]);
  const classes = useStyles()


  useMount(() => {
    getAllUserRoles()
      .then(data => {
        setUserRoles(data);
      })
      .catch(e => {
        console.log(e)
      })
  })

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      role_id: Yup.number().required('Choose Proper User Role'),
      first_name: Yup.string().required('Enter first name'),
      last_name: Yup.string().min(1).required('Enter last name'),
      mobile: Yup.number().min(10,'Enter valid mobile number').required('Enter Mobile number'),
      email: Yup.string().email("Enter valid email"),
      password: Yup.string(),
    }),
    onSubmit: formData => {
      setApiStatus({ type: 'info', message: 'Creating a new user. Please wait...' })
      const userType = userRoles.find(role => role.id === Number(formData.role_id));
      addNewUser(formData, userType.role_name)
        .then(message => {
          setApiStatus({ type: 'success', message: 'Successfully created new user.' });
          callback && setTimeout(() => {
            callback();
          }, 1000)
        })
        .catch(e => {
          setApiStatus({ type: 'error', message: e })
          console.log(e);
        })
    }
  });
  const inputProps = {
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add New User Form</div>
        <CloseIcon onClick={action}  />
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
                      userRoles.map(userRole => <option key={userRole.role_name} value={userRole.id}>({userRole.role_name}) - {userRole.name}</option>)
                    }
                  </TextInput>
                </Grid>
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
                    helperText={errors.mobile}
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
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    type="password"
                    name="password"
                    labelText="Password (Optional)"
                    value={values.password}
                    error={errors.password}
                    helperText={errors.password || "Default password is Petromall@2020"}
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
            <Button
              variant="outlined"
              onClick={action}
            >
              Back
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              className={clsx(classes.btn, classes.editButton)}
            >
              Create New User
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AddNewUserForm;