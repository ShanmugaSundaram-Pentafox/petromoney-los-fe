import React from 'react';
import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '../../components/TextInput/TextInput';
import { Avatar } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        display: 'flex',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    avatar: {
        width: 60,
        height: 60
    },
    paper: {
        maxWidth: '40vw',
        minHeight: '100vh',
        margin: 'auto',
        padding: 12,
        // textAlign: 'center'
    },
    profile: {
        marginBottom: 40,
        textAlign: 'center'

    },
    row: {
        paddingRight: 12,
        paddingBottom: 14
    },
    grid: {
        display: 'flex',
        justifyContent: 'space-between'

    },
    button: {
        float: 'right',
        margin: 12,

    },

}));

const Profile = ({ readOnly }) => {
    const classes = useStyles();


    const gridItem = {
        item: true,
        className: classes.row
    };
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {},
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            role_id: Yup.number().required('Choose Proper User Role'),
            first_name: Yup.string().required('Enter first name'),
            last_name: Yup.string().min(1).required('Enter last name'),
            mobile: Yup.number().min(10, 'Enter valid mobile number').required('Enter Mobile number'),
            email: Yup.string().email("Enter valid email"),
            password: Yup.string(),
        }),
        onSubmit: formData => {

        }
    });
    return (
        <>
            <Paper className={classes.paper} >
                <div className={classes.root}>
                    <Avatar className={classes.avatar}>P</Avatar>
                </div>
                <Typography variant={'h4'} className={classes.profile}>User Name</Typography>
                <Grid container className={classes.grid}>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="First Name"
                            name="first_name"
                            error={errors.first_name}
                            readOnly={readOnly}
                            defaultValue={values.first_name}
                            helperText={errors.first_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="Last Name"
                            name="last_name"
                            error={errors.last_name}
                            readOnly={readOnly}
                            defaultValue={values.last_name}
                            helperText={errors.last_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="Email"
                            name="mail"
                            error={errors.mail}
                            readOnly={readOnly}
                            defaultValue={values.mail}
                            helperText={errors.mail}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="Mobile Number"
                            name="mobile"
                            error={errors.mobile}
                            readOnly={readOnly}
                            defaultValue={values.mobile}
                            helperText={errors.mobile}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={12}>
                        <TextInput
                            label="Address"
                            name="address"
                            error={errors.address}
                            readOnly={readOnly}
                            defaultValue={values.address}
                            helperText={errors.address}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="City"
                            name="city"
                            error={errors.city}
                            readOnly={readOnly}
                            defaultValue={values.city}
                            helperText={errors.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="State"
                            name="state"
                            error={errors.state}
                            readOnly={readOnly}
                            defaultValue={values.state}
                            helperText={errors.state}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="Pin Code"
                            name="pincode"
                            error={errors.pincode}
                            readOnly={readOnly}
                            defaultValue={values.pincode}
                            helperText={errors.pincode}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="Country"
                            name="country"
                            error={errors.country}
                            readOnly={readOnly}
                            defaultValue={values.country}
                            helperText={errors.country}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                >
                    Save
                </Button>
            </Paper>
        </>
    )
}
export default Profile;