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
import { ViewData } from '../../components/CommonComponents/FilePreview';
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
    paddingTop: 20,
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
  const [loading, setLoading] = useState({ approve: false, reject: false });
  const { enqueueSnackbar } = useSnackbar();

  const handleReject = () => {
    setLoading({ ...loading, reject: true })
    rejectNocRequestbyDealershipID(data?.dealership_id, remark)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setLoading({ ...loading, reject: false });
        callback();
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        setLoading({ ...loading, reject: false });
        callback();
      });
  };

  const handleSubmit = () => {
    setLoading({ ...loading, approve: true })
    approveNocRequestbyDealershipID(data?.dealership_id, remark)
      .then((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setLoading({ ...loading, approve: false });
        callback();
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        setLoading({ ...loading, approve: false });
        callback();
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
            <Grid container spacing={2}>
              <Grid item md={6}><ViewData title={'Dealership ID'} value={data?.dealership_id} /></Grid>
              <Grid item md={6}><ViewData title={'Dealership Name'} value={data?.name} /></Grid>
              <Grid item md={6}><ViewData title={'Applicant code'} value={data?.applicant_code} /></Grid>
              <Grid item md={6}><ViewData title={'NOC Type'} value={data?.noc_type} /></Grid>
            </Grid>
            <Box style={{ marginTop: 20 }}>
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
                    isLoading={loading?.reject}
                    loadingText="Rejecting..."
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
                    isLoading={loading?.approve}
                    loadingText='Approving...'
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
