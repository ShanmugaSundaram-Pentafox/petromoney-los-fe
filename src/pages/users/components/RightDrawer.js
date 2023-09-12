import { IconButton, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import clsx from 'clsx';
import { useSnackbar } from 'notistack'
import React, { useState } from 'react';
import { useMount } from 'react-use';
import PasswordForm from './PasswordForm';
import UserEditForm from './userEditForm';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { action_id, resources_id } from '../../../config/accessControl';
import { logger } from '../../../config/logger';
import { deleteUser, getAllUserRoles } from '../../../services/users.service';
import CheckAllowed from '../../rbac/CheckAllowed';

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
    padding: '8px 16px',
    marginBottom: 6,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  activeBtn: {
    color: '#128C7E'
  }
}));

export default function TemporaryDrawer({ data, currentUser, callback }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [userLoading, setuserLoading] = useState(false);
  const [passLoading, setpassLoading] = useState(false);
  const [roleList, setRoleList] = useState([])
  const [readOnly, setReadOnly] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
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
            !editProfile &&
              <Box className={classes.button}>
                <CheckAllowed currentUser={currentUser} resource={resources_id.users} action={action_id.users.userEdit}>
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
                </CheckAllowed>
              </Box>
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
                <UserEditForm data={data} currentUser={currentUser} roleList={roleList} editProfile={editProfile} />
              )
            }
            {
              !editPassword ? (
                <>
                  <Divider />
                  <div className={classes.passwordSection}>
                    <Box className={classes.button}>
                      <CheckAllowed currentUser={currentUser} resource={resources_id.users} action={action_id.users.userChange_password}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<VpnKeyIcon  />}
                          onClick={() => {
                            setReadOnly(false);
                            data.status === 'Active' ? setEditPassword(true) : activationAlert()
                          }}>Change password</Button>
                      </CheckAllowed>
                    </Box>
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
      
    </div >
  );

}
