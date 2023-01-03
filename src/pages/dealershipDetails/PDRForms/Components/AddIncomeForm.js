import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import Button from '../../../../components/CommonComponents/Button/Button';
import TextInput from '../../../../components/TextInput/TextInput';
import { getBusinessTypes } from '../../../../services/common.service';
import { addIncomeDetailsByID } from '../../../../services/PDReport.services';
import { compareObject } from '../../../../utils/compareObject.util';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
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
    width: '55vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  btn: {
    margin: 8
  },
}))


const AddIncomeForm = ({ data: init_data, isEdit, id, handleClose }) => {
  const [loading, setLoading] = useState(false)
  const [businessTypes, setBusinessTypes] = useState([{}, {}, {}, {}, {}]);


  useMount(() => {
    getBusinessTypes()
      .then(setBusinessTypes)
      .catch(err => {
        // logger(err)
      })
  })
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: { ...init_data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      business_name: Yup.string().nullable('Enter business type').required('Enter business type'),
      business_age: Yup.number().nullable('Enter business age').required('Enter business age'),
      business_type: Yup.string().nullable().required('Choose business type'),
      cur_fy_income: Yup.number().nullable('Enter income').required('Enter income'),
      cur_fy_profit_loss: Yup.number().nullable().required('Enter profit/loss'),
      cur_fy_turnover: Yup.number().nullable().required('Enter turnover')
    }),
    onSubmit: values => {
      let obj = {};
      if (isEdit) {
        obj = compareObject(init_data, values)
      }
      else {
        obj = { ...values }
      }
      const edit_data = { ...obj, id: values.id, is_pdr: 1 }
      addIncomeDetailsByID(edit_data, id, isEdit)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1500);
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }

  return (

    <>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    labelText="Name of the business"
                    name="business_name"
                    value={values.business_name}
                    error={errors.business_name}
                    helperText={errors.business_name}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    select
                    labelText="Business Type"
                    name="business_type"
                    defaultValue={values.business_type}
                    error={errors.business_type}
                    helperText={errors.business_type}
                  >
                    <option value="">Choose type</option>
                    {
                      businessTypes?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    labelText="Business owner"
                    name="business_owner"
                    value={values.business_owner}
                    error={errors.business_owner}
                    helperText={errors.business_owner}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    number
                    labelText="Business age(in year)"
                    name="business_age"
                    value={values.business_age}
                    error={errors.business_age}
                    helperText={errors.business_age}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="FY Income"
                    name="cur_fy_income"
                    value={values.cur_fy_income}
                    error={errors.cur_fy_income}
                    helperText={errors.cur_fy_income}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="FY Turnover"
                    name="cur_fy_turnover"
                    value={values.cur_fy_turnover}
                    error={errors.cur_fy_turnover}
                    helperText={errors.cur_fy_turnover}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    number
                    labelText="FY Profit"
                    name="cur_fy_profit_loss"
                    type='number'
                    value={values.cur_fy_profit_loss}
                    error={errors.cur_fy_profit_loss}
                    helperText={errors.cur_fy_profit_loss}
                  />
                </Grid>
              </Grid>
            </form>
          </Box >
        </div>
      </div>
      <div className={classes.actionFoot}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              className={classes.btn}
              // disabled={loading}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              type="submit"
              className={clsx(classes.btn, classes.editButton)}
              startIcon={<NavigateNextRounded />}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default AddIncomeForm;