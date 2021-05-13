import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { updatePassword, updateUserDetails } from '../../../services/common.service';
import { Paper, TextField, Tooltip, Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import MapRegion from './MapRegion';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import UserCan from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';



const useStyles = makeStyles({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: 2,
    },
  },
  list: {
    width: '50%',
  },
  fullList: {
    width: '100%',
  },
  drawerStyle: {
    minWidth: '30vw',

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
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function TemporaryDrawer({ userId, data, currentUser }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [showUserEditDrawer, setShowUserEditDrawer] = useState(false);
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState(data.name)
  const [userMail, setUserMail] = useState(data.email)
  const [confirmPassword, SetConfirmPassword] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const saveProfile = () => {
  console.log("data",data)
    console.log("name",userName)
    console.log("mail",userMail)
    updateUserDetails(userName, userMail, userId)
      .then(
        setProfileSuccess(true),
        setTimeout(() => {
          setProfileSuccess(false)
        }, 2000),
      )
      .catch(err => {
        console.log(err)
      })
  }

  const checkPassword = () => {
    if (password === confirmPassword && password !== null) {
      updatePassword(password, data.mobile, userId)
        .then(
          setPasswordSuccess(true),
          setTimeout(() => {
            setPassword("")
            SetConfirmPassword("")
            setPasswordSuccess(false)
          }, 2000),
        )
        .catch(err => {
          console.log(err)
        })

    } else {
      console.log("ASDA")
      handleClick({ vertical: 'top', horizontal: 'center' })
    }
  }
  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShowUserEditDrawer(st => !st);
  };

  return (
    <>
      <Button onClick={toggleDrawer()}>
        <Tooltip title="edit" aria-label="add">
          <VisibilityOutlinedIcon style={{ width: "20px", color: "#000A0" }} />
        </Tooltip>
      </Button>
      <Drawer anchor={"right"} open={showUserEditDrawer} onClose={toggleDrawer()}>
        {/* <Box p={2} borderRadius={4} bgcolor={"#f1f1f1"} className={classes.drawerStyle} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" component="h2">User Information</Typography>
          <IconButton size="small" onClick={toggleDrawer()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box> */}
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

        }

        <Box p={2} pl={3} >
          {
            !data ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Skeleton variant="rect" width="100%" height={160} />
                </Grid>
                {
                  data.role_desc === "Field Officer" ?
                    <Grid item xs={12}>
                      <Skeleton variant="rect" width="100%" height={400} />
                    </Grid> : null
                }
                <Grid item xs={12} >
                  <Skeleton variant="rect" width="100%" height={200} />
                </Grid>
              </Grid>
            ) : (
              <>
                <Box borderRadius={4} className={classes.drawerStyle} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" component="h3" >Profile Information</Typography>
                </Box>
                <Box mb={2}>
                  <form>
                    <Box mb={1}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Name</label>
                      <p><TextField
                        id="standard-basic"
                        defaultValue={data.name}
                        className={classes.textFieldStyle}
                        onChange={e => setUserName(e.target.value)}
                      /></p>
                    </Box>
                    <Box mb={1}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Mobile</label>
                      <p style={{ fontSize: 16 }}>{data.mobile}</p>
                    </Box>
                    <Box mb={1}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 10 }}>Email</label>
                      <p><TextField
                        id="standard-basic"
                        defaultValue={data.email}
                        className={classes.textFieldStyle}
                        onChange={e => setUserMail(e.target.value)}
                      /></p>
                    </Box>
                  </form>
                  <div>
                    <Button variant={"contained"} color="primary" onClick={() => saveProfile()}>Save</Button>
                  </div>
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
                {
                }
                <Divider />
                <Box mt={2} mb={2} bgcolor={"#fafafa"}>
                  <Typography variant="h4" component="h3">Reset Password</Typography>
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
                  <Button variant={"contained"} color="primary" onClick={e => checkPassword()}>
                    Update Password
                    </Button>
                </Box>
              </>
            )
          }
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning">
              Password does not match
              </Alert>
          </Snackbar>
        </Box>
      </Drawer>

    </>
  );

}
