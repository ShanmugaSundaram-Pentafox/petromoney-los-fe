import { Box, Grid, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import UserEditForm from './userEditForm';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { action_id, resources_id } from '../../../config/accessControl';
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
    marginTop: 20,
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

const UserProfile = ({ currentUser, data, }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [userLoading, setuserLoading] = useState(false);
  const [passLoading, setpassLoading] = useState(false);
  const [roleList, setRoleList] = useState([])
  const [readOnly, setReadOnly] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
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
              <UserEditForm data={data} currentUser={currentUser} roleList={roleList} editProfile={editProfile} />
            )
          }
        </>
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
      </div>
    </div>
  )
}
export default UserProfile;