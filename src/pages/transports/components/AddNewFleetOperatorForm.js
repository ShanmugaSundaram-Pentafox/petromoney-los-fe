import { Flex, Grid, Text } from '@mantine/core';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Button } from '../../../components/Mantine/Button/Button';
import { Divider } from '../../../components/Mantine/Divider/Divider';
import { TextInput } from '../../../components/Mantine/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { addNewFleetOperator, updateFleetOperator } from '../../../services/transports.service';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

export const ViewData = ({ title, value }) => {
  return (
    <Grid.Col span={{ base: 12, sm: 6 }}>
      <Text size="sm" fw="600" c="gray.7">{title}</Text>
      <Text 
        size="sm"
        c="gray.6"
      >
        {value ? value : '-'}
      </Text>
    </Grid.Col>
  )
}

const AddNewFleetOperatorForm = ({ data, dealer_id, isEdit, callback, editable, currentUser }) => {
  const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
  const [loading, setLoading] = useState(false)

  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  }
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
    initialValues: {
      ...data,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      transport_name: Yup.string().required('Please enter Transport Name').nullable('Please enter Transport Name'),
      vehicle_no: Yup.string().required('Please Enter Vehicle Number').nullable('Please Enter Vehicle Number').matches(/^[A-Z]{2}[0-9]{2}[A-Z\s]{0,2}[0-9]{4,6}$/, 'Invalid Vehicle Number'),
      mobile: Yup.number().required('Enter mobile number').nullable('Enter mobile number').test('maxDigits', 'Mobile Number mush have 10 digits', (number) => String(number).length === 10),
      name_on_card: Yup.string().required('Please Enter your name').nullable('Please Enter your name'),
      dtplus_card_number: Yup.string().max(16, 'Enter valid card number').required('Please enter your card number').nullable('Please enter your card number'),
      validity: Yup.number().required('Please enter Validity').nullable('Please enter Validity'),
      client_name: Yup.string().required('Please enter Client Name').nullable('Please enter Client Name'),
      monthly_billing: Yup.number().required('Please enter monthly billing').nullable('Please enter monthly billing'),
      credit_period: Yup.number().required('Please enter credit period').nullable('Please enter credit period'),
      total_credit_os: Yup.number().required('Please enter outstanding credit').nullable('Please enter outstanding credit'),
    }),
    onSubmit: values => {
      if (data) {
        let obj = {};
        if (!readOnly) {
          obj = compareObject(data, values)
        }
        else {
          obj = { ...values }
        } 
        setLoading(true)
        updateFleetOperator(obj, dealer_id, data.id)
          .then(res => {
            setLoading(false)
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
            setTimeout(() => {
              window.location.reload()
            }, 1500);

          })
          .catch(e => {
            setLoading(false)
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            }
            )
          })

      }
      else {
        setLoading(true);
        addNewFleetOperator(values, dealer_id)
          .then(res => {
            setLoading(false)
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
            setTimeout(() => {
              window.location.reload()
            }, 1500);
          })
          .catch(e => {
            setLoading(false)
            enqueueSnackbar('Something went wrong, Please try Again!', {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            }
            )
          })
      }
    }
  });

  return (
    <>
      {/* Drawer content */}
      <div style={{ flexGrow: 1, padding: '16px 16px 40px', overflowY: 'auto' }}>
        {readOnly ? (
          <Grid gutter="sm">
            <ViewData title='Transport Name' value={values.transport_name} />
            <ViewData title='Vehicle Number' value={values.vehicle_no} />
            <ViewData title='Mobile' value={values.mobile} />
            <ViewData title='Email' value={values.email} />
            <ViewData title='Amount Limit' value={values.amount_limit} />
            <ViewData title='DT Plus Card Number' value={values.dtplus_card_number} />
            <ViewData title='Name on Card' value={values.name_on_card} />
            <ViewData title='Validity' value={values.validity} />
          </Grid>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid gutter="sm">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput  
                  label="Transport Name"
                  name="transport_name"
                  value={values.transport_name?.toUpperCase()}
                  onChange={handleChange}                
                  readOnly={readOnly}
                  error={errors.transport_name}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Vehicle Number"
                  name="vehicle_no"
                  defaultValue={values.vehicle_no}
                  value={values.vehicle_no?.toUpperCase()}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.vehicle_no}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Mobile"
                  name="mobile"
                  defaultValue={values.mobile}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.mobile}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Email"
                  name="email"
                  defaultValue={values.email}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.email}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Amount Limit"
                  name="amount_limit"
                  value={values.amount_limit}
                  onChange={handleChange}
                  error={errors.amount_limit}
                  readOnly={readOnly}
                  money
                />
              </Grid.Col>

              <Grid.Col>
                <Divider 
                  my="xs"
                  label="Card Details" 
                  labelPosition="left" 
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="DT Plus Card Number "
                  name="dtplus_card_number"
                  value={values.dtplus_card_number}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.dtplus_card_number}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Name on Card"
                  name="name_on_card"
                  value={values.name_on_card}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.name_on_card}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  type='number'
                  label="Validity"
                  name="validity"
                  value={values.validity}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.validity}
                />
              </Grid.Col>

              <Grid.Col>
                <Divider 
                  my="xs"
                  label="Billing Details" 
                  labelPosition="left" 
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Client Name"
                  name="client_name"
                  value={values.client_name}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.client_name}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Monthly billing"
                  name="monthly_billing"
                  value={values.monthly_billing}
                  onChange={handleChange}
                  error={errors.monthly_billing}
                  readOnly={readOnly}
                  money
                />
              </Grid.Col>

              {/* <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Payment method"
                  name="payment_type"
                  value={values.payment_type}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.payment_type}
                  select
                >
                  <option>Credit</option>
                  <option>Cash</option>
                </TextInput>
              </Grid.Col> */}

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Credit Period"
                  name="credit_period"
                  value={values.credit_period}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.credit_period}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Total Credit Outstanding"
                  name="total_credit_os"
                  value={values.total_credit_os}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.total_credit_os}
                  money
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Highest number of days Outstanding"
                  name="highest_days_os"
                  value={values.highest_days_os}
                  onChange={handleChange}
                  readOnly={readOnly}
                  error={errors.highest_days_os}
                />
              </Grid.Col>
            </Grid>

            {/* <Grid container spacing={2}>
              <Grid item md={6}>
                <TextInput
                  label="Transport Name"
                  name="transport_name"
                  value={values.transport_name?.toUpperCase()}
                  error={errors.transport_name}
                  readOnly={readOnly}
                  helperText={errors.transport_name}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Vehicle Number"
                  name="vehicle_no"
                  readOnly={readOnly}
                  error={errors.vehicle_no}
                  helperText={errors.vehicle_no}
                  defaultValue={values.vehicle_no}
                  value={values.vehicle_no?.toUpperCase()}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Mobile"
                  name="mobile"
                  defaultValue={values.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                  readOnly={readOnly}
                  InputLabelProps={{ shrink: true }}
                  helperText={errors.mobile}
                ></TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Email"
                  name="email"
                  readOnly={readOnly}
                  error={errors.email}
                  helperText={errors.email}
                  defaultValue={values.email}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Amount Limit"
                  name="amount_limit"
                  value={values.amount_limit}
                  helperText={errors.amount_limit}
                  readOnly={readOnly}
                  error={errors.amount_limit}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  money
                >
                </TextInput>
              </Grid>
              <Grid item md={12}>
                <Typography className={classes.title} variant="h4">Card Details</Typography>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="DT Plus Card Number "
                  name="dtplus_card_number"
                  value={values.dtplus_card_number}
                  error={errors.dtplus_card_number}
                  readOnly={readOnly}
                  helperText={errors.dtplus_card_number}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                >
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Name on Card"
                  name="name_on_card"
                  value={values.name_on_card}
                  error={errors.name_on_card}
                  readOnly={readOnly}
                  helperText={errors.name_on_card}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                >
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Validity"
                  name="validity"
                  value={values.validity}
                  error={errors.validity}
                  readOnly={readOnly}
                  helperText={errors.validity}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  type='number'
                >
                </TextInput>
              </Grid>
              <Grid item md={12}>
                <Typography className={classes.title} variant="h4">Billing Details</Typography>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Client Name"
                  name="client_name"
                  value={values.client_name}
                  error={errors.client_name}
                  readOnly={readOnly}
                  helperText={errors.client_name}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                >
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Monthly billing"
                  name="monthly_billing"
                  value={values.monthly_billing}
                  error={errors.monthly_billing}
                  readOnly={readOnly}
                  helperText={errors.monthly_billing}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  money
                >
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Payment method"
                  name="payment_type"
                  value={values.payment_type}
                  error={errors.payment_type}
                  readOnly={readOnly}
                  select
                  helperText={errors.payment_type}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                >
                  <option>Credit</option>
                  <option>Cash</option>
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Credit Period"
                  name="credit_period"
                  value={values.credit_period}
                  error={errors.credit_period}
                  readOnly={readOnly}
                  helperText={errors.credit_period}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                >
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Total Credit Outstanding"
                  name="total_credit_os"
                  value={values.total_credit_os}
                  error={errors.total_credit_os}
                  readOnly={readOnly}
                  helperText={errors.total_credit_os}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  money
                >
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  label="Highest number of days Outstanding"
                  name="highest_days_os"
                  value={values.highest_days_os}
                  error={errors.highest_days_os}
                  readOnly={readOnly}
                  helperText={errors.highest_days_os}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                >
                </TextInput>
              </Grid>
            </Grid> */}
          </form>
        )}
      </div>

      {/* Sticky footer */}
      <Flex
        h="64"
        style={{
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'end',
          padding: '0 16px',
          background: '#FFFFFF',
          borderTop: '1px solid #eaeaea',
          zIndex: 9
        }}
      >
        <Flex gap="sm">
          <Button
            colorScheme="secondary"
            variant="outline"
            size="md"
            color="gray"
            onClick={handleClose}
          >
            Go back
          </Button>

          {!readOnly ? (
            <Button
              colorScheme={'green'}
              size="md"
              onClick={loading ? () => null : handleSubmit}
              loading={loading}
            >
              Save
            </Button>  
          ) : (
            <CheckAllowed currentUser={currentUser} resource={resources_id?.fleetOperator} action={action_id?.fleetOperator?.edit}>
              <Button
                size="md"
                type="submit"
                onClick={loading ? () => null : handleEdit}
                loading={loading}
              >
                Edit
              </Button>
            </CheckAllowed>
          )}
        </Flex>
      </Flex>
      
      {/* {
        readOnly ? (
          <div className={classes.sidePanelFormContentWrapper}>
            <Grid container spacing={2} className={classes.readOnlyWrapper}>
              <Grid item md={6}>
                <Box className={classes.box} >
                  <ViewData title='Transport Name' value={values.transport_name} />
                  <ViewData title='Vehicle Number' value={values.vehicle_no} />
                  <ViewData title='Mobile' value={values.mobile} />
                  <ViewData title='Email' value={values.email} />
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box className={classes.box}>
                  <ViewData title='Amount Limit' value={values.amount_limit} />
                  <ViewData title='DT Plus Card Number' value={values.dtplus_card_number} />
                  <ViewData title='Name on Card' value={values.name_on_card} />
                  <ViewData title='Validity' value={values.validity} />
                </Box>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div className={classes.sidePanelFormContentWrapper}>
            <div className={classes.stepperRoot}>
              <Box>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      <TextInput
                        label="Transport Name"
                        name="transport_name"
                        value={values.transport_name?.toUpperCase()}
                        error={errors.transport_name}
                        readOnly={readOnly}
                        helperText={errors.transport_name}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Vehicle Number"
                        name="vehicle_no"
                        readOnly={readOnly}
                        error={errors.vehicle_no}
                        helperText={errors.vehicle_no}
                        defaultValue={values.vehicle_no}
                        value={values.vehicle_no?.toUpperCase()}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Mobile"
                        name="mobile"
                        defaultValue={values.mobile}
                        onChange={handleChange}
                        error={errors.mobile}
                        readOnly={readOnly}
                        InputLabelProps={{ shrink: true }}
                        helperText={errors.mobile}
                      ></TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Email"
                        name="email"
                        readOnly={readOnly}
                        error={errors.email}
                        helperText={errors.email}
                        defaultValue={values.email}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Amount Limit"
                        name="amount_limit"
                        value={values.amount_limit}
                        helperText={errors.amount_limit}
                        readOnly={readOnly}
                        error={errors.amount_limit}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        money
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={12}>
                      <Typography className={classes.title} variant="h4">Card Details</Typography>

                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="DT Plus Card Number "
                        name="dtplus_card_number"
                        value={values.dtplus_card_number}
                        error={errors.dtplus_card_number}
                        readOnly={readOnly}
                        helperText={errors.dtplus_card_number}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Name on Card"
                        name="name_on_card"
                        value={values.name_on_card}
                        error={errors.name_on_card}
                        readOnly={readOnly}
                        helperText={errors.name_on_card}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Validity"
                        name="validity"
                        value={values.validity}
                        error={errors.validity}
                        readOnly={readOnly}
                        helperText={errors.validity}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        type='number'
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={12}>
                      <Typography className={classes.title} variant="h4">Billing Details</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Client Name"
                        name="client_name"
                        value={values.client_name}
                        error={errors.client_name}
                        readOnly={readOnly}
                        helperText={errors.client_name}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Monthly billing"
                        name="monthly_billing"
                        value={values.monthly_billing}
                        error={errors.monthly_billing}
                        readOnly={readOnly}
                        helperText={errors.monthly_billing}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        money
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Payment method"
                        name="payment_type"
                        value={values.payment_type}
                        error={errors.payment_type}
                        readOnly={readOnly}
                        select
                        helperText={errors.payment_type}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      >
                        <option>Credit</option>
                        <option>Cash</option>
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Credit Period"
                        name="credit_period"
                        value={values.credit_period}
                        error={errors.credit_period}
                        readOnly={readOnly}
                        helperText={errors.credit_period}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Total Credit Outstanding"
                        name="total_credit_os"
                        value={values.total_credit_os}
                        error={errors.total_credit_os}
                        readOnly={readOnly}
                        helperText={errors.total_credit_os}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        money
                      >
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        label="Highest number of days Outstanding"
                        name="highest_days_os"
                        value={values.highest_days_os}
                        error={errors.highest_days_os}
                        readOnly={readOnly}
                        helperText={errors.highest_days_os}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      >
                      </TextInput>
                    </Grid>
                  </Grid>
                </form>
              </Box >
            </div>
          </div>
        )
      } */}
      
      {/* <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              // disabled={loading}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>

          {!readOnly ? (
            !loading ? (
              <>
                <Button
                  variant="contained"
                  type="submit"
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                  // disabled={loading}
                  onClick={loading ? () => null : handleSubmit}
                >
                  Save
                </Button>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '90%', margin: '0 auto' }}>
                <CircularProgress size={30} />
              </div>
            )) : (
            <CheckAllowed 
              currentUser={currentUser} 
              resource={resources_id?.fleetOperator} 
              action={action_id?.fleetOperator?.edit}
            >
              <Button
                variant="contained"
                type="submit"
                className={clsx(classes.btn, classes.editButton)}
                startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                // disabled={loading}
                onClick={loading ? () => null : handleEdit}
              >
                Edit
              </Button>
            </CheckAllowed>
          )}
        </div>
      </div> */}
    </ >
  )
}

export default AddNewFleetOperatorForm;