import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import Currency from '../../../components/Number/Currency';
import TextInput from '../../../components/TextInput/TextInput';
import { addOutletDetails } from '../../../services/PDReport.services';

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
    backgroundColor: '#f6f6f6',
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
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  }

}))

const AddNewOutletDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser, editable }) => {

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
  const [loading, setLoading] = useState(false)
  console.log(data);

  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    callback();
  };
  const relationShipOptions = [
    { label: 'Choose Relationship', value: '' },
    { label: 'Father', value: 'FATHER' },
    { label: 'Mother', value: 'MOTHER' },
    { label: 'Uncle', value: 'UNCLE' },
    { label: 'Aunt', value: 'AUNT' },
    { label: 'Son', value: 'SON' },
    { label: 'Daughter', value: 'DAUGHTER' },
    { label: 'Grandfather', value: 'GRANDFATHER' },
    { label: 'Grandmother', value: 'GRANDMOTHER' },
    { label: 'Mother-in-law', value: 'MOTHER-IN-LAW' },
    { label: 'Father-in-law', value: 'FATHER-IN-LAW' },
    { label: 'Sister-in-law', value: 'SISTER-IN-LAW' },
    { label: 'Brother-in-law', value: 'BROTHER-IN-LAW' },
    { label: 'Brother', value: 'BROTHER' },
    { label: 'Newphew', value: 'NEPHEW' },
    { label: 'Partner', value: 'PARTNER' },
    { label: 'Friend', value: 'FRIEND' },
    { label: 'Shareholder', value: 'SHAREHOLDER' },
    { label: 'Buyer', value: 'BUYER' },
    { label: 'Supplier', value: 'SUPPLIER' },
    { label: 'Business Neighbour', value: 'BUSINESS NEIGHBOUR' },
    { label: 'Home Neighbour', value: 'HOME NEIGHBOUR' },
    { label: 'Director', value: 'DIRECTOR' },
    { label: 'Proprietor', value: 'PROPRIETOR' },
    { label: 'Debtors', value: 'DEBTORS' },
    { label: 'Creditors', value: 'CREDITORS' },
    { label: 'Principal', value: 'PRINCIPAL' },
    { label: 'Others', value: 'OTHERS' }
  ]




  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {
      ...data,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      outlet_category: Yup.string().nullable('Choose outlet category').required('Choose outlet category'),
      distance_from_headquarters: Yup.string().nullable('Please enter fuel transported from area').required('Please enter fuel transported from area'),
      terminal_name: Yup.string().nullable('Please enter terminal name').required('Please enter terminal name'),
      land_type: Yup.string().nullable('Enter land type').required('Enter land type'),
      outlet_operated_by: Yup.string().nullable('Enter operator name').required('Enter operator name'),
      land_owner_name: Yup.string().nullable('Enter land owner name').required('Enter land owner name')
    }),
    onSubmit: values => {
      const data = { ...values }
      addOutletDetails(data, dealer_id)
        .then(res => {
          enqueueSnackbar(res, {
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
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
      console.log(values);
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Outlet Details</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            {
              readOnly ? 
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <ViewData title='Outlet category' value={values.outlet_category} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Distance from headquarters' value={values.distance_from_headquarters} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Terminal name' value={values.terminal_name} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Distance from Terminal (in Km)' value={values.distance_from_terminal} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Land Type' value={values.land_type} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Land Owner Name' value={values.land_owner_name} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Lease Amount' value={<Currency value={values.lease_amount}/>} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Outlet operated by' value={values.outlet_operated_by} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Relationship with owner' value={values.relation_type_with_owner} style={{marginBottom:6}} />
                  </Grid>
                  <Grid item md={6}>
                    <ViewData title='Operator Mobile number' value={values.operator_mobile} style={{marginBottom:6}} />
                  </Grid>
                </Grid> : 
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      <TextInput
                        select
                        {...inputProps}
                        labelText="Outlet category"
                        name="outlet_category"
                        value={values.outlet_category}
                        readOnly={readOnly}
                        disabled={readOnly}
                        error={errors.outlet_category}
                        helperText={errors.outlet_category}
                      >
                        <option value="">Choose category</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        className={classes.number}
                        inputProps={{ className: classes.input }}
                        type='number'
                        labelText="Distance from headquarters"
                        name="distance_from_headquarters"
                        value={values.distance_from_headquarters}
                        readOnly={readOnly}
                        error={errors.distance_from_headquarters}
                        helperText={errors.distance_from_headquarters}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Terminal name"
                        name="terminal_name"
                        value={values.terminal_name}
                        readOnly={readOnly}
                        error={errors.terminal_name}
                        helperText={errors.terminal_name}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        className={classes.number}
                        inputProps={{ className: classes.input }}
                        type='number'
                        labelText="Distance from Terminal (in Km)"
                        name="distance_from_terminal"
                        value={values.distance_from_terminal}
                        readOnly={readOnly}
                        error={errors.distance_from_terminal}
                        helperText={errors.distance_from_terminal}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        select
                        labelText="Land Type"
                        name="land_type"
                        value={values.land_type}
                        readOnly={readOnly}
                        disabled={readOnly}
                        error={errors.land_type}
                        helperText={errors.land_type}
                      >
                        <option value=""></option>
                        <option value="Owned">Owned</option>
                        <option value="leased">Leased</option>
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Land Owner Name"
                        name="land_owner_name"
                        value={values.land_owner_name}
                        readOnly={readOnly}
                        error={errors.land_owner_name}
                        helperText={errors.land_owner_name}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        money
                        className={classes.number}
                        inputProps={{ className: classes.input }}
                        labelText="Lease Amount"
                        name="lease_amount"
                        value={values.lease_amount}
                        readOnly={readOnly}
                        error={errors.lease_amount}
                        helperText={errors.lease_amount}
                        type='number'
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        select
                        labelText="Outlet operated by"
                        name="outlet_operated_by"
                        value={values.outlet_operated_by}
                        readOnly={readOnly}
                        disabled={readOnly}
                        error={errors.outlet_operated_by}
                        helperText={errors.outlet_operated_by}
                      >
                        <option value=""></option>
                        <option value="Proprietor">Proprietor</option>
                        <option value="Managing partner">Managing Partner</option>
                        <option value="Third party">Third Party</option>
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        select
                        labelText="Relationship with owner"
                        name="relation_type_with_owner"
                        error={errors.relation_type_with_owner}
                        helperText={errors.relation_type_with_owner}
                        readOnly={readOnly}
                        value={values.relation_type_with_owner}
                        disabled={readOnly}
                      >
                        {
                          relationShipOptions.map((item, i) => {
                            return (
                              <option value={item.value} key={i}>{item.label}</option>
                            )
                          })
                        }
                      </TextInput>
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        inputProps={{ className: classes.input }}
                        labelText="Operator Mobile number"
                        name="operator_mobile"
                        type="number"
                        value={values.operator_mobile}
                        readOnly={readOnly}
                        error={errors.operator_mobile}
                        helperText={errors.operator_mobile}
                      />
                    </Grid>
                  </Grid>
                </form>
            }
          </Box >
        </div>
      </div>
      <div className={classes.actionFooter}>
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
          {
            !editable &&
              <Button
                variant="contained"
                type="submit"
                className={clsx(classes.btn, classes.editButton)}
                startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
              >
                {loading ? <CircularProgress size={20} /> : readOnly ? 'Edit' :
                  'Save'}
              </Button>
          }
        </div>
      </div>
    </div>


  )
}

export default AddNewOutletDetailsForm;