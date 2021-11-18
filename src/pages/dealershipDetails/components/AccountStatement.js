import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextInput, { InputWrapper } from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import Button from '../../../components/CommonComponents/Button/Button';
import { useSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { downloadAccountStatement } from '../../../services/dealerships.service';
import DialogContent from '@material-ui/core/DialogContent';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { Formik } from 'formik';
import { date, object } from "yup";


const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-end'
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
  },
  icon: {
    marginRight: 4,
    marginTop: 12,
  },
  fileStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  icons: {
    marginRight: 16,
  },
  number: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  },
  input: {
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  }
}));




const AccountStatement = ({ id, currentUser }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [fileCode, setFileCode] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();


  const handleDateChange = (date, type) => {
    if (type == 'from')
      setSelectedDate({ ...selectedDate, from_date: date })
    // setValues({ ...values, from_date: date })

    else
      setSelectedDate({ ...selectedDate, to_date: date })
    // setValues({ ...values, from_date: date })

  }
  useEffect = () => {

  }

  const handleDownload = () => {
    setLoading(true)
    downloadAccountStatement(id)
      .then(res => {
        setFileCode(res.base64)
        setOpenDialog(true)
        setLoading(false)
      })
      .catch((e) => {
        enqueueSnackbar('Something went wrong please try again.', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }

  const _vSchema = object({
    date: date().required().min(new Date()).max(new Date("2100-10-10")),
  });

  return (
    <Formik
      validateOnBlur
      validateOnChange={false}
      validationSchema={_vSchema}
      onSubmit={handleDownload}
    >
      {
        ({ values, errors, handleChange, handleSubmit, isSubmitting, setFieldValues, setSubmitting, setValues }) => (
          <>
            <Typography variant='h4' style={{ marginTop: 4, marginBottom: 12 }}>Account statement</Typography>
            <Grid container spacing={2}>
              <Grid item>
                <InputWrapper direction top>
                  <label className="input-label">From date</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      name="from_date"
                      hideTabs={true}
                      variant='inline'
                      inputVariant='outlined'
                      format='dd/MM/yyyy'
                      animateYearScrolling={true}
                      invalidDateMessage='Invalid Date Format'
                      margin='normal'
                      id='date-picker'
                      autoOk={true}
                      value={values?.from_date}
                      onChange={(date) => setValues('from_date', date, { shouldValidate: true, shouldDirty: true })}
                      keyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      PopoverProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'center',
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </InputWrapper>
              </Grid>
              <Grid item>
                <InputWrapper direction top>
                  <label className="input-label">To date</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      name="to_date"
                      hideTabs={true}
                      variant='inline'
                      inputVariant='outlined'
                      format='dd/MM/yyyy'
                      animateYearScrolling={true}
                      invalidDateMessage='Invalid Date Format'
                      margin='normal'
                      id='date-picker'
                      autoOk={true}
                      value={values?.to_date}
                      onChange={(date) => setValues('to_date', date, { shouldValidate: true, shouldDirty: true })}
                      // onChange={(e) => { handleDateChange(e, 'to') }}
                      keyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      PopoverProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'center',
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </InputWrapper>
              </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
              <Button
                disabled={!permissionCheck(currentUser.role_name, rulesList.dealership_edit)}
                color="primary"
                variant="contained"
                size="small"
                type="submit"
                onClick={handleDownload}>
                Get statement
              </Button>
            </div>
            <FormDialog
              open={openDialog}
              title={'Personal Discussion Report'}
              onClose={() => { setOpenDialog(false) }}
            >
              <div className={classes.dialogBox} >
                <DialogContent className={classes.frame}>
                  <iframe src={`data:application/pdf;base64,${fileCode}`} height="900" width="500" frameBorder="0"></iframe>
                </DialogContent>
              </div>
            </FormDialog>
          </>
        )
      }
    </Formik>
  );
};

export default AccountStatement;