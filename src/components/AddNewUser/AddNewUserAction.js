import React, { useState } from 'react';
import FormDialog from '../CommonComponents/FormDialog/FormDialog';
import AddNewUserForm from './AddNewUserForm';
import Button from '../CommonComponents/Button/Button';
import { getAllUsers } from '../../services/users.service';
import { useDispatch } from 'react-redux';
import { setAllUsers } from '../../store/dashboard/dashboard.actions';
import { Drawer } from "@material-ui/core";
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


const AddNewUserAction = () => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles()


  const saveUserCallback = () => {
    getAllUsers()
      .then(data => {
        dispatch(setAllUsers(data));
      })
      .catch(e => {
        console.log(e);
      });

    setOpenModal(false);
  }

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpenModal(true)}
      >
        Create New User
      </Button>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        <div className={classes.sidePanelFormWrapper}>
          <Typography className={classes.sidePanelTitle} variant="h4">
            <div>Add New User Form</div>
            <CloseIcon onClick={() => setOpenModal(false)} />
          </Typography>
          <div className={classes.sidePanelFormContentWrapper}>
            <div className={classes.stepperRoot}>
              <AddNewUserForm callback={saveUserCallback} />
            </div>
          </div>
          <div className={classes.actionFooter}>
            <Divider />
            <div className={classes.actionButtonsWrapper}>
              <div>
                <Button
                  variant="outlined"
                  onClick={() => setOpenModal(false)}
                >
                  Back
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  type="submit"
                  className={clsx(classes.btn, classes.editButton)}
                >
                  Create New User
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      {/* <FormDialog
        title="New User Form"
        open={openModal}
        onClose={() => setOpenModal(false)}
      > */}
      {/* </FormDialog> */}
    </div>
  )
}

export default AddNewUserAction;