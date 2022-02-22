import { CircularProgress, IconButton, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack'
import React, { useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import MapRegion from './MapRegion';
import PasswordForm from './PasswordForm';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan from '../../../components/UserCan/UserCan';
import { logger } from '../../../config/logger';
import { rulesList } from '../../../config/userRules';
import { updateUserDetails } from '../../../services/common.service';
import { deleteUser, getAllUserRoles } from '../../../services/users.service';



const useStyles = makeStyles(theme => ({

  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '40vw',
    overflowX: 'hidden'
  },
  sidePanelTitle: {
    padding: '14px 16px',
    marginBottom: 6,
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  list: {
    width: '50%',
  },

  box: {
    borderColor: 'grey',

  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  sidePanelFormContentWrapper: {
    flex: 1,
    overflowY: 'auto'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  readOnlyWrapper: {
    marginTop: 10,
    maxWidth: '100%',
  },
  passwordWrapper: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  passwordSection: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'flex-start'


  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  details: {
    borderColor: 'grey',
    minWidth: 80,
    height: 60,
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left',
    justifyContent: 'left'
  },
  text: {
    fontSize: 12
  },
  title: {
    fontSize: 11,
    marginBottom: 4,
  },
  textFieldStyle: {
    marginBottom: '12px',
    display: 'block',

    '& .MuiInputLabel-formControl': {
      fontSize: '12px',
      lineHeight: '140%',
      color: '#909191',
      top: '-6px',
    },
    '& .MuiInputBase-formControl': {
      minWidth: '40%',
    },
    '& .MuiInputBase-input': {
      fontWeight: '500',
      fontSize: '12px',
      lineHeight: '140%',
      width: '100%',
    }
  },

  btnError: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }
}));

export default function TemporaryDrawer({ data, currentUser, callback }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [userLoading, setuserLoading] = useState(false);
  const [passLoading, setpassLoading] = useState(false);
  const [roleList, setRoleList] = useState([])
  const [readOnly, setReadOnly] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const [submitType, setSubmitType] = useState();
  const [selected, setSelected] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useMount(() => {
    getAllUserRoles()
      .then(data => {
        setRoleList(data)
      })
      .catch(e => {
        console.log(e)
      })
  })

  const handleClickOpen = (value) => {
    setOpen(true);
  };
  const ActivateUser = (status) => {
    setuserLoading(true)
    updateUserDetails({ status }, data.id)
      .then((res) => {
        setuserLoading(false)
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
          setReadOnly(true)
        }, 2000)
      })
      .catch(err => {
        setuserLoading(false)
        console.log(err)
      })
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const deleteUserRecord = (userId) => {
    setOpen(false);
    setuserLoading(true);
    deleteUser(userId)
      .then(({ message }) => {
        setuserLoading(false);
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        }
        )
        setTimeout(() => {
          window.location.reload()
        }, 700);
      })
      .catch(e => {
        setuserLoading(false);
        logger(e);
      })
  }

  const activationAlert = () => {
    enqueueSnackbar('Please activate the user before editing', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      autoHideDuration: 2000,
      variant: 'warning',
    }
    )
  }



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
              setReadOnly(true)
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
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{editProfile ? 'Edit Profile Information' : editPassword ? 'Edit Password' : 'Profile Information'}</div>
        <IconButton size='small'>
          <CloseIcon onClick={callback} fontSize='small' />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            !editProfile && (
              <Box className={classes.button}>
                {
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setReadOnly(false);
                      setEditPassword(false);
                      data.status === 'Active' ? setEditProfile(true) : activationAlert()

                    }}>Edit</Button>
                }
              </Box>
            )

          }
          <>
            {
              !editProfile ? (
                <>
                  <Grid container className={classes.readOnlyWrapper}>
                    <Grid md={6}>
                      <div className={classes.box} >
                        <ViewData title='ID' value={data.id} />
                        <ViewData title='Role' value={data.role_name} />
                        <ViewData title='Email' value={data.email} />
                      </div>
                    </Grid>
                    <Grid md={6}>
                      <div className={classes.box} >
                        <ViewData title='Name' value={data.first_name.toUpperCase()} />
                        <ViewData title='Mobile' value={data.mobile} />
                      </div>

                    </Grid>
                  </Grid>
                </>
              ) : (
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
                            InputProps={{endAdornment: <ToggleButton value="check" size='small' selected={selected} onChange={() => setSelected(!selected)}><WhatsAppIcon fontSize='small' /></ToggleButton>}}
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
                  </Box>
                  {
                    !editProfile && <Divider />
                  }
                  <UserCan
                    role={currentUser.role_name}
                    perform={rulesList.region_map}
                    yes={() => (
                      [1, 6, 7, 10, 11, 12].includes(data.role_id) ? <MapRegion data={data} /> : null
                    )}
                    no={() => null}
                  />
                  <div className={classes.passwordWrapper}>
                    {
                      !loading ? (
                        <>
                          <Button variant='outlined' onClick={() => setEditProfile(false)} style={{ marginRight: 4 }}>Cancel</Button>
                          <Button variant='contained' color="primary" onClick={() => { handleSubmit(); setSubmitType('Profile') }}>Save</Button>
                        </>
                      ) : <CircularProgress />
                    }
                  </div>
                </>
              )
            }
            {
              !editPassword ? (
                <>
                  <Divider />
                  <div className={classes.passwordSection}>
                    {
                      <Box className={classes.button}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => {
                            setReadOnly(false);
                            data.status === 'Active' ? setEditPassword(true) : activationAlert()
                          }}>Change password</Button>
                      </Box>
                    }
                  </div>
                </>
              ) : (
                editPassword && <PasswordForm data={data} callback={() => { setEditPassword(false) }} loading={passLoading} setLoading={setpassLoading} />
              )
            }
          </>
          
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText className={classes.text}>Do you want to disable the user?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="contained" >No</Button>
              <Button onClick={() => deleteUserRecord(data.id)} className={classes.button} >Yes</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={callback}
            >
              Back
            </Button>
          </div>
          {
            !userLoading ? (
              data.status === 'Active' ? (
                <div>
                  <Button
                    variant="contained"
                    className={classes.btnError}
                    color="primary"
                    onClick={() => handleClickOpen(data.id)}
                  >
                    Deactivate user
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="contained"
                    className={classes.btnError}
                    onClick={() => ActivateUser(1)}
                  >
                    Activate
                  </Button>
                </div>
              )
            ) : <CircularProgress />
          }

        </div>
      </div>
    </div >
  );

}
