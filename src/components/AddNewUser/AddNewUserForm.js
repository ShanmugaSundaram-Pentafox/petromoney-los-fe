import { Flex, Button, Grid, TextInput, Text, Loader } from '@mantine/core';
import Alert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import { addNewUser, getAllUserRoles } from '../../services/users.service';
// import TextInput from '../TextInput/TextInput';

const AddNewUserForm = ({ callback, action }) => {
  const [apiStatus, setApiStatus] = useState({});
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('')
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
        });
    },
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  };
    

  return (
    <>
      {/* Drawer content */}
      <div style={{ flexGrow: 1, padding: 16, overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid gutter="sm">
            {/* <Grid.Col>
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
            </Grid.Col> */}
            
            <Grid.Col>
              <Flex bg="lightGray" p="xs" h="48" align="center">User Role Select Comes here</Flex>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                name='first_name'
                label='First Name'
                value={values.first_name}
                error={errors.first_name}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                name='last_name'
                label='Last Name'
                value={values.last_name}
                error={errors.last_name}
              />
            </Grid.Col>
            
            {(values.role_id == 13) && (
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  {...inputProps}
                  type='number'
                  name='dealership_id'
                  label='Dealership ID'
                  value={values.dealership_id}
                  error={errors.dealership_id}
                />
              </Grid.Col>
            )}

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                type='mobile'
                name='mobile'
                label='Mobile'
                value={values.mobile}
                error={errors.mobile}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                type='email'
                name='email'
                label='Email'
                value={values.email}
                error={errors.email}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                type='text'
                name='password'
                label='Password (Optional)'
                value={values.password}
                error={errors.password}
              />
              <Text 
                mt="4" 
                size="xs"
                style={{
                  color: '#868E96'
                }}
              >
                {errors.password || 'Default password is Petromall@2020'}
              </Text>
            </Grid.Col>
          </Grid>
        </form>

        {apiStatus.type && (
          <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
        )}
      </div>

      {/* Sticky footer */}
      <Flex
        h="64"
        style={{ 
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'end',
          padding: '0 16px', 
          background: '#FFFFFF', 
          borderTop: '1px solid #eaeaea', 
          zIndex: 9
        }}
      >
        <Flex gap="sm">
          <Button 
            variant="outline" 
            size="md"
            color="gray"
            onClick={action}
          >
            Go back
          </Button>

          <Button 
            variant="filled" 
            size="md"
            color="rgba(0, 0, 0, 1)"
            onClick={handleSubmit}
          >
            Create New User

            {loading && (
              <Loader ml="md" color="rgba(255, 255, 255, 1)" size="xs" />
            )}
          </Button>
        </Flex>  
      </Flex>
    </>
  );
};

export default AddNewUserForm;
