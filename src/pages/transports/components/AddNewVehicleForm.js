import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { VehicleDetails } from './VehicleDetails';
import Button from '../../../components/CommonComponents/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import {
  addNewVehicle,
  getVehicleInfoFromID,
} from '../../../services/transports.service';
import LoaderButton from '../../../components/CommonComponents/Button/LoaderButton';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflowY: 'auto',
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
  items: {
    '&.MuiGrid-item': {
      paddingTop: 0,
      paddingBottom: 2
    }
  }
}));

const AddNewVehicleForm = ({
  data,
  id,
  number,
  trans_id,
  isEdit,
  isAdd,
  callback,
}) => {
  const queryClient = useQueryClient()
  const [readOnly, setReadOnly] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState()
  const classes = useStyles();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: {
      tt_no: number,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      tt_no: Yup.string().required('Please enter vehicle number').nullable('Enter vehicle number').matches(/^[A-Z]{2}[0-9]{2}[A-Z\s]{0,2}[0-9]{4,6}$/, 'Invalid Vehicle Number'),
    }),
    onSubmit: (formData) => {
      setLoading(true);
      addNewVehicle(formData, id)
        .then((message) => {
          setLoading(false)
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          getVehicleInfoFromID(id)
            .then((data) => {
              setVehicleDetails(data?.find(item => item.tt_no === formData.tt_no)?.vehicle_details)
            })
            .catch(e => console.log(e))
        })
        .catch((e) => {
          setLoading(false)
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        });
      // }
    },
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
  };
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>Vehicle Information</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  {readOnly ? (
                    <TextInput
                      {...inputProps}
                      labelText='Vehicle Number'
                      value={number}
                      readOnly={readOnly}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    <TextInput
                      {...inputProps}
                      name='tt_no'
                      labelText='Vehicle Number'
                      value={values.tt_no?.toUpperCase()}
                      readOnly={readOnly}
                      error={errors.tt_no}
                      helperText={errors.tt_no}
                      onChange={handleChange}
                    />
                  )}
                </Grid>
                <Grid item md={6}>
                  <LoaderButton 
                    variant='contained'
                    className={clsx(classes.btn, classes.editButton)}
                    isLoading={loading}
                    loadingText='Saving...'
                    style={{marginTop: 19}}
                    onClick={handleSubmit}
                    type='submit'
                  >Save</LoaderButton>
                </Grid>
              </Grid>
              <Divider style={{marginTop: 8}} />
            </form>
            {
              vehicleDetails &&
                <VehicleDetails vehicleTestDet={vehicleDetails} />
            }
          </Box>
          <Button
            variant='outlined'
            startIcon={<NavigateBeforeRoundedIcon />}
            disabled={loading}
            onClick={() => {callback(); queryClient.invalidateQueries(['vehicleData', id])}}
            style={{marginTop: 10}}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewVehicleForm;
