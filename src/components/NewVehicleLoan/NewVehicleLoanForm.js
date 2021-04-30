import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '../TextInput/TextInput';
import Button from '../CommonComponents/Button/Button';
import { getVehicleLoanOptions } from '../../services/transports.service';
import { useMount } from 'react-use';
import apiCall from '../../utils/api.util';

const NewVehicleLoanForm = ({ vehicleId, callback, currentUser }) => {
  const [apiStatus, setApiStatus] = useState({});
  const [otherType, setOtherType] = useState("");
  const [loanOptions, setLoanOptions] = useState([]);

  useMount(() => {
    getVehicleLoanOptions()
      .then(data => {
        setLoanOptions(data);
      })
      .catch(e => {
        console.log(e)
      })
  })
  
  const { values, errors, handleChange, handleSubmit, setErrors, isSubmitting, setSubmitting } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      credit_head: Yup.number().required('Choose Loan Type'),
      loan_amount: Yup.number(),
      remarks: Yup.string(),
    }),
    onSubmit: formData => {
      const d = loanOptions.find(d => d.id == formData?.credit_head);
      if(Number(formData.credit_head) === 5 && !formData.remarks) {
        setErrors({ remarks: "Please enter remarks" });
        setSubmitting(false)
        return;
      }
      if(!d.is_service && !formData.loan_amount) {
        setErrors({ loan_amount: "Please enter loan amount" });
        setSubmitting(false)
        return;
      }
      let remarks = formData.remarks;
      if(!remarks) {
        remarks = d.desc;
      }
      apiCall(`vehicle/${vehicleId}/loan`, {
        method: 'POST',
        body: {
          is_service: d.is_service,
          credit_head_id: parseInt(formData.credit_head),
          loan_amount: formData.loan_amount || 0,
          remarks,
          user_id: currentUser.id,
        }
      })
      .then(res => {
        console.log(res);
        if(res.status == 'SUCCESS') {
          callback();
        } else {
          setApiStatus({
            type: 'ERROR',
            message: res.message || 'Unable to send credit request. Please try again later.'
          })
        }
      })
      .catch(err => {
        console.log(err);
        setApiStatus({ type: 'ERROR', message: 'Unable to raise loan/service request. Please contact Admin' })
      })
      // callback();
      setTimeout(() => {
        setSubmitting(false)
      }, 3000)
    }
  });
  const inputProps = {
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <TextInput
              {...inputProps}
              select
              labelText="Loan/Service Type"
              name="credit_head"
              value={values.credit_head}
              error={errors.credit_head}
              helperText={errors.credit_head}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Choose loan/service type</option>
              {
                loanOptions.map(item => <option key={item.id} value={item.id}>({item.credit_head}) - {item.credit_desc}</option>)
              }
            </TextInput>
          </Grid>
          {
            Number(values.credit_head) === 5 ? (
              <Grid item md={12}>
                <TextInput
                  {...inputProps}
                  name="remarks"
                  labelText="Remarks"
                  value={values.remarks}
                  error={errors.remarks}
                  helperText={errors.remarks}
                />
              </Grid>
            ) : null
          }
          {
            Number(values.credit_head) === 4 ? null : (
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  money
                  name="loan_amount"
                  labelText="Loan Amount"
                  value={values.loan_amount}
                  error={errors.loan_amount}
                  helperText={errors.loan_amount}
                />
              </Grid>
            )
          }
          <Grid item xs={12} justify="flex-end" alignItems="flex-end">
            <Button
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? `Please wait...` : (Number(values.credit_head) === 4 ? `Raise request` :  `Submit Loan Request`)}
            </Button>
          </Grid>
        </Grid>
      </form>
      {apiStatus.type && (
        <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
      )}
    </Box>
  )
}

export default NewVehicleLoanForm;