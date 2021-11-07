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

const Profile = ({ readOnly, currentUser }) => {
    const classes = useStyles();
    readOnly = true;

    const gridItem = {
        item: true,
        className: classes.row
    };
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting } = useFormik({
        initialValues: {},
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            role_id: Yup.number().nullable('Choose Proper User Role').required('Choose Proper User Role'),
            first_name: Yup.string().nullable('Enter first name').required('Enter first name'),
            last_name: Yup.string().nullable('Enter last name').min(1).required('Enter last name'),
            mobile: Yup.number().nullable('Enter Mobile number').min(10, 'Enter valid mobile number').required('Enter Mobile number'),
            email: Yup.string().nullable('Enter valid email').email('Enter valid email'),
            password: Yup.string(),
        }),
        onSubmit: formData => {

        }
    });

    return (
        <>
            <Paper className={classes.paper} >
                <div className={classes.root}>
                    <Avatar className={classes.avatar}>{currentUser.first_name.charAt(0)}</Avatar>
                </div>
                <Typography variant={'h4'} className={classes.profile}>{currentUser.first_name?.toUpperCase()}</Typography>
                <Grid container className={classes.grid}>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="First Name"
                            name="first_name"
                            error={errors.first_name}
                            readOnly={readOnly}
                            value={currentUser.first_name?.toUpperCase()}
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
                            value={currentUser.last_name?.toUpperCase()}
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
                            defaultValue={currentUser.email}
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
                            defaultValue={currentUser.mobile}
                            helperText={errors.mobile}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="City"
                            name="city"
                            error={errors.city}
                            readOnly={readOnly}
                            defaultValue={currentUser.region_name}
                            helperText={errors.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid {...gridItem} md={6}>
                        <TextInput
                            label="Country"
                            name="country"
                            error={errors.country}
                            readOnly={readOnly}
                            defaultValue={"INDIA"}
                            helperText={errors.country}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}
export default Profile;