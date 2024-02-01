import { Avatar, Center, Container, Paper, SimpleGrid, Stack, Title, TextInput, Flex } from '@mantine/core';
import { Button, Dialog, DialogContent, DialogContentText, Typography, InputAdornment, IconButton, InputLabel, FormHelperText, Input } from '@material-ui/core'
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import * as Yup from 'yup';
import { action_id, resources_id } from '../../config/accessControl';
import { deleteUserAccount, verifyPasswordByLogin, } from '../../services/users.service';
import { resetCurrentUser } from '../../store/user/user.actions';
import { selectCurrentUser } from '../../store/user/user.selector';
import CheckAllowed from '../rbac/CheckAllowed';

const Profile = (props) => {
  const { currentUser, logout } = props;
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState();
  const [password, setPassword] = useState({});
  const [showPassword, setShowPassword] = useState();
  const { enqueueSnackbar } = useSnackbar();


  let disabledInput = true;

  const { errors, handleChange } = useFormik({
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
    onSubmit: formData => {}
  });
  const OnAccountDelete = () => {
    if (password?.value) {
      verifyPasswordByLogin({ mobile: currentUser.mobile, password: password?.value })
        .then(() => {
          deleteUserAccount()
            .then(res => {
              logout();
              enqueueSnackbar(res?.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'success',
              });
            })
            .catch(err => {
              enqueueSnackbar(err, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'error',
              });
            })
        })
        .catch(err => {
          setPassword({ ...password, error: err })
        })
    }
    else {
      setPassword({ ...password, error: 'please enter password to verify' })
    }
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  return (
    <>
      <Container size="sm" mt="xs">
        <Paper 
          p="xl" 
          style={{
            height: '88vh'
          }}
        >
          <Center mb="lg">
            <Stack gap="6">
              <Avatar src={null} color="cyan" size="lg" radius="xl">
                {currentUser?.first_name?.substring(0, 2)}
              </Avatar>

              <Title order={4}>
                {capitalizeFirstLetter(currentUser?.first_name)}
              </Title>
            </Stack>
          </Center>   

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <div>
              <TextInput
                label="First Name"
                name="first_name"
                error={errors.first_name}
                disabled={disabledInput}
                value={capitalizeFirstLetter(currentUser.first_name)}
                onChange={handleChange}
              />
            </div>

            <div>
              <TextInput
                label="Last Name"
                name="last_name"
                error={errors.last_name}
                disabled={disabledInput}
                value={capitalizeFirstLetter(currentUser.last_name)}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <TextInput
                label="Email"
                name="mail"
                error={errors.mail}
                disabled={disabledInput}
                value={currentUser.email}
                helperText={errors.mail}
                onChange={handleChange}
              />
            </div>

            <div>
              <TextInput
                label="Mobile Number"
                name="mobile"
                error={errors.mobile}
                disabled={disabledInput}
                value={currentUser.mobile}
                onChange={handleChange}
              />
            </div>

            <div>
              <TextInput
                label="City"
                name="city"
                error={errors.city}
                disabled={disabledInput}
                value={capitalizeFirstLetter(currentUser.region_name)}
                onChange={handleChange}
              />
            </div>

            <div>
              <TextInput
                label="Country"
                name="country"
                error={errors.country}
                disabled={disabledInput}
                value={capitalizeFirstLetter('INDIA')}
                onChange={handleChange}
              />
            </div>

            <div>
              <Flex
                gap="sm"
                justify="flex-start"
                align="flex-start"
                direction="row"
                wrap="wrap"
              >
                <CheckAllowed currentUser={currentUser} resource={resources_id?.users} action={action_id?.users?.user_delete}>
                  <Button 
                    variant="filled" 
                    color="red" 
                    size="xs"
                    onClick={() => { setOpenDialog(true) }}
                  >
                    Delete My Account
                  </Button>
                </CheckAllowed>
              </Flex>
            </div>
          </SimpleGrid>
        </Paper>
      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          {
            confirmDelete ? (
              <div style={{ marginBottom: 20 }}>
                <InputLabel>Confirm your password to delete your account</InputLabel>
                <Input
                  // autoFocus
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  onChange={(v) => setPassword({ ...password, value: v?.target?.value })}
                  size="large"
                  value={password?.value}
                  error={password?.error}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOutlinedIcon fontSize="small" /> : <VisibilityOffOutlinedIcon fontSize='sm' />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText error>{password?.error}</FormHelperText>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <InfoCircleOutlined style={{ fontSize: 48, color: 'rgb(255,59,48)', margin: 16, marginBottom: 20 }} />
                  <Typography variant='h3'>Are you sure?</Typography>
                </div>
                <DialogContentText >This action cannot be undone and will result in the permanent loss of your account information.</DialogContentText>
                <DialogContentText>If you proceed with deletion, you will no longer be able to access any of the services associated with this account.</DialogContentText>
              </>
            )
          }

        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 19 }}>
          <Button size='medium' variant='outlined' onClick={() => { setOpenDialog(false); setPassword({}); setShowPassword(false); setConfirmDelete(false) }}>Cancel</Button>
          <Button variant='contained' size='medium' style={{ backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 16 }} onClick={() => confirmDelete ? OnAccountDelete() : setConfirmDelete(true)}>
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