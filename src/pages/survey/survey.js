import React, { useState, Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import StyledLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API } from '../../config/api';
import apiCall from '../../utils/api.util';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(16),
  },
  title: {
    marginBottom: 12
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 15px 0 -25px rgba(63,63,68,0.1), 0 1px 16px 0 rgba(63,63,68,0.15)',
    padding: theme.spacing(3),
    background: "white"
  },
  paper: {
    // marginTop: theme.spacing(8),
    minWidth: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  logoWrapper: {
    background: "white",
    padding: '16px',
    marginTop: `-100px`,
    borderRadius: 68
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 0),
    fontSize: 18,
    fontWeight: 700,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8)
  },
  inputGroup: {
    marginTop: 20,
    padding: 10,
    borderRadius: 4,
    '&:nth-child(even)': {
      backgroundColor: 'rgba(180,180,180,0.075)'
    },
  },
  question: {
    marginBottom: 4,
    color: "#000"
  }
}));

const textStyles = {
  root: {
    // '& label.Mui-focused': {
    //   fontSize: 13
    // },
    '& .MuiInputBase-input': {
      fontSize: 16,
    },
    '& .MuiInputBase-input[readonly]+fieldset': {
      borderStyle: 'dotted',
      borderColor: 'rgba(0, 0, 0, 0.4)'
    },
    '& .PrivateNotchedOutline-legendLabelled-14 > span': {
      fontSize: 16
    },
    '& .PrivateNotchedOutline-legendLabelled-15 > span': {
      fontSize: 16
    },
    '& .PrivateNotchedOutline-legendLabelled-16 > span': {
      fontSize: 16
    }
  },
  shrink: {
    fontSize: 18,
    fontWeight: 600
  },
  // label: {
  //   fontSize: 16,
  // },
  focused: {
    fontSize: 18,
    fontWeight: 600
  }
}

const InputField = withStyles(textStyles)(({ money, ...props}) => (
  <TextField
    type={money ? "number" : "text"}
    variant="outlined"
    margin="normal"
    size="medium"
    // required
    fullWidth
    InputProps={{
      startAdornment: money ? <InputAdornment position="start">₹</InputAdornment> : undefined,
    }}
    InputLabelProps={{
      classes: {
        root: props.classes.label,
        shrink: props.classes.shrink,
        focused: props.classes.focused
      }
    }}
    {...props}
  />
))

const GridText = ({ className, label, value, variant='h5', variantLabel='span' }) => value ? (
  <Grid container >
    <Grid item xs={3}>
      <Typography className={className} component="span" variant={variantLabel}>
        {label}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography className={className} component="div" variant={variant}>
      {value}
      </Typography>
    </Grid>
  </Grid>
) : null

const Survey = (props) => {
  const classes = useStyles();
  const [apiStatus, setApiStatus] = useState({});
  const [transporterInfo, setTransporterInfo] = useState({});
  // const [vehiclesInfo, setVehiclesInfo] = useState([]);
  const validationSchema = Yup.object().shape({
    transporter: Yup.number().min(8).required('Enter Tranporter Code'),
    able_to_reach_dealer: Yup.string().required("Choose anything"),
    dealer_code: Yup.string(),
    total_vehicle_ins_premium_yr_for_tankers: Yup.number(),
    total_vehicle_ins_premium_yr_for_personal_vehicles: Yup.number(),
    for_petrolium_dealer_pkg_plcy: Yup.number(),
    for_cash_in_transit: Yup.number(),
    amount_spend_on_all_vehicles_yr: Yup.number(),
    annual_spend_for_tanker_fc: Yup.number(),
    annual_spend_for_tanker_calib: Yup.number(),
    annual_spend_for_tanker_service: Yup.number(),
    interested_in_credit: Yup.string(),
    remarks: Yup.string(),
    // mobile: Yup.string().matches(/^\d{10}$/).required("Enter valid mobile number"),
  })
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useFormik({
    initialValues: {
      transporter: '',
      able_to_reach_dealer: '',
      dealer_code: '',
      total_vehicle_ins_premium_yr_for_tankers: '',
      total_vehicle_ins_premium_yr_for_personal_vehicles: '',
      for_petrolium_dealer_pkg_plcy: '',
      for_cash_in_transit: '',
      amount_spend_on_all_vehicles_yr: '',
      annual_spend_for_tanker_fc: '',
      annual_spend_for_tanker_calib: '',
      annual_spend_for_tanker_service: '',
      interested_in_credit: '',
      remarks: '',
    },
    validationSchema,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      // console.log('Form Values >> ', values);
      if (values.hp) return null;

      if (values.able_to_reach_dealer === "Yes") {
        if (values.dealer_code === '') {
          setApiStatus({ show: true, type: 'error', message: 'Please Enter Dealer Code'});
          return null;
        }
        if (values.amount_spend_on_all_vehicles_yr === '') {
          setApiStatus({ show: true, type: 'error', message: 'Please fill Question 3'});
          return null;
        }
        if (values.interested_in_credit === '') {
          setApiStatus({ show: true, type: 'error', message: 'Please fill Question 5'});
          return null;
        }
      }
      
      setSubmitting(true);
      // const url = `https://script.google.com/macros/s/AKfycbyPfjvkTdy9vODrRhIBmUaTIbU96fak3gYH7ASr4jd_w734yoI/exec`;
      const url = `https://script.google.com/macros/s/AKfycbxbl1ml_p4fQ5y2JYt8YLCKBBnWs7HyMUpC38W9Y271619TmppP/exec`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        setSubmitting(false)
        if (xhr.readyState === 4 && xhr.status === 200) {
          setApiStatus({ show: true, type: 'success', message: 'Thank you. Survey is submitted.'});
          resetForm();
        } else {
          setApiStatus({ show: true, type: 'error', message: 'Unable to submit the survey!'});
        }
      };
      // url encode form data for sending as post data
      var encoded = Object.keys(values).map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(values[k]);
      }).join('&');
      
      xhr.send(encoded);
      // fetch(`https://script.google.com/macros/s/AKfycbyPfjvkTdy9vODrRhIBmUaTIbU96fak3gYH7ASr4jd_w734yoI/exec`, {
      //   method: 'POST',
      //   body: {

      //   }
      // })
    }
  });

  const getTransporterInfo = () => {
    // API.get(`temp/transporter/info/${values.transporter}`)
    //   .then(({ status, data: { data } }) => {
    //     console.log('>>', status, data)
    //     if(Array.isArray(data) && data[0]) {
    //       setTransporterInfo(data[0])
    //       // return API.get(`transporters/${values.transporter}/vehicles`);
    //     } else {
    //       setApiStatus({ show: true, type: 'error', message: 'Transporter Code not found!'});
    //       return { data: null };
    //     }
    //   })
    apiCall(`temp/transporter/info/${values.transporter}`)
    .then(({ status, data: { data } }) => {
      console.log('>>', status, data)
      if(Array.isArray(data) && data[0]) {
        setTransporterInfo(data[0])
        // return API.get(`transporters/${values.transporter}/vehicles`);
      } else {
        setApiStatus({ show: true, type: 'error', message: 'Transporter Code not found!'});
        return { data: null };
      }
    })
      // .then(({ data }) => {
      //   if(data === null) {

      //   } else if(Array.isArray(data.data) && data.data.length) {
      //     setVehiclesInfo(data.data);
      //   } else {
      //     setApiStatus({ show: true, type: 'error', message: 'Vehicles not available for this Transporter!'});
      //   }
      // })
      .catch(err => {
        setApiStatus({ show: true, type: 'error', message: 'Unable to get data from server. Please try again later.'});
        console.log(err)
      })
  }

  return (
    <Container className={classes.container} component="main" maxWidth="md">
      {/* <CssBaseline /> */}
      <div className={classes.wrapper}>
        <div className={classes.logoWrapper}>
          <img
            alt="Logo"
            src="/images/logo.png"
            height="108px"
          />
        </div>
        <div className={classes.paper}>
          <Typography className={classes.title} component="h1" variant="h2">
            Petromoney - Insurance Survey
          </Typography>
          <Snackbar open={apiStatus.show} autoHideDuration={4000} onClose={() => setApiStatus({ show: false })}>
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          </Snackbar>
          <form className={classes.form} onSubmit={handleSubmit} autoComplete="off" noValidate>
            
            <Grid container>
              <Grid item xs={6}>
                <InputField
                  autoFocus
                  value={values.transporter}
                  error={errors.transporter}
                  onChange={handleChange}
                  label="Transporter Code"
                  type="number"
                  name="transporter"
                  InputProps={{
                    endAdornment: values.transporter && String(values.transporter).length >= 7 ? (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={getTransporterInfo}
                        >
                          Check
                        </Button>
                      </InputAdornment>
                    ) : undefined
                  }}
                />
              </Grid>
            </Grid>

            <div className={classes.inputGroup}>
              <GridText
                className={classes.question}
                label="Transporter Name"
                value={transporterInfo.name?.toUpperCase()}
              />
              <GridText
                className={classes.question}
                label="Phone"
                value={transporterInfo.mobile}
              />
              <GridText
                className={classes.question}
                label="No of Vehicles"
                value={transporterInfo.vehicle_count}
              />
              <GridText
                className={classes.question}
                label="Total Credit Value"
                value={transporterInfo.credit_limit}
              />
            </div>

            <div className={classes.inputGroup}>
              <Typography className={classes.question} component="h4" variant="h5">
                Able to reach Dealer? *
              </Typography>
              <RadioGroup aria-label="able_to_reach_dealer" required name="able_to_reach_dealer" value={values.able_to_reach_dealer} onChange={handleChange}>
                <FormGroup row>
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </FormGroup>
              </RadioGroup>
            </div>

            {
              values.able_to_reach_dealer === "Yes" ? (
                <Fragment>

                  <div className={classes.inputGroup}>
                    <Grid container direction="column">
                      <Grid item xs={6}>
                        <InputField
                          required={false}
                          error={errors.dealer_code}
                          value={values.dealer_code}
                          onChange={handleChange}
                          label="Dealer Code"
                          name="dealer_code"
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className={classes.inputGroup}>
                    <Typography className={classes.question} component="h4" variant="h5">
                      1. What is the total vehicle insurance premium you pay in a year?
                    </Typography>
                    <Grid container direction="column">
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          value={values.total_vehicle_ins_premium_yr_for_tankers}
                          onChange={handleChange}
                          label="For Tankers"
                          name="total_vehicle_ins_premium_yr_for_tankers"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          value={values.total_vehicle_ins_premium_yr_for_personal_vehicles}
                          onChange={handleChange}
                          label="For Personal Vehicles"
                          name="total_vehicle_ins_premium_yr_for_personal_vehicles"
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className={classes.inputGroup}>
                    <Typography className={classes.question} component="h4" variant="h5">
                      2. What is the total premium you pay per year for the Outlet? 
                    </Typography>
                    <Grid container direction="column">
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          value={values.for_petrolium_dealer_pkg_plcy}
                          onChange={handleChange}
                          label="For petroleum dealer package policy"
                          name="for_petrolium_dealer_pkg_plcy"
                        />
                      </Grid>
                      <Grid item xs={6}>  
                        <InputField
                          money
                          required={false}
                          value={values.for_cash_in_transit}
                          onChange={handleChange}
                          label="For cash in transit"
                          name="for_cash_in_transit"
                        />
                      </Grid>
                    </Grid>
                  </div>
                  
                  <div className={classes.inputGroup}>
                    <Typography className={classes.question} component="h4" variant="h5">
                      3. What is the amount you spend for Tyre's & automotive batteries in a year? (Tanker & all personal vehicles) *
                    </Typography>
                    <Grid container direction="column">
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          error={errors.amount_spend_on_all_vehicles_yr}
                          value={values.amount_spend_on_all_vehicles_yr}
                          onChange={handleChange}
                          name="amount_spend_on_all_vehicles_yr"
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className={classes.inputGroup}>
                    <Typography className={classes.question} component="h4" variant="h5">
                      4. What is your annual spend towards 
                    </Typography>
                    <Grid container direction="column">
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          value={values.annual_spend_for_tanker_fc}
                          onChange={handleChange}
                          label="FC of the Tanker"
                          name="annual_spend_for_tanker_fc"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          value={values.annual_spend_for_tanker_calib}
                          onChange={handleChange}
                          label="Calibration of the Tanker"
                          name="annual_spend_for_tanker_calib"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <InputField
                          money
                          required={false}
                          value={values.annual_spend_for_tanker_service}
                          onChange={handleChange}
                          label="Servicing of the Tanker"
                          name="annual_spend_for_tanker_service"
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className={classes.inputGroup}>
                    <Typography className={classes.question} component="h4" variant="h5">
                      5. Would you be interested in taking the credit facility against the tanker rent you receive for the above spends? *
                    </Typography>
                    <RadioGroup aria-label="interested_in_credit" name="interested_in_credit" value={values.interested_in_credit} onChange={handleChange}>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                      <FormControlLabel value="Maybe" control={<Radio />} label="Maybe" />
                    </RadioGroup>
                  </div>
                </Fragment>
              ) : null
            }
            
            <InputField
              multiline
              rows={4}
              value={values.remarks}
              onChange={handleChange}
              label="Remarks"
              name="remarks"
              required={false}
            />

            <InputField
              value={values.hp}
              onChange={handleChange}
              name="hp"
              style={{ display: "none" }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? `Please wait...` : `Submit`}
            </Button>
            {
              isSubmitting && <CircularProgress />
            }
          </form>
        </div>
      </div>
    </Container>
  );
}

export default Survey;