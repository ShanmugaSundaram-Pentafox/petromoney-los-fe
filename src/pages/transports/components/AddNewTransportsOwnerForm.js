import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import { addNewTransport } from '../../../services/transports.service'; 
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';


const AddNewTransportsOwnerForm = ({ handleNext }) => {
    const [apiStatus, setApiStatus] = useState({});
    const [omcs, setOmcs] = useState([]);
    const [bussinessType, setBussinessType] = useState([]);
    const [regions, setRegions] = useState([]);
    const [checked, setChecked] = useState(false);
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
    });
    const [selectedDate, setSelectedDate] = useState(
        new Date()
    )
    const handleDateChange = (date) => {
        setSelectedDate(date)
    }


    const handleClick = () => {
        setChecked(!checked);
    };

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentYearDiff = date.getFullYear() - 1970;


    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {},
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // id: Yup.number().required('Please enter transporter code'),
            name: Yup.string().required('Please enter transporter name'),
            mobile: Yup.number().min(10, 'Enter valid mobile number').required('please Enter your mobile number'),
            omc: Yup.string().required('Please Choose OMC'),
            business_type: Yup.string().required('Please choose bussiness type'),
            region: Yup.string().required('Please choose region'),
            address: Yup.string().required('Please enter address'),
            state: Yup.string().required('Please choose state'),
            district: Yup.string().required('Please choose district'),
            pincode: Yup.number().min(6, 'Pincode must be 6 digits').required("Enter pincode"),
            gst: Yup.number().min(15, 'Enter valid GST')
        }),
        onSubmit: formData => {
            addNewTransport(formData)
                .then(message => {
                    setApiStatus({ type: 'success', message: message })
                })
                .catch(e => {
                    setApiStatus({ type: 'error', message: e })
                    console.log(e);
                })
        }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    const AntSwitch = withStyles((theme) => ({
        root: {
            width: 28,
            height: 16,
            padding: 0,
            display: 'flex',
        },
        switchBase: {
            marginBottom: 4,
            padding: 2,
            color: theme.palette.grey[500],
            '&$checked': {
                transform: 'translateX(12px)',
                color: theme.palette.common.white,
                '& + $track': {
                    opacity: 1,
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                },
            },
        },
        thumb: {
            width: 12,
            height: 12,
            boxShadow: 'none',
        },
        track: {
            border: `1px solid ${theme.palette.grey[500]}`,
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: theme.palette.common.white,
        },
        checked: {},
    }))(Switch);
    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <TextInput
                            label="First Name"
                            name="first_name"
                            error={errors.first_name}
                            // readOnly={readOnly}
                            defaultValue={values.first_name}
                            helperText={errors.first_name}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            label="Last Name"
                            name="last_name"
                            // readOnly={readOnly}
                            error={errors.last_name}
                            helperText={errors.last_name}
                            defaultValue={values.last_name}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                // disableToolbar
                                hideTabs={true}
                                variant='inline'
                                inputVariant='outlined'
                                label="Date of Birth"
                                format='dd/MM/yyy'
                                // views={["date", "month", "year"]}
                                animateYearScrolling={true}
                                invalidDateMessage='Invalid Date Format'
                                minDate={Date("01-01-1900")}
                                margin='normal'
                                id='date-picker'
                                autoOk={true}
                                // label='Disbursement Date'
                                value={selectedDate}
                                onChange={handleDateChange}
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
                        {/* <TextInput
                            id="date"
                            label="Date of Birth"
                            name="dob"
                            error={errors.dob}
                            helperText={errors.dob}
                            // readOnly={readOnly}
                            defaultValue={values.dob}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        /> */}
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            select
                            label="Gender"
                            name="gender"
                            error={errors.gender}
                            helperText={errors.gender}
                            value={values.gender}
                            // disabled={readOnly}
                            onChange={handleChange}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="null">Select Gender</option>
                            <option value={'MALE'}>Male</option>
                            <option value={'FEMALE'}>Female</option>
                        </TextInput>
                    </Grid>
                    <Grid item md={12}>
                        <TextInput
                            label="Address"
                            name="address"
                            // readOnly={readOnly}
                            defaultValue={values.address}
                            error={errors.address}
                            helperText={errors.address}
                            onChange={handleChange}
                            rows={3}
                            multiline={true}
                            InputLabelProps={{ shrink: true }}

                        />
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            select
                            label="Residing Since"
                            name="residing_since"
                            value={values.residing_since}
                            error={errors.residing_since}
                            onChange={handleChange}
                            // disabled={readOnly}
                            SelectProps={{
                                native: true,
                            }}

                        >
                            {
                                <>
                                    <option value="null">Residing Since</option>
                                    {[...Array(currentYearDiff)].map((_, i) => {
                                        return (
                                            <option value={currentYear - i}>{currentYear - i}</option>
                                        )
                                    })}
                                </>
                            }
                        </TextInput>
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            label="Mobile"
                            name="mobile"
                            // readOnly={readOnly}
                            value={values.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                            helperText={errors.mobile}
                            type='number'
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            label="Email"
                            name="email"
                            // readOnly={readOnly}
                            error={errors.email}
                            helperText={errors.email}
                            defaultValue={values.email}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <TextInput
                            select
                            label="Marital Status"
                            name="marital_status"
                            error={errors.marital_status}
                            helperText={errors.marital_status}
                            // readOnly={readOnly}
                            value={values.marital_status}
                            onChange={handleChange}
                            // disabled={readOnly}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="null">Choose Marital Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </TextInput>
                    </Grid>
                    <Grid item md={6}>
                        <Typography component="div">
                            <Grid component="label" container alignItems="center" style={{ marginBottom: '10px', marginTop: '6px' }} spacing={2}>
                                <Grid md={12} style={{ paddingLeft: '8px' }}>Mobile number on Whatsapp?</Grid>
                                <Grid style={{ paddingLeft: '8px' }}>No</Grid>
                                <Grid>
                                    <Switch
                                        checked={state.checkedA}
                                        onChange={handleChange}
                                        name="checkedA"
                                        color="primary"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </Grid>
                                <Grid>Yes</Grid>
                            </Grid>
                        </Typography>
                    </Grid>

                    <Grid item md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            size="large"
                            // type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleNext}

                        >
                            Add Owner
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Box >
    )
}

export default AddNewTransportsOwnerForm;