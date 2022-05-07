import { IconButton } from '@material-ui/core'
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
// import { getDealershipById } from '../../../services/dealerships.service';
import { URL } from '../../../config/serverUrls';


const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '55vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
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
  },
  typography: {
    marginBottom: 12
  }

}))

const AddCreditPdForm = ({ data, dealer_id, callback, currentUser, editable }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();


  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      pdr_remarks: Yup.string().nullable('Enter your remarks').required('Enter your remarks')

    }),
    onSubmit: values => {
      const date = {
        ...values,
      };
      const data = new FormData();
      Object.keys(date).forEach((key) => {
        data.append(key, date[key]);
      });
      fetch(`${URL.base}dealership/${dealer_id}`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then(res => {
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setTimeout(() => {
            window.location.reload()
          }, 1500);
        })
        .catch(e => {
          enqueueSnackbar(e.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
  });

  const fieldProps = {
    direction: 'column',
    alignTop: true,
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add  Remarks</div>
        <IconButton onClick={callback}  size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Grid container spacing={2}>
            <Grid item md={12}>
              Remarks
              <TextInput
                alignTop
                multiline
                rows={20}
                name='pdr_remarks'
                disabled={editable}
                value={values.pdr_remarks}
                error={errors.pdr_remarks}
                helperText={errors.pdr_remarks}
                onChange={handleChange}
                {...fieldProps}
              />
            </Grid>
          </Grid>
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
            !editable &&
              <Button
                variant="contained"
                className={clsx(classes.btn, classes.editButton)}
                startIcon={<NavigateNextRounded />}
                onClick={handleSubmit}
              >
                Save
              </Button>
          }
        </div>
      </div>
    </div >
  )
}

export default AddCreditPdForm;