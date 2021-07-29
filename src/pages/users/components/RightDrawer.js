import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
// import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton';
// import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { updatePassword, updateUserDetails } from '../../../services/common.service';
import { Paper, TextField, Tooltip, Typography } from '@material-ui/core';
// import Snackbar from '@material-ui/core/Snackbar';
// import MuiAlert from '@material-ui/lab/Alert';
import Button from '../../../components/CommonComponents/Button/Button';
import { logger } from '../../../config/logger';
// import clsx from 'clsx';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
// import EditIcon from '@material-ui/icons/Edit';
// import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import MapRegion from './MapRegion';
// import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import UserCan from '../../../components/UserCan/UserCan';
import CloseIcon from '@material-ui/icons/Close';
import { rulesList } from '../../../config/userRules';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { deleteUser, getAllUserRoles } from '../../../services/users.service';
import TextInput from '../../../components/TextInput/TextInput';
import { useMount } from 'react-use';
import { useSnackbar } from 'notistack'



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
    padding: '24px 16px',
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
    padding: 2,
    borderColor: 'grey',
    margin: 2,

  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
    // marginRight: 12

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
    margin: '10px 0px 4px 0px',
    maxWidth: '100%',
  },
  passwordWrapper: {
    margin: '30px 0px 4px 0px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  details: {
    padding: 6,
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
      fontSize: '16px',
      lineHeight: '140%',
      color: '#909191',
      top: '-6px',
    },
    '& .MuiInputBase-formControl': {
      minWidth: '40%',
    },
    '& .MuiInputBase-input': {
      fontWeight: '500',
      fontSize: '16px',
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
  // const [showUserEditDrawer, setShowUserEditDrawer] = useState(false);
  const [roleList, setRoleList] = useState([])
  const [password, setPassword] = useState("")
  const [userFirstName, setUserFirstName] = useState(data.first_name)
  const [userLastName, setUserLastName] = useState(data.first_name)
  const [userMobile, setUserMobile] = useState(data.mobile)
  const [userRole, setUserRole] = useState(data.role_name)
  const [userMail, setUserMail] = useState(data.email)
  const [readOnly, setReadOnly] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const [apiStatus, setApiStatus] = useState({});
  const [userId, setuserId] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({});
  const [confirmPassword, SetConfirmPassword] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
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

  const handleClick = () => {
    setOpen(true);
  };
  const handleClickOpen = (value) => {
    setuserId(value);
    setOpen(true);
  };
  const ActivateUser = (status) => {
    updateUserDetails(userFirstName, userLastName, userMobile, userMail, userRole, data.id, status)
      .then(() => {
        setProfileSuccess(true);
        setTimeout(() => {
          window.location.reload(false);
          setProfileSuccess(false)
          setReadOnly(true)
        }, 2000)
      })
      .catch(err => {
        console.log(err)
      })

  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const saveProfile = () => {
    updateUserDetails(userFirstName, userLastName, userMobile, userMail, userRole, data.id)
      .then(res => {
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
          // setProfileSuccess(false)
          setReadOnly(true)
        }, 1500)

      })

      .catch(err => {
        console.log(err)
      })
  }

  const checkPassword = () => {
    if (password === confirmPassword && password !== null) {
      updatePassword(password, data.mobile, userId)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          }
          )
          setTimeout(() => {
            setPassword("")
            SetConfirmPassword("")
            setPasswordSuccess(false)
          }, 2000)
        })
        .catch(err => {
          console.log(err)
        })

    } else {
      console.log("ASDA")
      handleClick({ vertical: 'top', horizontal: 'center' })
    }
  }
  const deleteUserRecord = (userId) => {
    setOpen(false);
    setLoading(true);
    deleteUser(userId)
      .then(({ message }) => {
        setLoading(false);
        setApiStatus({ status: 'success', message });
        setTimeout(() => {
          setConfirmDelete(userId)
          window.location.reload()
        }, 700);
      })
      .catch(e => {
        setLoading(false);
        setApiStatus({ status: 'error', message: e });
        logger(e);
      })
  }
  // const toggleDrawer = () => (event) => {
  //   if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }
  //   setShowUserEditDrawer(st => !st);
  // };
  const fieldProps = {
    direction: "column",
    alignTop: true,
    readOnly,
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{editProfile ? 'Edit Profile Information' : editPassword ? 'Edit Password' : 'Profile Information'}</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            !editProfile && (
              <Box className={classes.button}>
                {/* <Button variant="contained" className={classes.btnStyle} color="primary" size="small" onClick={() => handleClickOpen(data.id)}>Delete</Button> */}
                <Button variant="contained" color="primary" size="small" onClick={() => { setReadOnly(false); setEditProfile(true) }}>Edit</Button>
              </Box>
            )

          }
          {/* {
            profileSuccess && (
              <Box pt={2} pl={3} color="success.main" bgcolor="#f9f9f9" borderRadius={4} className={classes.drawerStyle} display="flex" justifyContent="space-between" alignItems="center">
                Profile Updated Successfully...
              </Box>
            )
          }
          {
            passwordSuccess && (
              <Box pt={2} pl={3} color="success.main" bgcolor="#f9f9f9" borderRadius={4} className={classes.drawerStyle} display="flex" justifyContent="space-between" alignItems="center">
                Password Updated Successfully...
              </Box>
            )
          }
          {
            profileSuccess && (
              <Box pt={2} pl={3} color="success.main" bgcolor="#f9f9f9" borderRadius={4} className={classes.drawerStyle} display="flex" justifyContent="space-between" alignItems="center">
                Profile Updated Successfully...
              </Box>
            )
          }
          {
            passwordSuccess && (
              <Box pt={2} pl={3} color="success.main" bgcolor="#f9f9f9" borderRadius={4} className={classes.drawerStyle} display="flex" justifyContent="space-between" alignItems="center">
                Password Updated Successfully...
              </Box>
            )
          } */}
          <>
            {
              !editProfile ? (
                <>
                  <Grid container spacing={2} className={classes.readOnlyWrapper}>
                    <Grid item md={6}>
                      <Box className={classes.box} >
                        <Box className={classes.details}>
                          <div>
                            <p className={classes.title}>ID</p>
                            <strong className={classes.text}>{data.id}</strong>
                          </div>
                        </Box>
                        <Box className={classes.details}>
                          <div>
                            <p className={classes.title}>Role</p>
                            <strong className={classes.text}>{data.role_name}</strong>
                          </div>
                        </Box>
                        <Box className={classes.details}>
                          <div>
                            <p className={classes.title}>Email</p>
                            <strong className={classes.text}>{data.email}</strong>
                          </div>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item md={6}>
                      <Box className={classes.details}>
                        <div>
                          <p className={classes.title}>Name</p>
                          <strong className={classes.text}>{data.first_name}</strong>
                        </div>
                      </Box>
                      <Box className={classes.box} >
                        <Box className={classes.details}>
                          <div>
                            <p className={classes.title}>Mobile</p>
                            <strong className={classes.text}>{data.mobile}</strong>
                          </div>
                        </Box>
                      </Box>
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
                            label="First Name"
                            defaultValue={data.first_name}
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setUserFirstName(e.target.value)}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <TextInput
                            label="Last Name"
                            defaultValue={data.last_name}
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setUserLastName(e.target.value)}
                          />
                        </Grid>

                        <Grid item md={6}>
                          <TextInput
                            label="Mobile"
                            defaultValue={data.mobile}
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setUserMobile(e.target.value)}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <TextInput
                            select
                            label="Role"
                            value={userRole}
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setUserRole(e.target.value)}
                          >
                            {
                              roleList.map(roleList => <option key={roleList.role_name} value={roleList.id}>({roleList.role_name}) - {roleList.name}</option>)
                            }
                          </TextInput>
                        </Grid>
                        <Grid item md={6}>
                          <TextInput
                            label="Email"
                            defaultValue={data.email}
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setUserMail(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                  <Divider />
                  <UserCan
                    role={currentUser.role_name}
                    perform={rulesList.region_map}
                    yes={() => (
                      [1, 6, 7, 12].includes(data.role_id) ? <MapRegion data={data} /> : null
                    )}
                    no={() => null}
                  />
                  <div className={classes.passwordWrapper}>
                    <Button variant='outlined' onClick={() => setEditProfile(false)}>Cancel</Button>
                    <Button variant='contained' color="primary" onClick={() => saveProfile()}>Save</Button>
                  </div>

                </>
              )
            }
            {
              !editPassword ? (
                <>
                  <div className={classes.passwordWrapper}>
                    {
                      <Box className={classes.button}>
                        <Button variant="contained" color="primary" size="small" onClick={() => { setReadOnly(false); setEditPassword(true) }}>Change password</Button>
                      </Box>
                    }
                  </div>
                </>
              ) : (
                <>
                  <Box mb={2}>
                    {/* <Divider /> */}
                    {
                      editPassword && (
                        <Box mt={2} mb={2} bgcolor={"#fafafa"}>
                          <TextField
                            margin="dense"
                            id="password"
                            label="Enter New Password"
                            type="password"
                            value={password}
                            className={classes.textFieldStyle}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <TextField
                            margin="dense"
                            id="password"
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            className={classes.textFieldStyle}
                            onChange={e => SetConfirmPassword(e.target.value)}
                          />

                          <div className={classes.passwordWrapper}>
                            <Button variant='outlined' onClick={() => setEditPassword(false)}>Cancel</Button>
                            <Button variant='contained' color="primary" onClick={e => checkPassword()}>save</Button>
                          </div>
                        </Box>
                      )}
                  </Box>
                </>
              )
            }
          </>
          {/* } */}

          {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning">
              Password does not match
            </Alert>
          </Snackbar> */}

          {/* </Drawer> */}
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
              <Button onClick={() => deleteUserRecord(userId)} className={classes.button} >Yes</Button>
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
            data.status === 1 ? (
              <div>
                <Button
                  variant="contained"
                  className={classes.btnError}
                  color="primary"
                  onClick={() => handleClickOpen(data.id)}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="contained"
                  className={classes.btnError}
                  // color="primary"
                  onClick={() => ActivateUser(1)}
                >
                  Activate
                </Button>
              </div>
            )
          }

        </div>
      </div>
    </div >
  );

}
