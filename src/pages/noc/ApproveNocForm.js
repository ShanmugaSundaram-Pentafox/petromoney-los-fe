import {
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import {
  approveNocRequestbyDealershipID,
  rejectNocRequestbyDealershipID,
} from '../../services/noc.services';

const useStyles = makeStyles((theme) => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },

  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },

  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  btnError: {
    '&.MuiButton-contained': {
      marginRight: '8px',
      backgroundColor: theme.palette.error.main,
      color: theme.palette.white
    },
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
}));
const ApproveNocForm = ({ data, callback, currentUser, view }) => {
  const classes = useStyles();
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleReject = () => {
    rejectNocRequestbyDealershipID(data,remark)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setLoading(false);
        callback();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    approveNocRequestbyDealershipID(data, remark)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setLoading(false);
        callback();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const handleChange = (event) => {
    setRemark(event.target.value);
  };
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Approve NOC Form</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <>
        <div className={classes.sidePanelFormContentWrapper}>
          <div className={classes.stepperRoot}>
            <Box>
              <form>
                <Grid item md={7}>
                  <label style={{ marginBottom: 8 }}>Remarks</label>
                  <TextField
                    name="remark"
                    fullWidth
                    multiline
                    variant="outlined"
                    value={remark}
                    onChange={handleChange}
                  />
                </Grid>
              </form>
            </Box>
          </div>
        </div>
        <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <div>
              <Button variant="outlined" onClick={callback}>
                Back
              </Button>
            </div>
            <div style={{ display: 'flex' }}>
              <div>
                {
                  <LoaderButton
                    variant="contained"
                    className={clsx(classes.btn, classes.btnError)}
                    isLoading={loading}
                    loadingText="Submitting..."
                    type="submit"
                    onClick={handleReject}
                  >
                    Reject
                  </LoaderButton>
                }
              </div>
              <div>
                {
                  <LoaderButton
                    variant="contained"
                    className={clsx(classes.btn, classes.editButton)}
                    isLoading={loading}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Approve
                  </LoaderButton>
                }
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default ApproveNocForm;
