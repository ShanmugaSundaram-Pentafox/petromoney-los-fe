import DateFnsUtils from '@date-io/date-fns';
import { Grid } from '@mantine/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
// import TextInput from '../../../components/TextInput/TextInput';
import { Button } from '../../../components/Mantine/Button/Button';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import { TextInput } from '../../../components/Mantine/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { URL } from '../../../config/serverUrls';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

const AddOmcDetailsForm = ({ open, onClose, data: init_data, dealer_id, isEdit, currentUser, callback, editable }) => {
  const [readOnly, setReadOnly] = useState(isEdit);
  const [loading, setLoading] = useState(false)
  const [executedDate, setExecutedDate] = useState(init_data?.agreement_executed_on ? parse(init_data?.agreement_executed_on, 'dd-MM-yyyy', new Date()) : new Date())
  const [validDate, setValidDate] = useState(init_data?.agreement_valid_till ? parse(init_data?.agreement_valid_till, 'dd-MM-yyyy', new Date()) : new Date())

  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  };
  const handleExecutedDateChange = (date) => {
    setExecutedDate(date)
  }
  const handleValidDateChange = (date) => {
    setValidDate(date)
  }
  const { enqueueSnackbar } = useSnackbar();
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {...init_data},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      let obj = {};
      if (!isEdit) {
        obj = compareObject(init_data, values)
      }
      else {
        obj = values 
      }
      const executed_date = executedDate ? format(new Date(executedDate), 'dd-MM-yyyy') : values.agreement_executed_on;
      const valid_date = validDate ? format(new Date(validDate), 'dd-MM-yyyy') : values.agreement_valid_till;
      const date = { ...obj, agreement_executed_on: executed_date, agreement_valid_till: valid_date };
      const data = new FormData();
      Object.keys(date).forEach((key) => {
        data.append(key, date[key]);
      });
      fetch(`${URL.base}dealership/${dealer_id}/omc`, {
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
          callback();
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

  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }

  return (
    <RightSideDrawer
      size="lg"
      opened={open}
      onClose={onClose}
      title="Add OMC Details"
      footerAction={{
        left: {
          onClick: handleClose
        },
        right: {
          renderBtnComponent: (
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.omcEdit}>
              <Button
                colorScheme="primary"
                size="md"
                onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
                loading={loading}
              >
                {readOnly ? 'Edit' : 'Save'}
              </Button>
            </CheckAllowed>
          )
        }
      }}
    >
      {readOnly ? (
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <ViewData title='Sales officer name' value={values?.sales_officer_name} style={{ marginBottom: 6 }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <ViewData title='Sales officer mobile' value={values?.sales_officer_mobile} style={{ marginBottom: 6 }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <ViewData title='Mode Call/Mail' value={values?.communication_mode} style={{ marginBottom: 6 }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <ViewData title='Dealership agreement executed on' value={values?.agreement_executed_on} style={{ marginBottom: 6 }} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <ViewData title='Dealership agreement valid till' value={values?.agreement_valid_till} style={{ marginBottom: 6 }} />
          </Grid.Col>
        </Grid>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid gutter="sm">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                label="Sales officer name"
                name="sales_officer_name"
                value={values.sales_officer_name}
                disabled={readOnly || editable}
                readOnly={readOnly}
                error={errors.sales_officer_name}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                label="Sales officer mobile"
                name="sales_officer_mobile"
                value={values.sales_officer_mobile}
                disabled={readOnly || editable}
                readOnly={readOnly}
                type='number'
                error={errors.sales_officer_mobile}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                {...inputProps}
                label="Mode Call/Mail"
                name="communication_mode"
                disabled={readOnly || editable}
                readOnly={readOnly}
                value={values.communication_mode}
                error={errors.communication_mode}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Dealership agreement executed on</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  variant='inline'
                  inputVariant='outlined'
                  format='dd-MM-yyyy'
                  animateYearScrolling={true}
                  invalidDateMessage='Invalid Date Format'
                  error={errors.agreement_executed_on}
                  helperText={errors.agreement_executed_on}
                  margin='normal'
                  id='date-picker'
                  autoOk={true}
                  value={executedDate}
                  readOnly={readOnly}
                  disabled={readOnly || editable}
                  onChange={handleExecutedDateChange}
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <label>Dealership agreement valid till</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  hideTabs={true}
                  variant='inline'
                  inputVariant='outlined'
                  format='dd-MM-yyyy'
                  maxDate={new Date('2050-01-01')}
                  readOnly={readOnly}
                  disabled={readOnly || editable}
                  error={errors.agreement_valid_till}
                  helperText={errors.agreement_valid_till}
                  animateYearScrolling={true}
                  // invalidDateMessage='Invalid Date Format'
                  margin='normal'
                  id='date-picker'
                  autoOk={true}
                  value={validDate}
                  onChange={handleValidDateChange}
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
            </Grid.Col>
          </Grid>
        </form>
      )}
    </RightSideDrawer>
  )
}

export default AddOmcDetailsForm;