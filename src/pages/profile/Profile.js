import { Button, Dialog, Paper, DialogContent, Grid, Avatar, DialogContentText, makeStyles, Typography } from '@material-ui/core'
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import * as Yup from 'yup';
import TextInput from '../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../config/accessControl';
import { resetCurrentUser } from '../../store/user/user.actions';
import { selectCurrentUser } from '../../store/user/user.selector';
import CheckAllowed from '../rbac/CheckAllowed';



const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  avatar: {
    width: 60,
    height: 60
  },
  paper: {
    maxWidth: '40vw',
    minHeight: '88vh',
    margin: 'auto',
    padding: 12,
    // textAlign: 'center'
  },
  profile: {
    marginBottom: 40,
    textAlign: 'center'

  },
  row: {
    paddingRight: 12,
    paddingBottom: 14
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-between'

  },
  button: {
    float: 'right',
    margin: 12,

  },

}));

const Profile = (props) => {
  const { currentUser, logout } = props;
  const [openDialog, setOpenDialog] = useState(false)
  const classes = useStyles();
  let readOnly = true;

  const gridItem = {
    item: true,
    className: classes.row
  };
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      role_id: Yup.number().nullable('Choose Proper User Role').required('Choose Proper User Role'),
      first_name: Yup.string().nullable('Enter first name').required('Enter first name'),
      last_name: Yup.string().nullable('Enter last name').min(1).required('Enter last name'),
      mobile: Yup.number().nullable('Enter Mobile number').min(10, 'Enter valid mobile number').required('Enter Mobile number'),
      email: Yup.string().nullable('Enter valid email').email('Enter valid email'),
      password: Yup.string(),
    }),
    onSubmit: formData => {

    }
  });
  const OnAccountDelete = () => {
    console.log('current user >>>>>>>>>>>>>>>>>>>>', currentUser)
    logout();
  }

  return (
    <>
      <Paper className={classes.paper} >
        <div className={classes.root}>
          <Avatar className={classes.avatar}>{currentUser?.first_name?.charAt(0)}</Avatar>
        </div>
        <Typography variant={'h4'} className={classes.profile}>{currentUser?.first_name?.toUpperCase()}</Typography>
        <Grid container className={classes.grid}>
          <Grid {...gridItem} md={6}>
            <TextInput
              label="First Name"
              name="first_name"
              error={errors.first_name}
              readOnly={readOnly}
              value={currentUser.first_name?.toUpperCase()}
              helperText={errors.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid {...gridItem} md={6}>
            <TextInput
              label="Last Name"
              name="last_name"
              error={errors.last_name}
              readOnly={readOnly}
              value={currentUser.last_name?.toUpperCase()}
              helperText={errors.last_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid {...gridItem} md={6}>
            <TextInput
              label="Email"
              name="mail"
              error={errors.mail}
              readOnly={readOnly}
              defaultValue={currentUser.email}
              helperText={errors.mail}
              onChange={handleChange}
            />
          </Grid>
          <Grid {...gridItem} md={6}>
            <TextInput
              label="Mobile Number"
              name="mobile"
              error={errors.mobile}
              readOnly={readOnly}
              defaultValue={currentUser.mobile}
              helperText={errors.mobile}
              onChange={handleChange}
            />
          </Grid>
          <Grid {...gridItem} md={6}>
            <TextInput
              label="City"
              name="city"
              error={errors.city}
              readOnly={readOnly}
              defaultValue={currentUser.region_name}
              helperText={errors.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid {...gridItem} md={6}>
            <TextInput
              label="Country"
              name="country"
              error={errors.country}
              readOnly={readOnly}
              defaultValue={'INDIA'}
              helperText={errors.country}
              onChange={handleChange}
            />
          </Grid>
          <CheckAllowed currentUser={currentUser} resource={resources_id?.users} action={action_id?.users.user_delete}>
            <Grid {...gridItem} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                size='medium'
                style={{ backgroundColor: 'rgb(255,59,48)', color: 'white', marginTop: 20 }}
                onClick={() => { setOpenDialog(true) }}>
                Delete My Account
              </Button>
            </Grid>
          </CheckAllowed>
        </Grid>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <InfoCircleOutlined style={{ fontSize: 48, color: 'rgb(255,59,48)', margin: 16, marginBottom: 20 }} />
            <Typography variant='h3'>Are you sure?</Typography>
          </div>
          <DialogContentText >This action cannot be undone and will result in the permanent loss of your account information.</DialogContentText>
          <DialogContentText>If you proceed with deletion, you will no longer be able to access any of the services associated with this account.</DialogContentText>
        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 19 }}>
          <Button size='medium' variant='outlined' onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant='contained' size='medium' style={{ backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 16 }} onClick={OnAccountDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(resetCurrentUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));