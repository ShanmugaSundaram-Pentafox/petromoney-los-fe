import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, Grid, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import UserEditForm from './userEditForm';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { action_id, resources_id } from '../../../config/accessControl';
import { logger } from '../../../config/logger';
import { updateUserDetails } from '../../../services/common.service';
import { deleteUser, getAllUserRoles } from '../../../services/users.service';
import CheckAllowed from '../../rbac/CheckAllowed';


const useStyles = makeStyles(theme => ({
  box: {
    borderColor: 'grey',

  },
  button: {
    marginTop: 20,
  },

  sidePanelFormContentWrapper: {
    flex: 1,
    overflowY: 'auto'
  },
  actionButtonsWrapper: {
    display: 'flex',
  },
  readOnlyWrapper: {
    marginTop: 10,
    maxWidth: '100%',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  text: {
    fontSize: 12
  },
  title: {
    fontSize: 11,
    marginBottom: 4,
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
  btnError: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
}));

const UserProfile = ({ currentUser, data, }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [userLoading, setuserLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const getUserRolesQuery = useQuery({
    queryKey: ['all-user-roles'],
    queryFn: () => getAllUserRoles(),
    enabled: Boolean(editProfile),
  });

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
  const handleClickOpen = (value) => {
    setOpen(true);
  };
  return (
    <div className={classes.sidePanelFormContentWrapper}>
      <div className={classes.stepperRoot}>
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
              <UserEditForm
                data={data}
                currentUser={currentUser}
                roleList={getUserRolesQuery?.data || []}
                editProfile={editProfile}
                callback={() => {
                  setReadOnly(false);
                  setEditPassword(false);
                  setEditProfile(false);
                }} />
            )
          }
        </>
        {
          !editProfile &&
            <Box className={classes.button}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.users} action={action_id.users.userEdit}>
                <div className={classes.actionButtonsWrapper}>
                  <Button
                    variant="contained"
                    size="small"
                    className={clsx(classes.btn, classes.editButton)}
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setReadOnly(false);
                      setEditPassword(false);
                      data.status === 'Active' ? setEditProfile(true) : activationAlert()
                    }}>Edit</Button>
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
              </CheckAllowed>
            </Box>
        }
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
  )
}
export default UserProfile;